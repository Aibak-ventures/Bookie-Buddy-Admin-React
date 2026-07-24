import React, { useState, useEffect } from "react";
import { X, MessageCircle, CheckCircle2, XCircle } from "lucide-react";

const WhatsAppConfigModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  config, 
  isEditMode 
}) => {
  const [formData, setFormData] = useState({
    access_token: "",
    provider: "wayon",
    business_account_id: "",
    phone_number_id: "",
    phone_number: "",
    app_id: "",
    app_secret: "",
    connection_status: "ACTIVE",
    verified: false,
    token_expiry: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (config && isEditMode) {
      // Parse token_expiry if it exists
      let tokenExpiry = "";
      if (config.token_expiry) {
        try {
          // Convert "01-01-2027 05:29:59" to "2027-01-01T05:29"
          const [datePart, timePart] = config.token_expiry.split(" ");
          const [day, month, year] = datePart.split("-");
          const [hours, minutes] = timePart.split(":");
          tokenExpiry = `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch (err) {
          console.error("Error parsing token_expiry:", err);
        }
      }


      setFormData({
        access_token: config.access_token || "",
        provider: config.provider || "wayon",
        business_account_id: config.business_account_id || "",
        phone_number_id: config.phone_number_id || "",
        phone_number: config.phone_number || "",
        app_id: config.app_id || "",
        app_secret: config.app_secret || "",
        connection_status: config.connection_status || "ACTIVE",
        verified: config.verified || false,
        token_expiry: tokenExpiry,
      });
    } else {
      // Reset form for create mode
      setFormData({
        access_token: "",
        provider: "wayon",
        business_account_id: "",
        phone_number_id: "",
        phone_number: "",
        app_id: "",
        app_secret: "",
        connection_status: "ACTIVE",
        verified: false,
        token_expiry: "",
      });
    }
    setErrors({});
  }, [config, isEditMode, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.access_token.trim()) {
      newErrors.access_token = "Access token is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // Build payload with only non-empty fields
    const payload = {
      access_token: formData.access_token,
    };

    // Add optional fields if they have values
    if (formData.provider) payload.provider = formData.provider;
    if (formData.business_account_id) payload.business_account_id = formData.business_account_id;
    if (formData.phone_number_id) payload.phone_number_id = formData.phone_number_id;
    if (formData.phone_number) payload.phone_number = formData.phone_number;
    if (formData.app_id) payload.app_id = formData.app_id;
    if (formData.app_secret) payload.app_secret = formData.app_secret;
    if (formData.connection_status) payload.connection_status = formData.connection_status;
    payload.verified = formData.verified;
    if (formData.token_expiry) payload.token_expiry = formData.token_expiry;

    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {isEditMode ? "Update WhatsApp Configuration" : "Add WhatsApp Configuration"}
              </h2>
              <p className="text-sm text-gray-600">Configure WhatsApp Business API integration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white hover:shadow transition-all text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">

            {/* Required Fields Section */}
            <section className="bg-red-50 rounded-xl p-5 border-l-4 border-red-500">
              <h3 className="text-sm font-semibold text-red-900 mb-4 uppercase tracking-wide">
                Required Field
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Token <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="access_token"
                  value={formData.access_token}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition ${
                    errors.access_token ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="sk_live_50c6aa9bb5858a32_..."
                />
                {errors.access_token && (
                  <p className="text-red-500 text-sm mt-1">{errors.access_token}</p>
                )}
              </div>
            </section>

            {/* Basic Configuration */}
            <section className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">
                Basic Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provider
                  </label>
                  <input
                    type="text"
                    name="provider"
                    value={formData.provider}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    placeholder="wayon"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Connection Status
                  </label>
                  <select
                    name="connection_status"
                    value={formData.connection_status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="verified"
                      checked={formData.verified}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 focus:ring-2 focus:ring-green-500 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Configuration Verified
                    </span>
                    {formData.verified ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-400" />
                    )}
                  </label>
                </div>
              </div>
            </section>

            {/* Account Details */}
            <section className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">
                Account Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Account ID
                  </label>
                  <input
                    type="text"
                    name="business_account_id"
                    value={formData.business_account_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    placeholder="1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number ID
                  </label>
                  <input
                    type="text"
                    name="phone_number_id"
                    value={formData.phone_number_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    placeholder="9876543210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    placeholder="+919605734995"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Token Expiry
                  </label>
                  <input
                    type="datetime-local"
                    name="token_expiry"
                    value={formData.token_expiry}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            </section>

            {/* App Credentials */}
            <section className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">
                App Credentials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    App ID
                  </label>
                  <input
                    type="text"
                    name="app_id"
                    value={formData.app_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    placeholder="app_123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    App Secret
                  </label>
                  <input
                    type="password"
                    name="app_secret"
                    value={formData.app_secret}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    placeholder="app_secret_example"
                  />
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition font-medium shadow-lg shadow-green-500/30"
          >
            {isEditMode ? "Update Configuration" : "Create Configuration"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default WhatsAppConfigModal;
