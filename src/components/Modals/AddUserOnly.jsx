import React, { useState } from 'react';
import FormInput from '../ui components/FormInput';
import FormSelect from '../ui components/FormSelect';
import { AddUserOnlyValidation } from '../../validations/AddUserOnlyValidation';
import { X, Eye, EyeOff } from 'lucide-react';

const roleOptions = [
  { label: 'Owner', value: 'OWNER' },
  { label: 'Staff', value: 'STAFF' },
];

const AddUserOnly = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    phone: '',
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    secondary_password: '',
    confirm_secondary_password: '',
    role: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSecondaryPassword, setShowSecondaryPassword] = useState(false);
  const [showConfirmSecondaryPassword, setShowConfirmSecondaryPassword] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = AddUserOnlyValidation(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl p-6 rounded-md relative">
        <button className="absolute top-4 right-4 text-gray-500" onClick={onClose}>
          <X />
        </button>
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>

        <form onSubmit={handleSubmit} className="flex gap-6">
          {/* Left Section */}
          <div className="flex-1 space-y-2">
            <FormInput
              placeholder="Full Name"
              value={formData.full_name}
              onChange={handleChange('full_name')}
            />

            <FormInput
              placeholder="Email"
              value={formData.email}
              onChange={handleChange('email')}
            />
            {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}

            <FormInput
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange('phone')}
            />
            {formErrors.phone && <p className="text-sm text-red-500">{formErrors.phone}</p>}

            {/* Password */}
            <div className="relative">
              <FormInput
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange('password')}
              />
              <span
                className="absolute right-3 top-[20px] cursor-pointer text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}

            {/* Confirm Password */}
            <div className="relative">
              <FormInput
                placeholder="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirm_password}
                onChange={handleChange('confirm_password')}
              />
              <span
                className="absolute right-3 top-[20px] cursor-pointer text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {formErrors.confirm_password && (
              <p className="text-sm text-red-500">{formErrors.confirm_password}</p>
            )}
          </div>

          {/* Right Section */}
          <div className="flex-1 space-y-2">
            {/* Secret Password */}
            <div className="relative">
              <FormInput
                placeholder="Secret Password"
                type={showSecondaryPassword ? 'text' : 'password'}
                value={formData.secondary_password}
                onChange={handleChange('secondary_password')}
              />
              <span
                className="absolute right-3 top-[20px] cursor-pointer text-gray-600"
                onClick={() => setShowSecondaryPassword(!showSecondaryPassword)}
              >
                {showSecondaryPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {formErrors.secondary_password && (
              <p className="text-sm text-red-500">{formErrors.secondary_password}</p>
            )}

            {/* Confirm Secret Password */}
            <div className="relative">
              <FormInput
                placeholder="Confirm Secret Password"
                type={showConfirmSecondaryPassword ? 'text' : 'password'}
                value={formData.confirm_secondary_password}
                onChange={handleChange('confirm_secondary_password')}
              />
              <span
                className="absolute right-3 top-[20px] cursor-pointer text-gray-600"
                onClick={() => setShowConfirmSecondaryPassword(!showConfirmSecondaryPassword)}
              >
                {showConfirmSecondaryPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {formErrors.confirm_secondary_password && (
              <p className="text-sm text-red-500">{formErrors.confirm_secondary_password}</p>
            )}

            <FormSelect
              label="Role"
              value={formData.role}
              options={roleOptions}
              onChange={handleChange('role')}
            />
            {formErrors.role && <p className="text-sm text-red-500">{formErrors.role}</p>}

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-2 rounded-md text-white ${
                  submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {submitting ? 'Submitting...' : 'Add User'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserOnly;
