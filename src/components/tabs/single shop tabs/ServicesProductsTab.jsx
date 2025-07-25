import React, { useState, useEffect } from "react";
import { Settings, Plus } from 'lucide-react';
import AddServiceModal from "../../Modals/AddServiceModal";
import { assignServicesToShop, fetchShopServices } from "../../../api/AdminApis"; 

const ServicesProductsTab = ({ shop_id }) => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reload,setReload] = useState(false)

  //  Fetch services from API
  useEffect(() => {
    if (!shop_id) return;

    const loadServices = async () => {
      try {
        const data = await fetchShopServices(shop_id);
        
        setServices(data?.services || []);
      } catch (error) {
        console.error("Failed to load shop services:", error);
      }
    };

    loadServices();
  }, [shop_id,reload]);

  // Handle modal submission
const handleAddService = async (serviceIds) => {
  const payload = { shop_id, service_ids: serviceIds };
  console.log("this is my payload",payload);
  
  
  try {
    const response = await assignServicesToShop(payload);
    console.log("my reponse in service card",response);
    
    const updated = await fetchShopServices(shop_id);
    setServices(updated?.assigned || []);
    setReload(!reload)
  } catch (error) {
    console.error("Failed to assign services:", error);
  }
};

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Services & Products</h3>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((service) => (
          <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            {/* Service Icon & Name */}
            <div className="flex items-start gap-3 mb-3">
              {service.icon && (
                <img
                  src={service.icon}
                  alt={service.name}
                  className="w-10 h-10 rounded object-cover"
                />
              )}
              <div className="flex-1">
                <h4 className="font-medium">{service.name}</h4>
                <p className="text-sm text-gray-500">{service.main_service}</p>
              </div>
              {/* Status badge */}
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  service.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {service.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">
              {service.description || 'No description'}
            </p>

            {/* Buttons */}
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Manage
              </button>
              
            </div>
          </div>
        ))}
      </div>


      <AddServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddService}
      />
    </div>
  );
};

export default ServicesProductsTab;
