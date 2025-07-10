import React from 'react';
import { Phone, Mail, CreditCard, MapPin, Package, Edit } from 'lucide-react';
import ShopDetailItem from './ShopDetailItem';

const ShopDetailsCard = ({ shopData }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl font-bold">{shopData.logo}</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{shopData.name}</h2>
        <p className="text-gray-600">{shopData.location}</p>
      </div>
      <div className="space-y-4">
        <ShopDetailItem icon={Phone} text={shopData.phone} />
        <ShopDetailItem icon={Mail} text={shopData.email} />
        <ShopDetailItem icon={CreditCard} text={shopData.gst} />
        <ShopDetailItem icon={MapPin} text={shopData.address} />
        <ShopDetailItem icon={Package} text={shopData.stockLimit} />
      </div>
      <button className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
        <Edit size={16} />
        Edit Shop Details
      </button>
    </div>
  );
};

export default ShopDetailsCard;