// src/components/Modals/UpdateShopFeaturesModal.jsx
import React, { useEffect, useState } from "react";
import { fetchFeatures } from "../../api/AdminApis";

const UpdateShopFeaturesModal = ({ shopId, isOpen, onClose, onSuccess }) => {
  const [features, setFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchFeaturesForShop();
    }
  }, [isOpen]);

  const fetchFeaturesForShop = async () => {
    try {
      const res = await fetchFeatures();
      setFeatures(res?.data || []);
    } catch (err) {
      console.error("Error fetching features:", err);
    }
  };

  const handleToggle = (featureId) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleSave = async () => {
    if (selectedFeatures.length === 0) {
      alert("Select at least one feature to update.");
      return;
    }
    setLoading(true);
    try {
      await updateShopFeatures(shopId, { feature_ids: selectedFeatures });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error updating features:", err);
      alert("Failed to update features. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Update Addon Features</h2>

        <div className="max-h-64 overflow-y-auto space-y-3 mb-6">
          {features.map((feature) => (
            <label
              key={feature.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium text-gray-800">{feature.name}</p>
                <p className="text-xs text-gray-500">{feature.feature_type}</p>
              </div>
              <input
                type="checkbox"
                checked={selectedFeatures.includes(feature.id)}
                onChange={() => handleToggle(feature.id)}
              />
            </label>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateShopFeaturesModal;
