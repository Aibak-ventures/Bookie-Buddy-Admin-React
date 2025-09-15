import React from "react";
import { X } from "lucide-react";

const FeatureDetailsModal = ({ isOpen, onClose, feature }) => {
  if (!isOpen || !feature) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4">
          Feature Details - {feature.name}
        </h2>

        <div className="space-y-3">
          <p><strong>ID:</strong> {feature.id}</p>
          <p><strong>Name:</strong> {feature.name}</p>
          <p><strong>Code:</strong> {feature.code}</p>
          <p><strong>Description:</strong> {feature.description}</p>
          <p><strong>Feature Type:</strong> {feature.feature_type}</p>
          <p><strong>Base Price:</strong> ₹{feature.base_price}</p>
          <p><strong>Status:</strong> {feature.is_active ? "Active ✅" : "Inactive ❌"}</p>
          <p><strong>Created At:</strong> {feature.created_at}</p>

          {/* Permissions */}
          <div>
            <strong>Permissions:</strong>
            {feature.permissions && Object.keys(feature.permissions).length > 0 ? (
              <ul className="list-disc pl-6">
                {Object.entries(feature.permissions).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value ? "✅ Yes" : "❌ No"}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No permissions</p>
            )}
          </div>

          {/* Requires Features */}
          <div>
            <strong>Requires Features:</strong>
            {feature.requires_features && feature.requires_features.length > 0 ? (
              <ul className="list-disc pl-6">
                {feature.requires_features.map((req) => (
                  <li key={req.id}>
                    {req.name} ({req.code}) - {req.feature_type}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No required features</p>
            )}
          </div>

          <p><strong>Requires Features Count:</strong> {feature.requires_features_count}</p>
          <p><strong>Dependent Features Count:</strong> {feature.dependent_features_count}</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureDetailsModal;
