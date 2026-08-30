import React, { useState } from 'react';
import CategoriesTab from '../tabs/marketplace tabs/CategoriesTab';
import SubCategoriesTab from '../tabs/marketplace tabs/SubCategoriesTab';
import FabricsTab from '../tabs/marketplace tabs/FabricsTab';
import ProductsTab from '../tabs/marketplace tabs/ProductsTab';

export const Marketplace = () => {
  const [activeTab, setActiveTab] = useState('categories');

  const tabs = [
    { id: 'categories', label: 'Categories' },
    { id: 'subcategories', label: 'Sub Categories' },
    { id: 'fabrics', label: 'Fabrics' },
    { id: 'products', label: 'Products' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Marketplace Management</h1>
        <p className="text-sm text-gray-500">Manage your catalog structure, fabrics, and products.</p>
      </div>

      {/* Tab Navigation Bar */}
      <div className="border-b border-gray-200 bg-white rounded-t-lg px-4 pt-2 shadow-sm">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Dynamic Tab Content */}
      <div className="bg-white p-6 rounded-b-lg shadow-sm">
        {activeTab === 'categories' && <CategoriesTab />}
        {activeTab === 'subcategories' && <SubCategoriesTab />}
        {activeTab === 'fabrics' && <FabricsTab />}
        {activeTab === 'products' && <ProductsTab />}
      </div>
    </div>
  );
};