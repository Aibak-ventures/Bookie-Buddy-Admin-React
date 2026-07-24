import React, { useEffect, useState } from "react";
import { X } from "lucide-react"; // Import X icon for explicit close consistency
import FormInput from "../ui components/FormInput";
import { updateOrganization } from "../../api/AdminApis";
import FileUpload from "../ui components/FileUpload";

const EditOrganizationModal = ({
  isOpen,
  onClose,
  onUpdated,
  organization,
}) => {
  if (!isOpen || !organization) return null;

  const [isDirty, setIsDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [logoFiles, setLogoFiles] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    phone2: "",
    email: "",
    street: "",
    gst_number: "",
    place: "",
    city: "",
    state: "",
    pincode: "",
    public_listing_enabled: true,
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || "",
        phone: organization.phone || "",
        phone2: organization.phone2 || "",
        email: organization.email || "",
        street: organization.street || "",
        gst_number: organization.gst_number || "",
        place: organization.place || "",
        city: organization.city || "",
        state: organization.state || "",
        pincode: organization.pincode || "",
        public_listing_enabled: organization.public_listing_enabled,
      });

      setErrors({});
      setIsDirty(false);
      setLogoFiles([]); // Reset selected image files context on change
    }
  }, [organization]);

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

    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
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

    setErrors({});
    setIsDirty(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    // Name
    if (!formData.name.trim()) {
      validationErrors.name = "Organization name is required";
    }

    // Phone
    if (formData.phone.trim()) {
      if (!/^\d+$/.test(formData.phone)) {
        validationErrors.phone = "Phone number must contain only digits";
      } else if (formData.phone.length < 6) {
        validationErrors.phone = "Phone number must be at least 6 digits";
      }
    }

    // Secondary phone
    if (formData.phone2.trim()) {
      if (!/^\d+$/.test(formData.phone2)) {
        validationErrors.phone2 = "Phone number must contain only digits";
      } else if (formData.phone2.length < 6) {
        validationErrors.phone2 = "Phone number must be at least 6 digits";
      }
    }

    // Email
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        validationErrors.email = "Please enter a valid email";
      }
    }

    // Pincode
    if (formData.pincode.trim()) {
      if (!/^\d+$/.test(formData.pincode)) {
        validationErrors.pincode = "Pincode should contain only digits";
      }
    }

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setSubmitting(true);

    try {
      await updateOrganization(
        organization.id,
        formData,
        logoFiles[0]
      );
      setIsDirty(false);
      onUpdated();
      onClose();
    } catch (err) {
      console.log(err);
      console.log(err.response?.data);
      alert(
        err?.response?.data?.message ||
        "Failed to update organization."
      );

      // Backend validation formatting arrays integration
      if (err.response?.data) {
        setErrors(err.response.data);
      }
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
        
        {/* Sticky Modular Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Edit Organization</h2>
            <p className="text-xs text-gray-500 mt-0.5">Modify settings and profiling keys for {organization.name}</p>
          </div>
          <button 
            onClick={handleSafeClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Context View Form Wrapper */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
            
            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Organization Name */}
              <div>
                <FormInput
                  label="Organization Name"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  className={errors.name ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">
                    {Array.isArray(errors.name) ? errors.name[0] : errors.name}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <FormInput
                  type="number"
                  label="Phone"
                  value={formData.phone}
                  onChange={handleInputChange("phone")}
                  className={errors.phone ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">
                    {Array.isArray(errors.phone) ? errors.phone[0] : errors.phone}
                  </p>
                )}
              </div>

              {/* Secondary Phone */}
              <div>
                <FormInput
                  type="number"
                  label="Secondary Phone"
                  value={formData.phone2}
                  onChange={handleInputChange("phone2")}
                  className={errors.phone2 ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : ""}
                />
                {errors.phone2 && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">
                    {Array.isArray(errors.phone2) ? errors.phone2[0] : errors.phone2}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <FormInput
                  type="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  className={errors.email ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">
                    {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                  </p>
                )}
              </div>

              <FormInput
                label="GST Number"
                value={formData.gst_number}
                onChange={handleInputChange("gst_number")}
              />

              <FormInput
                label="Street"
                value={formData.street}
                onChange={handleInputChange("street")}
              />

              {/* Place */}
              <div>
                <FormInput
                  label="Place"
                  value={formData.place}
                  onChange={handleInputChange("place")}
                  className={errors.place ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : ""}
                />
                {errors.place && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">
                    {Array.isArray(errors.place) ? errors.place[0] : errors.place}
                  </p>
                )}
              </div>

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

              <FormInput
                label="Pincode"
                type="number"
                value={formData.pincode}
                onChange={handleInputChange("pincode")}
              />

            </div>

            {/* Avatar Branding Media Sections */}
            <div className="bg-gray-50/50 p-4 border border-gray-100 rounded-xl space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Organization Branding Identity</h3>
                <p className="text-xs text-gray-400 mt-0.5">Manage your corporate icon logos and dynamic upload overrides.</p>
              </div>

              {organization.image && logoFiles.length === 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-gray-400">Current Logo Preview:</span>
                  <img
                    src={organization.image}
                    alt="Organization Profile Logo"
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm bg-white"
                  />
                </div>
              )}

              <FileUpload
                accept="image/*"
                multiple={false}
                onFileChange={(files) => {
                  setLogoFiles(files);
                  setIsDirty(true);
                }}
              />
            </div>

            {/* Visibility Settings Toggle Boxes */}
            <div className="pt-2 border-t border-gray-50">
              <label className="inline-flex items-center gap-2.5 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={formData.public_listing_enabled}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500/20 accent-purple-600 transition"
                  onChange={(e) => {
                    setIsDirty(true);
                    setFormData(prev => ({
                      ...prev,
                      public_listing_enabled: e.target.checked
                    }));
                  }}
                />
                <div className="text-sm">
                  <span className="font-medium text-gray-700 group-hover:text-gray-900 transition">Public Index Listings</span>
                  <p className="text-xs text-gray-400">Expose properties configuration downstream inside lookup directories.</p>
                </div>
              </label>
            </div>

          </div>

          {/* Sticky Footer Layout */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={handleSafeClose}
              className="px-4 py-2 border border-gray-200 text-sm font-medium text-gray-600 rounded-lg bg-white hover:bg-gray-50 transition shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition shadow-sm ${
                submitting
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
              }`}
            >
              {submitting ? "Updating..." : "Update Organization"}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default EditOrganizationModal;