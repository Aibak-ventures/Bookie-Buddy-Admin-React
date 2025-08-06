import React, { useState } from 'react';
import FormInput from '../ui components/FormInput';
import FormSelect from '../ui components/FormSelect';
import { AddUserOnlyValidation } from '../../validations/AddUserOnlyValidation';
import { X } from 'lucide-react';

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
    secondary_password: '',
    role: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
      await onSubmit(formData); // function passed from parent
      onClose();
    } catch (error) {
      const apiErrors = error?.response?.data?.errors;
      if (apiErrors) {
        const mappedErrors = {};
        for (const key in apiErrors) {
          mappedErrors[key] = apiErrors[key][0];
        }
        setFormErrors(mappedErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-md relative">
        <button className="absolute top-4 right-4 text-gray-500" onClick={onClose}>
          <X />
        </button>
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <FormInput label="Full Name" value={formData.full_name} onChange={handleChange('full_name')} />

          <FormInput label="Email" value={formData.email} onChange={handleChange('email')} />
          {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}

          <FormInput label="Phone" value={formData.phone} onChange={handleChange('phone')} />
          {formErrors.phone && <p className="text-sm text-red-500">{formErrors.phone}</p>}

          <FormInput label="Password" type="password" value={formData.password} onChange={handleChange('password')} />
          {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}

          <FormInput
            label="Secret Password"
            type="password"
            value={formData.secondary_password}
            onChange={handleChange('secondary_password')}
          />
          {formErrors.secondary_password && (
            <p className="text-sm text-red-500">{formErrors.secondary_password}</p>
          )}

          <FormSelect label="Role" value={formData.role} options={roleOptions} onChange={handleChange('role')} />
          {formErrors.role && <p className="text-sm text-red-500">{formErrors.role}</p>}

          <div className="flex justify-end">
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
        </form>
      </div>
    </div>
  );
};

export default AddUserOnly;

