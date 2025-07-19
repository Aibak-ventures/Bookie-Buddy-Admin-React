import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import FormInput from '../ui components/FormInput';
import FormSelect from '../ui components/FormSelect';
import { createUserForShop } from '../../api/AdminApis';
import { validateUserForm } from '../../validations/AddUserValidation';


const AddUserModal = ({ isOpen, onClose, shopId,shopName }) => {
  if (!isOpen) return null;

  const roleOptions = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Staff', value: 'STAFF' },
  ];

  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    full_name: '',
    last_name: '',
    password: '',
    confirm_password: '',
    secondary_password: '',
    confirm_secondary_password: '',
    role: '',
    shop_role: '',
  });

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (formErrors[key]) {
      setFormErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleSubmit = async () => {
    try {
      await createUserForShop(formData, shopId);
      alert('User assigned successfully');

      if (onUserAdded) {
        onUserAdded(newUserWithDate);
      }

      onClose();
    } catch (err) {
      console.error('Failed to assign user:', err);
      alert('Failed to assign user');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Add user details for {shopName}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Full Name"
            placeholder="Enter full name"
            required
            onChange={(e) => handleChange('full_name', e.target.value)}
          />
          <FormInput
            label="Phone"
            placeholder="+91 00000 00000"
            required
            onChange={(e) => handleChange('phone', e.target.value)}
          />
          <FormInput
            label="Email"
            placeholder="info@gmail.com"
            type="email"
            required
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <FormInput
            label="Password"
            type="password"
            placeholder="Password"
            required
            onChange={(e) => handleChange('password', e.target.value)}
          />
          <FormInput
            label="Secret Password"
            type="password"
            placeholder="Secret Password"
            required
            onChange={(e) => handleChange('secondary_password', e.target.value)}
          />
          <FormSelect
            label="Role"
            options={roleOptions}
            placeholder="Select Role"
            required
            onChange={(e) => handleChange('role', e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 text-white rounded-md ${
              isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Assigning...' : 'Assign →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
