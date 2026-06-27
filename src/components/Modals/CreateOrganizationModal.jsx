import React, { useEffect, useState } from "react";
import { X } from "lucide-react"; // Imported X for an explicit, polished close feature
import FormInput from "../ui components/FormInput";
import { createOrganization } from "../../api/AdminApis";
import FileUpload from "../ui components/FileUpload";

const CreateOrganizationModal = ({ isOpen, onClose, onCreated }) => {
  if (!isOpen) return null;

  const [isDirty, setIsDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    phone2: "",
    street: "",
    gst_number: "",
    place: "",
    email: "",
    city: "",
    state: "",
    pincode: "",
    is_active: true,
    public_listing_enabled: true,
  });

  const [errors, setErrors] = useState({});
  const [logoFiles, setLogoFiles] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    const handleBeforeUnload = (e) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, isOpen]);

  const handleInputChange = (field) => (e) => {
    setIsDirty(true);

    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSafeClose = () => {
    if (isDirty) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Close anyway?"
      );
      if (!confirmClose) return;
    }

    setIsDirty(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    // Name (Required)
    if (!formData.name.trim()) {
      validationErrors.name = "Organization name is required";
    }

    // Phone (Optional)
    if (formData.phone.trim()) {
      if (!/^\d+$/.test(formData.phone)) {
        validationErrors.phone = "Phone number must contain only digits";
      } else if (formData.phone.length < 6) {
        validationErrors.phone = "Phone number must be greater than 6 digits";
      }
    }

    // Email (Optional)
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        validationErrors.email = "Please enter a valid email address";
      }
    }
    
    if (formData.phone2 && !/^\d+$/.test(formData.phone2)) {
      validationErrors.phone2 = "Invalid phone number";
    }

    if (formData.pincode && !/^\d+$/.test(formData.pincode)) {
      validationErrors.pincode = "Invalid pincode";
    }

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    try {
      await createOrganization(formData, logoFiles[0]);
      setIsDirty(false);
      onCreated();
      onClose();
    } catch (err) {
      alert("Failed to create organization: " + (err?.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all"
      onClick={handleSafeClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-2xl shadow-xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Sticky Header Element */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Create New Organization</h2>
            <p className="text-xs text-gray-500 mt-0.5">Initialize a new master enterprise profile group context.</p>
          </div>
          <button 
            onClick={handleSafeClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Context Body Section */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
            
            {/* Primary Profile Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div>
                <FormInput
                  label="Organization Name *"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  className={errors.name ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</p>
                )}
              </div>

              <div>
                <FormInput
                  label="Primary Phone"
                  value={formData.phone}
                  type="text"
                  onChange={handleInputChange("phone")}
                  className={errors.phone ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.phone}</p>
                )}
              </div>

              <div>
                <FormInput
                  label="Email Address"
                  value={formData.email}
                  type="email"
                  onChange={handleInputChange("email")}
                  className={errors.email ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>
                )}
              </div>

              <div>
                <FormInput
                  label="Secondary Phone (Phone 2)"
                  value={formData.phone2}
                  type="text"
                  onChange={handleInputChange("phone2")}
                  className={errors.phone2 ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : ""}
                />
                {errors.phone2 && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.phone2}</p>
                )}
              </div>

              <FormInput
                label="GST Number"
                value={formData.gst_number}
                onChange={handleInputChange("gst_number")}
              />

              <FormInput
                label="Street/Area Layout"
                value={formData.street}
                onChange={handleInputChange("street")}
              />

              <FormInput
                label="Locality / Place"
                value={formData.place}
                onChange={handleInputChange("place")}
              />

              <FormInput
                label="City"
                value={formData.city}
                onChange={handleInputChange("city")}
              />

              <FormInput
                label="State"
                value={formData.state}
                onChange={handleInputChange("state")}
              />

              <div>
                <FormInput
                  label="Pincode"
                  value={formData.pincode}
                  onChange={handleInputChange("pincode")}
                  className={errors.pincode ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : ""}
                />
                {errors.pincode && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.pincode}</p>
                )}
              </div>

            </div>

            {/* Asset Management Media Upload Block */}
            <div className="bg-gray-50/50 p-4 border border-gray-100 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Organization Branding Identity
              </h3>
              <p className="text-xs text-gray-400 mb-3">Upload your corporate icon logo thumbnail image file context mappings.</p>
              <FileUpload
                accept="image/*"
                multiple={false}
                onFileChange={(files) => {
                  setIsDirty(true);
                  setLogoFiles(files);
                }}
              />
            </div>

            {/* Visibility Settings Toggle Boxes */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pt-2 border-t border-gray-50">
              <label className="inline-flex items-center gap-2.5 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={handleInputChange("is_active")}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500/20 accent-purple-600 transition"
                />
                <div className="text-sm">
                  <span className="font-medium text-gray-700 group-hover:text-gray-900 transition">Active Profile</span>
                  <p className="text-xs text-gray-400">Enable default login authorizations and linked routing properties.</p>
                </div>
              </label>

              <label className="inline-flex items-center gap-2.5 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={formData.public_listing_enabled}
                  onChange={handleInputChange("public_listing_enabled")}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500/20 accent-purple-600 transition"
                />
                <div className="text-sm">
                  <span className="font-medium text-gray-700 group-hover:text-gray-900 transition">Public Index Listings</span>
                  <p className="text-xs text-gray-400">Expose properties configuration downstream inside lookup filters.</p>
                </div>
              </label>
            </div>

          </div>

          {/* Sticky Modal Buttons Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={handleSafeClose}
              className="px-4 py-2 border border-gray-200 text-sm font-medium text-gray-600 rounded-lg bg-white hover:bg-gray-50 transition shadow-sm"
            >
              Cancel
            </button>
            <button
              disabled={submitting}
              type="submit"
              className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition shadow-sm ${
                submitting
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
              }`}
            >
              {submitting ? "Creating Profile..." : "Create Organization"}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default CreateOrganizationModal;