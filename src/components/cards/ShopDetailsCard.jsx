import React from 'react';
import {
  Phone,
  Mail,
  CreditCard,
  MapPin,
  Package,
  Edit,
  Calendar,
  Building2,
  ScrollText,
  BadgeCheck,
  ListOrdered,
} from 'lucide-react';
import ShopDetailItem from './ShopDetailItem';

const ShopDetailsCard = ({ shopData }) => {
  const getInitials = (name) => {
    if (!name) return 'NA';
    const words = name.trim().split(' ');
    return words.length > 1
      ? words[0][0].toUpperCase() + words[1][0].toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
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

      <div className="space-y-4">
        {shopData.phone && <ShopDetailItem icon={Phone} text={shopData.phone} />}
        {shopData.email && <ShopDetailItem icon={Mail} text={shopData.email} />}
        {shopData.gst_number && <ShopDetailItem icon={CreditCard} text={shopData.gst_number} />}
        <ShopDetailItem
          icon={MapPin}
          text={`${shopData.address || ''}, ${shopData.city || ''}, ${shopData.state || ''}, ${shopData.pincode || ''}, ${shopData.place || ''}`}
        />

        <ShopDetailItem icon={Package} text={`Stock Limit: ${shopData.extra_stock_limit }`} />
        <ShopDetailItem icon={Calendar} text={`Created: ${shopData.created_at}`} />
        
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

      <button className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
        <Edit size={16} />
        Edit Shop Details
      </button>
    </div>
  );
};

export default ShopDetailsCard;
