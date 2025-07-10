import React from 'react';

const ShopDetailItem = ({ icon: Icon, text }) => {
  return (
    <div className="flex items-center gap-3 p-2">
      <Icon size={20} className="text-gray-500 flex-shrink-0" />
      <span className="text-gray-700 text-sm">{text}</span>
    </div>
  );
};

export default ShopDetailItem;
