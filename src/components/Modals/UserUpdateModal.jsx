import React, { useEffect, useState } from 'react';
import FormInput from '../ui components/FormInput';
import FormSelect from '../ui components/FormSelect';
import { updateUserDetails } from '../../api/AdminApis';
import { AddUserOnlyValidation } from '../../validations/AddUserOnlyValidation';
import { X } from 'lucide-react';

const roleOptions = [
  { value: 'OWNER', label: 'Owner' },
  { value: 'STAFF', label: 'Staff' },
];

const UserUpdateModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    role: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        phone: user.phone?.replace('+91', '') || '',
        email: user.email || '',
        role: user.role || '',
      });
    }
  }, [user]);

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // For update, we only validate fields that are editable
    const errors = AddUserOnlyValidation({
      ...formData,
      password: 'dummy', // bypass password validation for update
      confirm_password: 'dummy',
      secondary_password: 'dummy',
      confirm_secondary_password: 'dummy',
    });

    // Remove irrelevant password errors for update
    delete errors.password;
    delete errors.confirm_password;
    delete errors.secondary_password;
    delete errors.confirm_secondary_password;

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    const dataToSend = {
      ...formData,
      phone: `+91${formData.phone}`,
    };

    try {
      await updateUserDetails(user.id, dataToSend);
      onUpdate();
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
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4">Update User</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <FormInput
              label="Full Name"
              value={formData.full_name}
              onChange={handleInputChange('full_name')}
            />
          </div>

          <div>
            <FormInput
              label="Phone"
              value={formData.phone}
              onChange={handleInputChange('phone')}
            />
            {formErrors.phone && (
              <p className="text-sm text-red-500">{formErrors.phone}</p>
            )}
          </div>

          <div>
            <FormInput
              label="Email"
              value={formData.email}
              onChange={handleInputChange('email')}
            />
            {formErrors.email && (
              <p className="text-sm text-red-500">{formErrors.email}</p>
            )}
          </div>

          <div>
            <FormSelect
              label="Role"
              options={roleOptions}
              value={formData.role}
              onChange={handleInputChange('role')}
            />
            {formErrors.role && (
              <p className="text-sm text-red-500">{formErrors.role}</p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-white rounded ${
                isSubmitting
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserUpdateModal;
