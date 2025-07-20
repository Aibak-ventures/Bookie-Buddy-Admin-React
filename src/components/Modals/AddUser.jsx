import React, { useState } from 'react';
import { X } from 'lucide-react';
import FormInput from '../ui components/FormInput';
import FormSelect from '../ui components/FormSelect';
import { createUserForShop } from '../../api/AdminApis';
import { validateUserForm } from '../../validations/AddUserValidation';

const AddUserModal = ({ isOpen, onClose, shopId, shopName }) => {
  if (!isOpen) return null;

  const roleOptions = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Staff', value: 'STAFF' },
  ];

  const shopRoleOptions = [
    { label: 'Manager', value: 'MANAGER' },
    { label: 'Cashier', value: 'CASHIER' },
    { label: 'Support', value: 'SUPPORT' },
  ];

  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    full_name: '',
    last_name: '',
    password: '',
    secondary_password: '',
    role: '',
    shop_role: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await createUserForShop(payload, shopId);
      alert('User assigned successfully');
      onClose();
    } catch (err) {
      console.error('Failed to assign user:', err);
      alert('Failed to assign user');
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
              label="Last Name"
              placeholder="Enter last name"
              value={formData.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
            />
            {formErrors.last_name && <p className="text-sm text-red-500">{formErrors.last_name}</p>}
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
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
          </div>

          <div>
            <FormInput
              label="Password"
              type="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
            {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
          </div>

          <div>
            <FormInput
              label="Secret Password"
              type="password"
              placeholder="Secret Password"
              required
              value={formData.secondary_password}
              onChange={(e) => handleChange('secondary_password', e.target.value)}
            />
            {formErrors.secondary_password && (
              <p className="text-sm text-red-500">{formErrors.secondary_password}</p>
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
