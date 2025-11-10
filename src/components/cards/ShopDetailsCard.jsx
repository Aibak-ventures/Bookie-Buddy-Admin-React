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
  ProjectorIcon
} from 'lucide-react';
import ShopDetailItem from './ShopDetailItem';
import UpdateShopModal from '../Modals/UpdateShopModal';

const ShopDetailsCard = ({ shopData }) => {
  
  const [showModal, setShowModal] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'NA';
    const words = name.trim().split(' ').filter(word => word.length > 0);
    if (words.length === 0) return 'NA';
    if (words.length > 1) {
      return words[0][0].toUpperCase() + words[1][0].toUpperCase();
    }
    return name.trim().slice(0, 2).toUpperCase();
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
        <button
          className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <Edit size={16} />
          Edit Shop Details
        </button>
      </div>
    </>
  );
};

export default ShopDetailsCard;
