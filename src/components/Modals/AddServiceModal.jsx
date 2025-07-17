import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { fetchGeneralServices } from '../../api/AdminApis';

const AddServiceModal = ({ isOpen, onClose, onSubmit }) => {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState(new Set());
  const [pagination, setPagination] = useState({
    next: null,
    previous: null,
    currentUrl: '/api/v1/service/admin/general-services/',
  });

  useEffect(() => {
    if (!isOpen) return;

    const loadServices = async () => {
      try {
        const data = await fetchGeneralServices(pagination.currentUrl);
        setServices(data.results || []);
        setPagination(prev => ({
          ...prev,
          next: data.next,
          previous: data.previous,
        }));
      } catch (err) {
        console.error('Error fetching services', err);
      }
    };

    loadServices();
  }, [pagination.currentUrl, isOpen]);

  // Toggle selected service ID
  const toggleService = (id) => {
    setSelectedServices(prev => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  // Submit multiple selected services
  const handleAddServices = () => {
    if (selectedServices.size === 0) {
      alert('Please select at least one service.');
      return;
    }

    const serviceIds = Array.from(selectedServices);
    onSubmit(serviceIds );

    setSelectedServices(new Set());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4">Assign Services to Shop</h2>

        <div className="mb-4 max-h-60 overflow-y-auto border rounded p-2">
          {services.map(service => (
            <label key={service.id} className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={selectedServices.has(service.id)}
                onChange={() => toggleService(service.id)}
              />
              <span>{service.name}</span>
            </label>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between text-sm text-blue-600 mb-4">
          <button
            disabled={!pagination.previous}
            onClick={() => setPagination(prev => ({
              ...prev,
              currentUrl: pagination.previous,
            }))}
            className="disabled:text-gray-400"
          >
            ← Previous
          </button>
          <button
            disabled={!pagination.next}
            onClick={() => setPagination(prev => ({
              ...prev,
              currentUrl: pagination.next,
            }))}
            className="disabled:text-gray-400"
          >
            Next →
          </button>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleAddServices}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;
