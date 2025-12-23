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
    role: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    alert(`Failed :${err?.response?.data?.error}`)


    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
        <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl relative">
    
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Add New User
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X />
            </button>
          </div>
    
          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    
              {/* LEFT SECTION — User Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-600 uppercase">
                  User Information
                </h3>
    
                <FormInput
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={handleChange('full_name')}
                />
    
                <div>
                  <FormInput
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange('email')}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                  )}
                </div>
    
                <div>
                  <FormInput
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange('phone')}
                  />
                  {formErrors.phone && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>
    
              {/* RIGHT SECTION — Security & Role */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-600 uppercase">
                  Security & Access
                </h3>
    
                {/* Password */}
                <div className="relative">
                  <FormInput
                    placeholder="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange('password')}
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
                {formErrors.password && (
                  <p className="text-xs text-red-500">{formErrors.password}</p>
                )}
    
                {/* Confirm Password */}
                <div className="relative">
                  <FormInput
                    placeholder="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirm_password}
                    onChange={handleChange('confirm_password')}
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
                {formErrors.confirm_password && (
                  <p className="text-xs text-red-500">
                    {formErrors.confirm_password}
                  </p>
                )}
    
                <div>
                  <FormSelect
                    label="Role"
                    value={formData.role}
                    options={roleOptions}
                    onChange={handleChange('role')}
                  />
                  {formErrors.role && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.role}
                    </p>
                  )}
                </div>
              </div>
            </div>
    
            {/* Footer */}
            <div className="flex justify-end mt-6 pt-4 border-t">
              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-2 rounded-md text-white font-medium transition
                  ${
                    submitting
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {submitting ? 'Submitting...' : 'Add User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
    
};

export default AddUserOnly;
