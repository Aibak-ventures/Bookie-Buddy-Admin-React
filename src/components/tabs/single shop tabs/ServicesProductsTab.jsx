import React from "react";
import {  Settings, Plus } from 'lucide-react';

const ServicesProductsTab = () => {
  const services = [
    { id: 1, name: 'Photography', status: 'Active', products: 25 },
    { id: 2, name: 'Catering', status: 'Active', products: 15 },
    { id: 3, name: 'Decoration', status: 'Inactive', products: 8 },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Services & Products</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <Plus size={16} />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium">{service.name}</h4>
              <span className={`px-2 py-1 rounded-full text-xs ${
                service.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {service.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">{service.products} products</p>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Manage
              </button>
              <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                <Settings size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesProductsTab