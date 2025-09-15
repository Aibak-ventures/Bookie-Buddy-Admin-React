import React, { useState } from "react";
import { X } from "lucide-react";
import FormInput from "../ui components/FormInput";
import FileUpload from "../ui components/FileUpload";

const AddMainServiceModal = ({ isOpen, onClose, onAdd, onUpdate, serviceData }) => {
  if (!isOpen) return null;

const [formData, setFormData] = useState({
  name: "",
  description: "",
});

const [iconFiles, setIconFiles] = useState([]);
const [formErrors, setFormErrors] = useState({});
const [submitting, setSubmitting] = useState(false);

React.useEffect(() => {
  if (serviceData) {
    setFormData({
      name: serviceData.name || "",
      description: serviceData.description || "",
    });
    // If you have the icon URL, you can optionally handle it here
    setIconFiles(serviceData.icon ? [serviceData.icon] : []);
  } else {
    setFormData({ name: "", description: "" });
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

  setFormErrors(errors);
  if (Object.keys(errors).length > 0) return;

  setSubmitting(true);
  try {
    if (serviceData && serviceData.id) {
      // Update mode
      await onUpdate({ id: serviceData.id, ...formData, icon: iconFiles[0] });
    } else {
      // Add mode
      await onAdd({ ...formData, icon: iconFiles[0] });
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

        <h2 className="text-xl font-semibold mb-4">Add Main Service</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
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

          <div>
            <FormInput
              label="Description"
              value={formData.description}
              onChange={handleInputChange("description")}
              textarea
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Service Icon
            </label>
             <FileUpload
              onFileChange={setIconFiles}
              accept="image/*"
              multiple={false}
              initialFiles={iconFiles}   // ✅ now supports URLs or Files
            />
          </div>

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
                    ? serviceData ? "Updating..." : "Adding..."
                    : serviceData ? "Update Service" : "Add Service"}
                </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMainServiceModal;
