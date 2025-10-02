import React, { useState } from "react";
import FormInput from "../ui components/FormInput";
import FormSelect from "../ui components/FormSelect";
import FileUpload from "../ui components/FileUpload";
import { sendPushNotification } from "../../api/AdminApis";
import PaginatedUserDropdown from "../ui components/PaginatedUserDropdown";
// 👉 You will create this similar to PaginatedUserDropdown
import PaginatedShopDropdown from "../ui components/PaginatedShopDropdown";

function PushNotifications() {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    data: "", // will hold {user_id: x} or {shop_id: y}
    target: "",
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const audienceOptions = [
    { value: "all", label: "All Users" },
    { value: "user", label: "Specific User" },
    { value: "shop", label: "Specific Shop" },
  ];

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    let newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.body) newErrors.body = "Message body is required";
    if (!formData.target) newErrors.target = "Target is required";

    if (formData.target === "user" && !selectedUser)
      newErrors.data = "Please select a user";
    if (formData.target === "shop" && !selectedShop)
      newErrors.data = "Please select a shop";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Prepare form-data
    const dataToSend = new FormData();
    dataToSend.append("title", formData.title);
    dataToSend.append("body", formData.body);
    dataToSend.append("target", formData.target);

    if (formData.target === "user" && selectedUser) {
      dataToSend.append("data", JSON.stringify({ user_id: selectedUser.id }));
    }
    if (formData.target === "shop" && selectedShop) {
      dataToSend.append("data", JSON.stringify({ shop_id: selectedShop.id }));
    }

    if (imageFile) dataToSend.append("image", imageFile);

    setSubmitting(true);
    try {

      
      await sendPushNotification(dataToSend);
      alert("Push Notification Sent ✅");

      // reset form
      setFormData({ title: "", body: "", data: "", target: "" });
      setSelectedUser(null);
      setSelectedShop(null);
      setImageFile(null);
    } catch (err) {
      console.log(err);
      
      alert(`${err.response.data.message || "Error occurred"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Send Push Notification</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Notification Title"
          value={formData.title}
          onChange={handleInputChange("title")}
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}

        <FormInput
          label="Message Body"
          value={formData.body}
          onChange={handleInputChange("body")}
        />
        {errors.body && <p className="text-sm text-red-500">{errors.body}</p>}

        <FormSelect
          label="Target Audience"
          options={audienceOptions}
          value={formData.target}
          onChange={handleInputChange("target")}
        />
        {errors.target && <p className="text-sm text-red-500">{errors.target}</p>}

        {/* Show dropdown based on target */}
        {formData.target === "user" && (
          <PaginatedUserDropdown
            value={selectedUser}
            onChange={setSelectedUser}
            error={errors.data}
          />
        )}

        {formData.target === "shop" && (
          <PaginatedShopDropdown
            value={selectedShop}
            onChange={setSelectedShop}
            error={errors.data}
          />
        )}

        <FileUpload
          onFileChange={(files) => setImageFile(files[0])}
          accept="image/*"
        />

        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded text-white ${
              submitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Sending..." : "Send Notification"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PushNotifications;
