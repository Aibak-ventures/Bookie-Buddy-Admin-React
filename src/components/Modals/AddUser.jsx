import React from 'react';
import { X } from 'lucide-react';
import FormInput from '../ui components/FormInput';
import FormSelect from '../ui components/FormSelect';

const AddUserModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const roleOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'Staff', value: 'staff' },
    { label: 'Manager', value: 'manager' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Add user details</h2>

        {/* Search User */}
        <div className="mb-6">
          <FormInput
            label="Search existing user"
            placeholder="Search by name or phone"
            className="w-full"
          />
        </div>

        {/* Add New User Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="First name" placeholder="Enter first name" required />
          <FormInput label="Last name" placeholder="Enter last name" required />
          <FormInput label="Phone" placeholder="+91 00000 00000" required />
          <FormInput label="Email" placeholder="info@gmail.com" type="email" required />
          <FormInput label="Password" type="password" placeholder="Password" required />
          <FormInput label="Confirm Password" type="password" placeholder="Confirm Password" required />
          <FormInput label="Secret Password" type="password" placeholder="Secret Password" required />
          <FormInput label="Confirm Secret Password" type="password" placeholder="Confirm Secret Password" required />
          <FormInput label="Shop" placeholder="Bookie buddy - Kozhikode" required />
          <FormSelect
            label="Role"
            options={roleOptions}
            placeholder="Select Role"
            required
          />
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Assign →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
