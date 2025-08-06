import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';

const FileUpload = ({ 
  label, 
  onFileChange, 
  accept = "image/*",
  multiple = false,
  required = false,
  className = "",
  ...props 
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const withPreview = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedFiles(withPreview);
    onFileChange(withPreview.map(f => f.file)); // Send only file objects
  };

  const removeFile = (indexToRemove) => {
    const updated = selectedFiles.filter((_, index) => index !== indexToRemove);
    setSelectedFiles(updated);
    onFileChange(updated.map(f => f.file));
  };

  useEffect(() => {
    return () => {
      selectedFiles.forEach(f => URL.revokeObjectURL(f.preview));
    };
  }, [selectedFiles]);

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${className}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Drag & Drop image here</span>
        </p>
        <p className="text-xs text-gray-500 mb-4">Accepted: .JPG, .PNG, etc.</p>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          {...props}
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
        >
          Browse File
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Preview:</h4>
          {selectedFiles.map((f, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-gray-100 rounded shadow-sm">
              <div className="flex items-center gap-3">
                {f.file.type.startsWith('image/') && (
                  <img src={f.preview} alt="preview" className="w-16 h-16 object-cover rounded" />
                )}
                <span className="text-sm text-gray-700">{f.file.name}</span>
              </div>
              <button
                onClick={() => removeFile(i)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
