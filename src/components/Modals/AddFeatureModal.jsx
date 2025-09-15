import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { fetchFeatures } from "../../api/AdminApis";
import { validateFeatureForm } from "../../validations/featureValidator";

const AddFeatureModal = ({ isOpen, onClose, onAdd, onUpdate, featureData }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    feature_type: "CORE",
    description: "",
    base_price: 0,
    permissions: {},
    requires_features: [],
  });

  const [availableFeatures, setAvailableFeatures] = useState([]);
  const [errors, setErrors] = useState({});

  // Load available features
  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const data = await fetchFeatures();
        setAvailableFeatures(data.results || []);
      } catch (err) {
        alert(`Failed :${err?.response?.data?.error}`)

        
      }
    };
    loadFeatures();
  }, []);

  // Populate when editing
  useEffect(() => {
    if (featureData) {
      setFormData({
        id: featureData.id,
        name: featureData.name || "",
        code: featureData.code || "",
        feature_type: featureData.feature_type || "CORE",
        description: featureData.description || "",
        base_price: featureData.base_price || 0,
        permissions: featureData.permissions || {},
        requires_features: featureData.requires_features
          ? featureData.requires_features.map((f) => f.id)
          : [],
      });
    }
  }, [featureData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (key) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key],
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateFeatureForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    if (featureData) {
      onUpdate({ id: featureData.id, ...formData });
    } else {
      onAdd(formData);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold mb-4">
          {featureData ? "Update Feature" : "Add Feature"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium">Name *</label>
            <input
              type="text"
              name="name"
              maxLength={100}
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Code */}
          <div>
            <label className="block text-sm font-medium">Code *</label>
            <input
              type="text"
              name="code"
              maxLength={50}
              value={formData.code}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
            {errors.code && (
              <p className="text-red-500 text-sm">{errors.code}</p>
            )}
          </div>

          {/* Feature Type */}
          <div>
            <label className="block text-sm font-medium">Feature Type *</label>
            <select
              name="feature_type"
              value={formData.feature_type}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            >
              <option value="CORE">CORE</option>
              <option value="ADDON">ADDON</option>
              <option value="PREMIUM">PREMIUM</option>
            </select>
            {errors.feature_type && (
              <p className="text-red-500 text-sm">{errors.feature_type}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          {/* Base Price */}
          <div>
            <label className="block text-sm font-medium">Base Price</label>
            <input
              type="number"
              name="base_price"
              value={formData.base_price}
             
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
            {errors.base_price && (
              <p className="text-red-500 text-sm">{errors.base_price}</p>
            )}
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium mb-2">Permissions</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.permissions.can_transfer_product || false}
                  onChange={() => handlePermissionChange("can_transfer_product")}
                />
                Can Transfer Product
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    formData.permissions.can_view_transaction_history || false
                  }
                  onChange={() =>
                    handlePermissionChange("can_view_transaction_history")
                  }
                />
                Can View Transaction History
              </label>
            </div>
          </div>

          {/* Requires Features */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Requires Features
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableFeatures
                .filter((f) => !featureData || f.id !== featureData.id)
                .map((f) => (
                  <label
                    key={f.id}
                    className="flex items-center gap-2 border p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={formData.requires_features.includes(f.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData((prev) => ({
                            ...prev,
                            requires_features: [...prev.requires_features, f.id],
                          }));
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            requires_features: prev.requires_features.filter(
                              (id) => id !== f.id
                            ),
                          }));
                        }
                      }}
                    />
                    <span>
                      <span className="font-medium">{f.name}</span> ({f.code}) -{" "}
                      {f.feature_type}
                    </span>
                  </label>
                ))}
            </div>
            {errors.requires_features && (
              <p className="text-red-500 text-sm">{errors.requires_features}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {featureData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFeatureModal;
