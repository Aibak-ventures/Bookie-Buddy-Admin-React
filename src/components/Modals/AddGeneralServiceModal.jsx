import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import FormInput from "../ui components/FormInput";
import FileUpload from "../ui components/FileUpload";
import { fetchMainServices } from "../../api/AdminApis"; // adjust path
import PaginatedMainServiceDropdown from "../ui components/PaginatedMainServiceDropdown";

const AddGeneralServiceModal = ({ isOpen, onClose, onAdd, onUpdate, serviceData }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    main_category: "",
  });

  const [iconFiles, setIconFiles] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [mainCategories, setMainCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // fetch all main services
  useEffect(() => {
    const loadMainServices = async () => {
      try {
        const data = await fetchMainServices("/api/v1/service/admin/main-services/");
        setMainCategories(data.results || data); // depends on API pagination
      } catch (err) {
    alert(`Failed :${err?.response?.data?.error}`)


      } finally {
        setLoadingCategories(false);
      }
    };

    loadMainServices();
  }, []);

  useEffect(() => {
    if (serviceData) {
      setFormData({
        name: serviceData.name || "",
        description: serviceData.description || "",
        main_category: parseInt(serviceData.main_category) || "",
      });
      
      
      setIconFiles(serviceData.icon ? [serviceData.icon] : []);
    } else {
      setFormData({ name: "", description: "", main_category: "" });
      setIconFiles([]);
    }
  }, [serviceData]);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    

    const errors = {};
    if (!formData.name.trim()) errors.name = "Service name is required";
    if (!formData.main_category) errors.main_category = "Main category is required";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      if (serviceData && serviceData.id) {
        await onUpdate({
          id: serviceData.id,
          ...formData,
          icon: iconFiles[0],
        });
      } else {
        await onAdd({
          ...formData,
          icon: iconFiles[0],
        });
      }
      onClose();
    } catch (err) {
        alert(`Failed :${err?.response?.data?.error}`)


    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg relative">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {serviceData ? "Update General Service" : "Add General Service"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {/* Service Name */}
          <div>
            <FormInput
              label="Service Name"
              value={formData.name}
              onChange={handleInputChange("name")}
            />
            {formErrors.name && (
              <p className="text-sm text-red-500">{formErrors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <FormInput
              label="Description"
              value={formData.description}
              onChange={handleInputChange("description")}
              textarea
              rows={3}
            />
          </div>

          {/* Main Category Dropdown */}
          <div>
            <PaginatedMainServiceDropdown
                  value={
                    mainCategories.find((cat) => cat.id === formData.main_category) || null
                  }
                  onChange={(selected) => {
                    setFormData((prev) => ({
                      ...prev,
                      main_category: selected.id, // store ID
                    }));
                    if (formErrors.main_category) {
                      setFormErrors((prev) => ({ ...prev, main_category: "" }));
                    }
                  }}
                  error={formErrors.main_category}
                />

            {/* {formErrors.main_category && (
              <p className="text-sm text-red-500">{formErrors.main_category}</p>
            )} */}
          </div>


          {/* File Upload */}
          <div>
        
            <FileUpload
              label="Service Icon"
              onFileChange={setIconFiles}
              accept="image/*"
              multiple={false}
              initialFiles={iconFiles}   // ✅ now supports URLs or Files
            />

          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 text-white rounded-md ${
                submitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {submitting
                ? serviceData
                  ? "Updating..."
                  : "Adding..."
                : serviceData
                ? "Update Service"
                : "Add Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGeneralServiceModal;
