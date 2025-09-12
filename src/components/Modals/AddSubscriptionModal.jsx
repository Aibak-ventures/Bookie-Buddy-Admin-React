import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { fetchFeatures } from "../../api/AdminApis"; 
import { validateSubscriptionForm } from "../../validations/subscriptionValidation"; // ✅ import validation

const AddSubscriptionModal = ({
  isOpen,
  onClose,
  onAdd,
  onUpdate,
  subscriptionData,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    plan_type: "BASIC",
    description: "",
    base_price: 0,
    max_users: 1,
    max_products: 100,
    max_bookings_per_month: 50,
    duration_days: 30,
    included_features: [],
  });

  const [formErrors, setFormErrors] = useState({}); // ✅ errors state
  const [availableFeatures, setAvailableFeatures] = useState([]);

  // ✅ Pre-fill form when editing
  useEffect(() => {
    if (subscriptionData) {
      setFormData({
        ...subscriptionData,
        included_features: subscriptionData.included_features?.map((f) => f.id) || [],
      });
    }
  }, [subscriptionData]);

  // ✅ Load features list
  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const data = await fetchFeatures();
        setAvailableFeatures(data.results || []);
      } catch (err) {
        console.error("Failed to load features:", err);
      }
    };
    loadFeatures();
  }, []);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "base_price" ||
        name.startsWith("max_") ||
        name === "duration_days"
          ? Number(value)
          : value,
    }));
  };

  const handleCheckboxChange = (featureId) => {
    setFormData((prev) => {
      const isSelected = prev.included_features.includes(featureId);
      return {
        ...prev,
        included_features: isSelected
          ? prev.included_features.filter((id) => id !== featureId)
          : [...prev.included_features, featureId],
      };
    });
  };

  // ✅ Ensure payload only contains IDs for features
  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateSubscriptionForm(formData, availableFeatures);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      ...formData,
      included_features: formData.included_features,
    };

    if (subscriptionData) {
      onUpdate(payload);
    } else {
      onAdd(payload);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {subscriptionData ? "Update Subscription" : "Add Subscription"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
        >
          {/* Name */}
          <div>
            <label className="block font-medium">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              maxLength={100}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm">{formErrors.name}</p>
            )}
          </div>

          {/* Plan Type */}
          <div>
            <label className="block font-medium">Plan Type *</label>
            <select
              name="plan_type"
              value={formData.plan_type}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="BASIC">BASIC</option>
              <option value="PREMIUM">PREMIUM</option>
              <option value="ENTERPRISE">ENTERPRISE</option>
            </select>
            {formErrors.plan_type && (
              <p className="text-red-500 text-sm">{formErrors.plan_type}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>

          {/* Base Price */}
          <div>
            <label className="block font-medium">Base Price *</label>
            <input
              type="number"
              name="base_price"
              value={formData.base_price}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
            {formErrors.base_price && (
              <p className="text-red-500 text-sm">{formErrors.base_price}</p>
            )}
          </div>

          {/* Limits */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Max Users</label>
              <input
                type="number"
                name="max_users"
                value={formData.max_users}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              />
              {formErrors.max_users && (
                <p className="text-red-500 text-sm">{formErrors.max_users}</p>
              )}
            </div>
            <div>
              <label className="block font-medium">Max Products</label>
              <input
                type="number"
                name="max_products"
                value={formData.max_products}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              />
              {formErrors.max_products && (
                <p className="text-red-500 text-sm">{formErrors.max_products}</p>
              )}
            </div>
            <div>
              <label className="block font-medium">Max Bookings / Month</label>
              <input
                type="number"
                name="max_bookings_per_month"
                value={formData.max_bookings_per_month}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              />
              {formErrors.max_bookings_per_month && (
                <p className="text-red-500 text-sm">
                  {formErrors.max_bookings_per_month}
                </p>
              )}
            </div>
            <div>
              <label className="block font-medium">Duration (Days)</label>
              <input
                type="number"
                name="duration_days"
                value={formData.duration_days}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              />
              {formErrors.duration_days && (
                <p className="text-red-500 text-sm">{formErrors.duration_days}</p>
              )}
            </div>
          </div>

          {/* Included Features */}
          <div>
            <label className="block font-medium mb-2">Included Features</label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-2">
              {availableFeatures.map((f) => (
                <label key={f.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.included_features.includes(f.id)}
                    onChange={() => handleCheckboxChange(f.id)}
                  />
                  {f.name} ({f.code})
                </label>
              ))}
            </div>
            {formErrors.included_features && (
              <p className="text-red-500 text-sm">
                {formErrors.included_features}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {subscriptionData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubscriptionModal;
