import React, { useState } from "react";
import { X } from "lucide-react";
import { linkUserToShop } from "../../api/AdminApis";
import FormSelect from "../ui components/FormSelect";
import PaginatedUserDropdown from "../ui components/PaginatedUserDropdown";

const roleOptions = [
  { value: "OWNER", label: "Owner" },
  { value: "STAFF", label: "Staff" },
];

const AssignExistingUserModal = ({ isOpen, onClose, shopId, onUserAssigned }) => {
  // Now store full selected user object
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState({ user: "", role: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAssign = async () => {
    let validationErrors = { user: "", role: "" };
    let hasError = false;

    if (!selectedUser) {
      validationErrors.user = "Please select a user";
      hasError = true;
    }
    if (!role) {
      validationErrors.role = "Please select a role";
      hasError = true;
    }
    setErrors(validationErrors);
    if (hasError) return;

    setIsSubmitting(true);
    try {
      await linkUserToShop(shopId, selectedUser.id, role);
      alert("User assigned successfully");

      const linkedOn = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
      onUserAssigned({ ...selectedUser, role, linked_on: linkedOn });

      onClose();
    } catch (err) {
    alert(`Failed :${err?.response?.data?.error}`)


    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4">Assign Existing User</h2>

        <PaginatedUserDropdown
          value={selectedUser}
          onChange={(user) => {
            setSelectedUser(user);
            setErrors((e) => ({ ...e, user: "" }));
          }}
          error={errors.user}
          disabled={isSubmitting}
        />

        <div className="mt-4">
          <FormSelect
            label="Role"
            options={roleOptions}
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setErrors((e) => ({ ...e, role: "" }));
            }}
            disabled={isSubmitting}
          />
          {errors.role && (
            <p className="text-red-600 text-sm mt-1 ml-1">{errors.role}</p>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAssign}
            disabled={isSubmitting}
            className={`px-4 py-2 text-white rounded ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Assigning..." : "Assign User"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignExistingUserModal;
