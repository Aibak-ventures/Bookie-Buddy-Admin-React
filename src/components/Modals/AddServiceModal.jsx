import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { assignServicesToShop, fetchGeneralServices } from '../../api/AdminApis';

// Utility to extract relative path from full URL
const getRelativeUrl = (url) => {
  if (!url) return null;
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.pathname + parsedUrl.search;
  } catch (error) {
    return url; // Already relative
  }
};

const AddServiceModal = ({ isOpen, onClose, shop_id, onSuccess }) => {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState(new Set());
  const [pagination, setPagination] = useState({
    next: null,
    previous: null,
    currentUrl: '/api/v1/service/admin/general-services/',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const loadServices = async () => {
      try {
        const data = await fetchGeneralServices(pagination.currentUrl);
        setServices(data.results || []);
        setPagination((prev) => ({
          ...prev,
          next: getRelativeUrl(data.next),
          previous: getRelativeUrl(data.previous),
        }));
      } catch (err) {
        console.error('Error fetching services', err);
      }
    };

    loadServices();
  }, [pagination.currentUrl, isOpen]);

  const toggleService = (id) => {
    setSelectedServices((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const handleAddServices = async () => {
    if (selectedServices.size === 0) {
      setFormError('Please select at least one service.');
      return;
    }
    setFormError('');
    setIsSubmitting(true);

    try {
      const payload = { shop_id, service_ids: Array.from(selectedServices) };
      const response = await assignServicesToShop(payload);

      alert(response.message || "Services assigned successfully!");
      setSelectedServices(new Set())

      // ✅ Tell parent to reload
      if (onSuccess) onSuccess();


      // ✅ Close modal
      onClose();
    } catch (error) {
      console.error("Failed to assign services:", error);
      alert("Failed to assign services.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4">Assign Services to Shop</h2>

        <div className="mb-4 max-h-60 overflow-y-auto border rounded p-2">
          {services.map((service) => (
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

        {formError && <p className="text-sm text-red-500 mb-2">{formError}</p>}

        <div className="flex justify-between text-sm text-blue-600 mb-4">
          <button
            type="button"
            disabled={!pagination.previous}
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                currentUrl: getRelativeUrl(pagination.previous),
              }))
            }
            className="disabled:text-gray-400"
          >
            ← Previous
          </button>

          <button
            type="button"
            disabled={!pagination.next}
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                currentUrl: getRelativeUrl(pagination.next),
              }))
            }
            className="disabled:text-gray-400"
          >
            Next →
          </button>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddServices}
            disabled={isSubmitting}
            className={`px-4 py-2 text-white rounded ${
              isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Assigning...' : 'Assign'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;
