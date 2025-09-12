import React from "react";
import { X } from "lucide-react";

const SubscriptionDetailsModal = ({ isOpen, onClose, subscription }) => {
  if (!isOpen || !subscription) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{subscription.name} Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Basic Information</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <p><strong>ID:</strong> {subscription.id}</p>
              <p><strong>Plan Type:</strong> {subscription.plan_type}</p>
              <p><strong>Description:</strong> {subscription.description}</p>
              <p><strong>Base Price:</strong> ₹{subscription.base_price}</p>
              <p><strong>Duration:</strong> {subscription.duration_days} days</p>
              <p><strong>Max Users:</strong> {subscription.max_users}</p>
              <p><strong>Max Products:</strong> {subscription.max_products}</p>
              <p><strong>Bookings/Month:</strong> {subscription.max_bookings_per_month}</p>
              <p><strong>Feature Count:</strong> {subscription.included_feature_count}</p>
              <p><strong>Status:</strong> {subscription.is_active ? "✅ Active" : "❌ Inactive"}</p>
              <p><strong>Created At:</strong> {subscription.created_at}</p>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Included Features</h3>
            {subscription.included_features?.length > 0 ? (
              <ul className="list-disc pl-6 space-y-1 text-sm">
                {subscription.included_features.map((f) => (
                  <li key={f.id}>
                    <span className="font-medium">{f.name}</span> ({f.code}, {f.feature_type})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No features included</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetailsModal;
