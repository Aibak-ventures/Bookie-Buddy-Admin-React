import React, { useState } from 'react';
import {
  Phone,
  Mail,
  CreditCard,
  MapPin,
  Package,
  Edit,
  Calendar,
  ListOrdered,
  ProjectorIcon,
  User,
  MessageCircle
} from 'lucide-react';
import ShopDetailItem from './ShopDetailItem';
import UpdateShopModal from '../Modals/UpdateShopModal';
import GenerateInvoiceModal from '../Modals/GenerateInvoiceModal';
import WhatsAppConfigModal from '../Modals/WhatsAppConfigModal';
import ConfirmationModal from '../Modals/ConfirmationModal';
import {
  getWhatsAppConfig,
  createWhatsAppConfig,
  updateWhatsAppConfig,
  deleteWhatsAppConfig
} from '../../api/AdminApis';

const ShopDetailsCard = ({ shopData }) => {
  
  const [showModal, setShowModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsAppConfig, setWhatsAppConfig] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loadingWhatsApp, setLoadingWhatsApp] = useState(false);


  const getInitials = (name) => {
    if (!name) return 'NA';
    const words = name.trim().split(' ').filter(word => word.length > 0);
    if (words.length === 0) return 'NA';
    if (words.length > 1) {
      return words[0][0].toUpperCase() + words[1][0].toUpperCase();
    }
    return name.trim().slice(0, 2).toUpperCase();
  };

  // Fetch WhatsApp Configuration
  const fetchWhatsAppConfig = async () => {
    setLoadingWhatsApp(true);
    try {
      const response = await getWhatsAppConfig(shopData.id);
      if (response.data) {
        setWhatsAppConfig(response.data);
        setIsEditMode(true);
      }
    } catch (error) {
      console.error("Failed to fetch WhatsApp config:", error);
      setWhatsAppConfig(null);
      setIsEditMode(false);
    } finally {
      setLoadingWhatsApp(false);
    }
  };

  // Open WhatsApp Modal
  const handleWhatsAppClick = async () => {
    await fetchWhatsAppConfig();
    setShowWhatsAppModal(true);
  };

  // Save WhatsApp Configuration
  const handleSaveWhatsAppConfig = async (configData) => {
    try {
      if (isEditMode && whatsAppConfig) {
        await updateWhatsAppConfig(whatsAppConfig.id, configData);
        alert("WhatsApp configuration updated successfully!");
      } else {
        await createWhatsAppConfig(shopData.id, configData);
        alert("WhatsApp configuration created successfully!");
      }
      setShowWhatsAppModal(false);
      await fetchWhatsAppConfig();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to save WhatsApp configuration");
      console.error(error);
    }
  };

  // Delete WhatsApp Configuration
  const handleDeleteWhatsAppConfig = async () => {
    try {
      await deleteWhatsAppConfig(whatsAppConfig.id);
      alert("WhatsApp configuration deleted successfully!");
      setWhatsAppConfig(null);
      setIsEditMode(false);
      setShowDeleteConfirm(false);
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete WhatsApp configuration");
      console.error(error);
    }
  };
  

  return (
    <>
      {/* Modal to update shop details */}
      {showModal && (
        <UpdateShopModal
          shopData={shopData}
          onClose={() => setShowModal(false)}
          onSuccess={() => window.location.reload()} // or better, use a refetch function
        />
      )}

      <div className="bg-white rounded-lg shadow-sm border p-6">
        {/* Shop Image or Initials */}
        <div className="text-center mb-6">
          {shopData.img ? (
            <img
              src={shopData.img}
              alt={shopData.name}
              className="w-20 h-20 rounded-lg object-cover mx-auto mb-4"
            />
          ) : (
            <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">
                {getInitials(shopData.name)}
              </span>
            </div>
          )}
          <h2 className="text-xl font-semibold text-gray-900">{shopData.name}</h2>
          <p className="text-gray-600">{shopData.place || 'Not specified'}</p>
        </div>

        {/* Shop Details */}
        <div className="space-y-4">
          {shopData.phone && <ShopDetailItem icon={Phone} text={shopData.phone} />}
          {shopData.phone2 && <ShopDetailItem icon={Phone} text={shopData.phone2} />}

          {shopData.email && <ShopDetailItem icon={Mail} text={shopData.email} />}
          {shopData.gst_number && <ShopDetailItem icon={CreditCard} text={shopData.gst_number} />}



          <ShopDetailItem
            icon={MapPin}
            text={
              `${shopData.address || ''}, ${shopData.city || ''}, ${shopData.state || ''}, ${shopData.pincode || ''}, ${shopData.place || ''}`.replace(/(, )+/g, ', ').replace(/^, |, $/g, '')
            }
          />

          {/* {shopData.extra_stock_limit && ( */}
            <ShopDetailItem icon={Package} text={`Extra stock limit: ${shopData.extra_stock_limit}`} />
          {/* )} */}
          {shopData.created_at && (
            <ShopDetailItem icon={Calendar} text={`Created: ${shopData.created_at}`} />

          )}
          
          <ShopDetailItem icon={ProjectorIcon} text={`Total products: ${shopData.total_product_count}`} />
          <ShopDetailItem icon={ProjectorIcon} text={`Invoice start for sales : ${shopData.sale_start_id }`} />
          <ShopDetailItem icon={ProjectorIcon} text={`Invoice start for booking : ${shopData.booking_start_id }`} /> 
          <ShopDetailItem icon={ProjectorIcon} text={`Subscription Renewal Price : ${shopData.subscription_renewal_price }`} /> 
          <ShopDetailItem icon={User} text={`Extra user limit: ${shopData.extra_user_limit}`} />





          {Array.isArray(shopData.terms_and_conditions) && shopData.terms_and_conditions.length > 0 && (
            <div className="flex items-start gap-2 text-gray-700">
              <ListOrdered className="mt-1" size={18} />
              <ul className="space-y-1 text-sm">
                {shopData.terms_and_conditions.map((term, idx) => (
                  <li key={idx}>• {term}</li>
                ))}
              </ul>
            </div>
          )}


        </div>

        {/* Edit Button */}
        <div className="flex flex-col gap-3 mt-6">
          <div className="flex gap-3">
            <button
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              onClick={() => setShowModal(true)}
            >
              <Edit size={16} />
              Edit Shop
            </button>

            <button
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              onClick={() => setShowInvoiceModal(true)}
            >
              <ProjectorIcon size={16} />
              Invoice
            </button>
          </div>

          {/* WhatsApp Config Button */}
          <button
            className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-md hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg"
            onClick={handleWhatsAppClick}
            disabled={loadingWhatsApp}
          >
            <MessageCircle size={16} />
            {loadingWhatsApp ? "Loading..." : "WhatsApp Config"}
          </button>

          {/* Delete WhatsApp Config Button (only shown if config exists) */}
          {whatsAppConfig && (
            <button
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete WhatsApp Config
            </button>
          )}
        </div>

      </div>

      {/* Generate Invoice Modal */}
      <GenerateInvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        shopData={shopData}
      />

      {/* WhatsApp Configuration Modal */}
      <WhatsAppConfigModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        onSave={handleSaveWhatsAppConfig}
        config={whatsAppConfig}
        isEditMode={isEditMode}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteWhatsAppConfig}
        message="Are you sure you want to delete the WhatsApp configuration? This action cannot be undone."
      />
    </>
  );
};

export default ShopDetailsCard;
