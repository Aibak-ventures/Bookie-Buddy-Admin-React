// File: pages/ShopRegistrationForm.jsx
import React, { useState } from 'react';
import FormInput from '../ui components/FormInput';
import FileUpload from '../ui components/FileUpload';
import MultiSelectTags from '../ui components/MultiSelectTags';
import FormSelect from '../ui components/FormSelect';


const ShopRegistrationForm = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    place: '',
    phone: '',
    email: '',
    gstNo: '',
    state: '',
    street: '',
    city: '',
    postCode: '',
    firstName: '',
    lastName: '',
    ownerPhone: '',
    ownerEmail: '',
    password: '',
    confirmPassword: '',
    secretPassword: '',
    confirmSecretPassword: '',
    maxProducts: '150',
    subscriptionPlan: 'basic',
    services: []
  });

  const [logoFiles, setLogoFiles] = useState([]);

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleServicesChange = (selectedServices) => {
    setFormData(prev => ({
      ...prev,
      services: selectedServices
    }));
  };

  const stateOptions = [
    { value: 'kerala', label: 'Kerala' },
    { value: 'tamil-nadu', label: 'Tamil Nadu' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'andhra-pradesh', label: 'Andhra Pradesh' }
  ];

  const subscriptionOptions = [
    { value: 'basic', label: 'Basic - plan' },
    { value: 'premium', label: 'Premium - plan' },
    { value: 'enterprise', label: 'Enterprise - plan' }
  ];

  const serviceOptions = [
    { value: 'rentals', label: 'Rentals' },
    { value: 'groom-rentals', label: 'Groom Rentals' },
    { value: 'photography', label: 'Photography' },
    { value: 'catering', label: 'Catering' },
    { value: 'decoration', label: 'Decoration' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    console.log('Logo Files:', logoFiles);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Shop details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Business name" value={formData.businessName} onChange={handleInputChange('businessName')} required />
            <FormInput label="Place" value={formData.place} onChange={handleInputChange('place')} required />
            <FormInput label="Phone" type="tel" value={formData.phone} onChange={handleInputChange('phone')} required />
            <FormInput label="Email" type="email" value={formData.email} onChange={handleInputChange('email')} required />
            <FormInput label="GST No" value={formData.gstNo} onChange={handleInputChange('gstNo')} />
            <FormSelect label="State" options={stateOptions} value={formData.state} onChange={handleInputChange('state')} required />
            <FormInput label="Street" value={formData.street} onChange={handleInputChange('street')} />
            <FormInput label="City" value={formData.city} onChange={handleInputChange('city')} />
            <FormInput label="Post Code" value={formData.postCode} onChange={handleInputChange('postCode')} />
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Shop Logo</h2>
          <FileUpload onFileChange={setLogoFiles} accept="image/*" multiple={false} />
        </div>

        <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Owner details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="First name" value={formData.firstName} onChange={handleInputChange('firstName')} required />
            <FormInput label="Last name" value={formData.lastName} onChange={handleInputChange('lastName')} required />
            <FormInput label="Phone" type="tel" value={formData.ownerPhone} onChange={handleInputChange('ownerPhone')} required />
            <FormInput label="Email" type="email" value={formData.ownerEmail} onChange={handleInputChange('ownerEmail')} required />
            <FormInput label="Password" type="password" value={formData.password} onChange={handleInputChange('password')} required />
            <FormInput label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleInputChange('confirmPassword')} required />
            <FormInput label="Secret Password" type="password" value={formData.secretPassword} onChange={handleInputChange('secretPassword')} required />
            <FormInput label="Confirm Secret Password" type="password" value={formData.confirmSecretPassword} onChange={handleInputChange('confirmSecretPassword')} required />
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Other details</h2>
          <MultiSelectTags label="Services" options={serviceOptions} selectedValues={formData.services} onChange={handleServicesChange} />
          <FormInput label="Maximum allowed products" type="number" value={formData.maxProducts} onChange={handleInputChange('maxProducts')} min="1" />
          <FormSelect label="Subscription Plan" options={subscriptionOptions} value={formData.subscriptionPlan} onChange={handleInputChange('subscriptionPlan')} required />
        </div>

        <div className="lg:col-span-3 flex justify-end">
          <button type="button" onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Register Shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopRegistrationForm;
