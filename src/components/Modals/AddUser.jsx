import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import FormInput from '../ui components/FormInput';
import FormSelect from '../ui components/FormSelect';
import { createUserForShop } from '../../api/AdminApis';
import { validateUserForm } from '../../validations/AddUserValidation';

const AddUserModal = ({ isOpen, onClose, shopId, shopName, onUserAdded }) => {
  if (!isOpen) return null;

  const roleOptions = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Staff', value: 'STAFF' },
  ];

  const shopRoleOptions = [
    { label: 'OWNER', value: 'OWNER' },
    { label: 'MANAGER', value: 'MANAGER' },
    { label: 'STAFF', value: 'STAFF' },
  ];

  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    full_name: '',
    password: '',
    confirm_password: '',
    secondary_password: '',
    confirm_secondary_password: '',
    role: '',
    shop_role: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSecondaryPassword, setShowSecondaryPassword] = useState(false);
  const [showConfirmSecondaryPassword, setShowConfirmSecondaryPassword] = useState(false);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (formErrors[key]) {
      setFormErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleSubmit = async () => {
    const payload = { ...formData, shop_id: shopId };
    const errors = validateUserForm(payload);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await createUserForShop(payload, shopId);

      const newUser = response.data.user;
      const linkedOn = new Date().toLocaleDateString('en-GB'); // e.g. "30/07/2025"
      const newUserWithDate = { ...newUser, linked_on: linkedOn };

      alert('User assigned successfully');

      if (onUserAdded) {
        onUserAdded(newUserWithDate);
      }

      onClose();
    } catch (err) {
     



      let backendMessage = '';

      if (err.response?.data?.errors) {
        const errorsObj = err.response.data.errors;
        const firstKey = Object.keys(errorsObj)[0];
        if (firstKey && errorsObj[firstKey].length > 0) {
          backendMessage = errorsObj[firstKey][0];
        }
      }

      if (!backendMessage) {
        backendMessage = err.response?.data?.message || err.message || 'Failed to assign user';
      }

      alert(`Failed to assign user: ${backendMessage}`);
    } finally {
      setIsSubmitting(false);
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
          <div>
            <FormInput
              label="Full Name"
              placeholder="Enter full name"
              required
              value={formData.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
            />
            {formErrors.full_name && <p className="text-sm text-red-500">{formErrors.full_name}</p>}
          </div>

         

          <div>
            <FormInput
              label="Phone"
              placeholder="+91 00000 00000"
              required
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
            {formErrors.phone && <p className="text-sm text-red-500">{formErrors.phone}</p>}
          </div>

          <div>
            <FormInput
              label="Email"
              placeholder="info@gmail.com"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
          </div>

          {/* Password with eye toggle */}
          <div className="relative">
            <FormInput
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
          </div>

          {/* Confirm Password with eye toggle */}
          <div className="relative">
            <FormInput
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter Password"
              required
              value={formData.confirm_password}
              onChange={(e) => handleChange('confirm_password', e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {formErrors.confirm_password && (
              <p className="text-sm text-red-500">{formErrors.confirm_password}</p>
            )}
          </div>

          {/* Secret Password with eye toggle */}
          <div className="relative">
            <FormInput
              label="Secret Password"
              type={showSecondaryPassword ? 'text' : 'password'}
              placeholder="Secret Password"
              required
              value={formData.secondary_password}
              onChange={(e) => handleChange('secondary_password', e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowSecondaryPassword(!showSecondaryPassword)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showSecondaryPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {formErrors.secondary_password && (
              <p className="text-sm text-red-500">{formErrors.secondary_password}</p>
            )}
          </div>

          {/* Confirm Secret Password with eye toggle */}
          <div className="relative">
            <FormInput
              label="Confirm Secret Password"
              type={showConfirmSecondaryPassword ? 'text' : 'password'}
              placeholder="Re-enter Secret Password"
              required
              value={formData.confirm_secondary_password}
              onChange={(e) => handleChange('confirm_secondary_password', e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmSecondaryPassword(!showConfirmSecondaryPassword)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showConfirmSecondaryPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {formErrors.confirm_secondary_password && (
              <p className="text-sm text-red-500">{formErrors.confirm_secondary_password}</p>
            )}
          </div>

          <div>
            <FormSelect
              label="Role"
              options={roleOptions}
              placeholder="Select Role"
              required
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
            />
            {formErrors.role && <p className="text-sm text-red-500">{formErrors.role}</p>}
          </div>

          <div>
            <FormSelect
              label="Shop Role"
              options={shopRoleOptions}
              placeholder="Select Shop Role"
              required
              value={formData.shop_role}
              onChange={(e) => handleChange('shop_role', e.target.value)}
            />
            {formErrors.shop_role && <p className="text-sm text-red-500">{formErrors.shop_role}</p>}
          </div>
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
