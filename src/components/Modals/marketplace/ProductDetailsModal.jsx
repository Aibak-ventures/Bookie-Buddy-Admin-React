import React, { useState, useRef } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Video, 
  CheckCircle, 
  XCircle, 
  UploadCloud, 
  Loader2, 
  Trash2 
} from 'lucide-react';
import { 
  getPresignedUrls, 
  uploadToS3, 
  saveMediaToDB,
  deleteProductMedia 
} from '../../../api/MarketplaceApis';

const MAX_IMAGES = 4;
const MAX_VIDEOS = 1;

const ProductDetailsModal = ({ isOpen, onClose, product, onMediaUpdated }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  
  // Track deleting S3 key
  const [deletingKey, setDeletingKey] = useState(null);

  const [mediaGallery, setMediaGallery] = useState({
    images: product?.images || [],
    videos: product?.videos || []
  });

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Sync state when product changes
  React.useEffect(() => {
    if (product) {
      setMediaGallery({
        images: product.images || [],
        videos: product.videos || []
      });
      setSelectedImages([]);
      setSelectedVideo(null);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const currentImageCount = mediaGallery.images.length;
  const currentVideoCount = mediaGallery.videos.length;

  // Handle Delete Existing Media (Images or Video)
  const handleDeleteMedia = async (mediaType, key) => {
    if (!key) {
      alert('Cannot delete this item: Missing S3 key.');
      return;
    }

    if (!window.confirm(`Are you sure you want to remove this ${mediaType}?`)) return;

    setDeletingKey(key);
    try {
      const res = await deleteProductMedia(product.id, mediaType, key);
      
      // Safely extract updated media list from your DRF custom response
      const updatedData = res.data?.data || res.data;

      setMediaGallery({
        images: updatedData.images || [],
        videos: updatedData.videos || [],
      });

      if (onMediaUpdated) onMediaUpdated();
    } catch (err) {
      console.error(`Failed to delete ${mediaType}:`, err.response?.data || err);
      alert('An error occurred while deleting media. Check console for details.');
    } finally {
      setDeletingKey(null);
    }
  };

  // Local Image Selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const availableSlots = MAX_IMAGES - currentImageCount - selectedImages.length;

    if (availableSlots <= 0) {
      alert(`Maximum limit of ${MAX_IMAGES} images reached.`);
      return;
    }

    const validFiles = files.slice(0, availableSlots);
    setSelectedImages((prev) => [...prev, ...validFiles]);
    e.target.value = null; // Reset input
  };

  // Local Video Selection
  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (currentVideoCount >= MAX_VIDEOS) {
      alert(`Maximum limit of ${MAX_VIDEOS} video reached.`);
      return;
    }

    setSelectedVideo(file);
    e.target.value = null; // Reset input
  };

  const removeSelectedImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeSelectedVideo = () => {
    setSelectedVideo(null);
  };

  // Upload Logic (Images)
  const handleUploadImages = async () => {
    if (selectedImages.length === 0) return;

    setUploading(true);
    setUploadProgress('Generating presigned URLs...');

    try {
      const presignedPayload = {
        media_type: 'image',
        files: selectedImages.map((file) => ({
          file_name: file.name,
          content_type: file.type || 'image/jpeg',
        })),
      };

      const res = await getPresignedUrls(product.id, presignedPayload);
      
      const urlDataList = res.data?.data || res.data;

      for (let i = 0; i < selectedImages.length; i++) {
        const file = selectedImages[i];
        const s3Meta = urlDataList[i];

        setUploadProgress(`Uploading image ${i + 1} of ${selectedImages.length}...`);
        await uploadToS3(s3Meta.upload_url, file);

        setUploadProgress(`Saving image ${i + 1} metadata...`);
        const dbPayload = {
          media_type: 'image',
          url: s3Meta.file_url,
          key: s3Meta.key,
          thumbnail_url: '',
          alt: `${product.name} image ${i + 1}`,
          sort_order: mediaGallery.images.length + i,
        };

        const savedRes = await saveMediaToDB(product.id, dbPayload);
        const updatedData = savedRes.data?.data || savedRes.data;

        if (updatedData) {
          setMediaGallery({
            images: updatedData.images || [],
            videos: updatedData.videos || [],
          });
        }
      }

      setSelectedImages([]);
      if (onMediaUpdated) onMediaUpdated();
    } catch (err) {
      console.error('Failed to upload images:', err.response?.data || err);
      alert('An error occurred during upload. Check console for details.');
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  // Upload Logic (Video)
  const handleUploadVideo = async () => {
    if (!selectedVideo) return;

    setUploading(true);
    setUploadProgress('Generating presigned URL for video...');

    try {
      const presignedPayload = {
        media_type: 'video',
        files: [
          {
            file_name: selectedVideo.name,
            content_type: selectedVideo.type || 'video/mp4'
          }
        ]
      };

      const presignedRes = await getPresignedUrls(product.id, presignedPayload);
      const s3Meta = (presignedRes.data?.data || presignedRes.data)[0];

      setUploadProgress('Uploading video to S3...');
      await uploadToS3(s3Meta.upload_url, selectedVideo);

      setUploadProgress('Saving video to database...');
      const dbPayload = {
        media_type: 'video',
        url: s3Meta.file_url,
        key: s3Meta.key,
        thumbnail_url: '',
        alt: `${product.name} video`,
        sort_order: mediaGallery.videos.length
      };

      const savedMedia = await saveMediaToDB(product.id, dbPayload);
      const updatedData = savedMedia.data?.data || savedMedia.data;

      if (updatedData) {
        setMediaGallery({
          images: updatedData.images || [],
          videos: updatedData.videos || [],
        });
      }

      setSelectedVideo(null);
      if (onMediaUpdated) onMediaUpdated();
    } catch (err) {
      console.error('Failed to upload video:', err);
      alert('An error occurred while uploading video. Check console for details.');
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
              {product.is_premium && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full border border-amber-300">
                  Premium
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Code: <span className="font-medium text-gray-700">{product.product_code || 'N/A'}</span> | ID: #{product.id}
            </p>
          </div>
          <button 
            onClick={onClose} 
            disabled={uploading || deletingKey !== null}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Existing Media Gallery with Delete Buttons */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Current Media Gallery</h4>
          <div className="flex gap-3 overflow-x-auto pb-2">
            
            {/* Images */}
            {mediaGallery.images && mediaGallery.images.length > 0 ? (
              mediaGallery.images.map((img, idx) => {
                const imgUrl = typeof img === 'string' ? img : img.url;
                const imgKey = typeof img === 'object' ? img.key : '';

                return (
                  <div key={`img-${idx}`} className="relative group w-20 h-20 rounded-lg overflow-hidden border bg-gray-50 shrink-0">
                    <img
                      src={imgUrl}
                      alt={img.alt || product.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Delete Overlay */}
                    <button
                      type="button"
                      onClick={() => handleDeleteMedia('image', imgKey)}
                      disabled={deletingKey === imgKey || uploading}
                      className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      title="Delete Image"
                    >
                      {deletingKey === imgKey ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} className="text-red-400 hover:text-red-200" />
                      )}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="w-20 h-20 bg-gray-50 rounded-lg flex flex-col items-center justify-center text-gray-400 border border-dashed shrink-0">
                <ImageIcon size={20} />
                <span className="text-[10px] mt-1">No Images</span>
              </div>
            )}

            {/* Videos */}
            {mediaGallery.videos && mediaGallery.videos.length > 0 ? (
              mediaGallery.videos.map((vid, idx) => {
                const vidKey = typeof vid === 'object' ? vid.key : '';

                return (
                  <div 
                    key={`vid-${idx}`} 
                    className="relative group w-20 h-20 bg-black/90 rounded-lg flex flex-col items-center justify-center text-white border shrink-0 overflow-hidden"
                  >
                    <Video size={20} />
                    <span className="text-[10px] mt-1">Video</span>
                    {/* Delete Overlay */}
                    <button
                      type="button"
                      onClick={() => handleDeleteMedia('video', vidKey)}
                      disabled={deletingKey === vidKey || uploading}
                      className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      title="Delete Video"
                    >
                      {deletingKey === vidKey ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} className="text-red-400 hover:text-red-200" />
                      )}
                    </button>
                  </div>
                );
              })
            ) : null}
          </div>
        </div>

        {/* Media Upload Section */}
        <div className="border rounded-lg p-4 bg-purple-50/50 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-semibold text-purple-900 uppercase tracking-wider">
              Upload Media (Max 4 Images, 1 Video)
            </h4>
            {uploading && (
              <div className="flex items-center gap-2 text-xs text-purple-700 font-medium">
                <Loader2 size={14} className="animate-spin" />
                <span>{uploadProgress}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Image Selector Box */}
            <div className="border bg-white rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700">
                  Images ({currentImageCount}/4)
                </span>
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={uploading || currentImageCount >= MAX_IMAGES}
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploading || currentImageCount >= MAX_IMAGES}
                  className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded hover:bg-purple-200 disabled:opacity-50"
                >
                  Select Images
                </button>
              </div>

              {/* Selected Images Queue */}
              {selectedImages.length > 0 && (
                <div className="space-y-2 pt-1 border-t">
                  <div className="flex flex-wrap gap-2">
                    {selectedImages.map((file, idx) => (
                      <div key={idx} className="relative group w-12 h-12 rounded border overflow-hidden">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt="preview" 
                          className="w-full h-full object-cover" 
                        />
                        <button
                          type="button"
                          onClick={() => removeSelectedImage(idx)}
                          disabled={uploading}
                          className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleUploadImages}
                    disabled={uploading}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700 disabled:opacity-50"
                  >
                    <UploadCloud size={14} /> Upload Images ({selectedImages.length})
                  </button>
                </div>
              )}
            </div>

            {/* Video Selector Box */}
            <div className="border bg-white rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700">
                  Video ({currentVideoCount}/1)
                </span>
                <input
                  type="file"
                  ref={videoInputRef}
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="hidden"
                  disabled={uploading || currentVideoCount >= MAX_VIDEOS}
                />
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  disabled={uploading || currentVideoCount >= MAX_VIDEOS}
                  className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded hover:bg-purple-200 disabled:opacity-50"
                >
                  Select Video
                </button>
              </div>

              {/* Selected Video Queue */}
              {selectedVideo && (
                <div className="space-y-2 pt-1 border-t">
                  <div className="flex items-center justify-between text-xs bg-gray-50 p-1.5 rounded border">
                    <span className="truncate max-w-[140px] text-gray-700">{selectedVideo.name}</span>
                    <button
                      type="button"
                      onClick={removeSelectedVideo}
                      disabled={uploading}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleUploadVideo}
                    disabled={uploading}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700 disabled:opacity-50"
                  >
                    <UploadCloud size={14} /> Upload Video
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Grid */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Product Details</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm bg-gray-50 p-4 rounded-lg border">
            <div>
              <span className="text-xs text-gray-500 block">Purchase Cost</span>
              <span className="font-semibold text-gray-900">${product.purchase_cost}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Selling Price</span>
              <span className="font-semibold text-purple-600">${product.selling_price}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Subcategory ID</span>
              <span className="font-medium text-gray-800">{product.subcategory ?? 'N/A'}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Color</span>
              <span className="font-medium text-gray-800">{product.color || 'N/A'}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Model / Fit</span>
              <span className="font-medium text-gray-800">{product.model || 'N/A'}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Min / Max Order Qty</span>
              <span className="font-medium text-gray-800">
                {product.minimum_order_quantity} / {product.maximum_order_quantity}
              </span>
            </div>
          </div>
        </div>

        {/* Fabrics */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Fabrics</h4>
          {product.fabrics && product.fabrics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {product.fabrics.map((fabric) => (
                <span
                  key={fabric.id}
                  className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-md border border-purple-200 capitalize"
                >
                  {fabric.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">No fabrics assigned.</p>
          )}
        </div>

        {/* Available Sizes */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Available Sizes</h4>
          {product.size_options && product.size_options.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {product.size_options.map((size, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-md border">
                  {size}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">No size options listed.</p>
          )}
        </div>

        {/* System Flags & Visibility Settings */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Visibility & Settings</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3 rounded-lg border text-xs">
            <div className="flex items-center space-x-1.5">
              {product.is_active ? <CheckCircle size={15} className="text-green-600" /> : <XCircle size={15} className="text-red-500" />}
              <span className="font-medium">{product.is_active ? 'Active' : 'Inactive'}</span>
            </div>

            <div className="flex items-center space-x-1.5">
              {product.is_public ? <CheckCircle size={15} className="text-green-600" /> : <XCircle size={15} className="text-gray-400" />}
              <span className="font-medium">{product.is_public ? 'Public' : 'Private'}</span>
            </div>

            <div className="flex items-center space-x-1.5">
              {product.show_selling_price ? <CheckCircle size={15} className="text-green-600" /> : <XCircle size={15} className="text-gray-400" />}
              <span className="font-medium">{product.show_selling_price ? 'Price Visible' : 'Price Hidden'}</span>
            </div>

            <div className="flex items-center space-x-1.5">
              {product.is_premium ? <CheckCircle size={15} className="text-amber-600" /> : <XCircle size={15} className="text-gray-400" />}
              <span className="font-medium">{product.is_premium ? 'Premium Item' : 'Standard Item'}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</h4>
          <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg border whitespace-pre-line">
            {product.description || 'No description provided.'}
          </p>
        </div>

        {/* System Timestamps */}
        <div className="text-xs text-gray-400 grid grid-cols-1 sm:grid-cols-3 gap-1 pt-2 border-t">
          <div>Published: <span className="text-gray-600">{product.published_at || 'Not published'}</span></div>
          <div>Created: <span className="text-gray-600">{product.created_at || 'N/A'}</span></div>
          <div>Updated: <span className="text-gray-600">{product.updated_at || 'N/A'}</span></div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-2 border-t">
          <button
            onClick={onClose}
            disabled={uploading || deletingKey !== null}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;