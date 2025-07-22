import React, { useState } from 'react';
import FormInput from '../ui components/FormInput';
import FileUpload from '../ui components/FileUpload';
import MultiSelectTags from '../ui components/MultiSelectTags';
import FormSelect from '../ui components/FormSelect';
import { registerShopWithUser } from '../../api/AdminApis';
import { useNavigate } from 'react-router-dom';
import { validateShopRegistrationForm } from '../../validations/AddShopWithUser';

const ShopRegistrationForm = () => {
  const navigate = useNavigate();
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

  const [formErrors, setFormErrors] = useState({});
  const [logoFiles, setLogoFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleServicesChange = (selectedServices) => {
    setFormData(prev => ({
      ...prev,
      services: selectedServices
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateShopRegistrationForm(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const response = await registerShopWithUser(formData, logoFiles[0]);
      if (response.status === 201) {
        alert("Shop registered!");
        navigate("/shops");
      }
    } catch (error) {
      console.error('Shop registration failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const stateOptions = [
    { value: 'kerala', label: 'Kerala' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shop Details */}
        <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Shop details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormInput label="Business name" value={formData.businessName} onChange={handleInputChange('businessName')} required />
              {formErrors.businessName && <p className="text-sm text-red-500">{formErrors.businessName}</p>}
            </div>
            <div>
              <FormInput label="Place" value={formData.place} onChange={handleInputChange('place')} required />
              {formErrors.place && <p className="text-sm text-red-500">{formErrors.place}</p>}
            </div>
            <div>
              <FormInput label="Phone" type="tel" value={formData.phone} onChange={handleInputChange('phone')} required />
              {formErrors.phone && <p className="text-sm text-red-500">{formErrors.phone}</p>}
            </div>
            <div>
              <FormInput label="Email" type="email" value={formData.email} onChange={handleInputChange('email')} required />
              {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
            </div>
            <FormInput label="GST No" value={formData.gstNo} onChange={handleInputChange('gstNo')} />
            <div>
              <FormSelect label="State" options={stateOptions} value={formData.state} onChange={handleInputChange('state')} required />
              {formErrors.state && <p className="text-sm text-red-500">{formErrors.state}</p>}
            </div>
            <FormInput label="Street" value={formData.street} onChange={handleInputChange('street')} />
            <FormInput label="City" value={formData.city} onChange={handleInputChange('city')} />
            <FormInput label="Post Code" value={formData.postCode} onChange={handleInputChange('postCode')} />
          </div>
        </div>

        {/* Logo Upload */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Shop Logo</h2>
          <FileUpload onFileChange={setLogoFiles} accept="image/*" multiple={false} />
        </div>

        {/* Owner Details */}
        <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Owner details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormInput label="First name" value={formData.firstName} onChange={handleInputChange('firstName')} required />
              {formErrors.firstName && <p className="text-sm text-red-500">{formErrors.firstName}</p>}
            </div>
            <div>
              <FormInput label="Last name" value={formData.lastName} onChange={handleInputChange('lastName')} required />
              {formErrors.lastName && <p className="text-sm text-red-500">{formErrors.lastName}</p>}
            </div>
            <div>
              <FormInput label="Phone" type="tel" value={formData.ownerPhone} onChange={handleInputChange('ownerPhone')} required />
              {formErrors.ownerPhone && <p className="text-sm text-red-500">{formErrors.ownerPhone}</p>}
            </div>
            <div>
              <FormInput label="Email" type="email" value={formData.ownerEmail} onChange={handleInputChange('ownerEmail')} required />
              {formErrors.ownerEmail && <p className="text-sm text-red-500">{formErrors.ownerEmail}</p>}
            </div>
            <div>
              <FormInput label="Password" type="password" value={formData.password} onChange={handleInputChange('password')} required />
              {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
            </div>
            <div>
              <FormInput label="Confirm Password" type="password" value={formData.confirmPassword} onChange={handleInputChange('confirmPassword')} required />
              {formErrors.confirmPassword && <p className="text-sm text-red-500">{formErrors.confirmPassword}</p>}
            </div>
            <div>
              <FormInput label="Secret Password" type="password" value={formData.secretPassword} onChange={handleInputChange('secretPassword')} required />
              {formErrors.secretPassword && <p className="text-sm text-red-500">{formErrors.secretPassword}</p>}
            </div>
            <div>
              <FormInput label="Confirm Secret Password" type="password" value={formData.confirmSecretPassword} onChange={handleInputChange('confirmSecretPassword')} required />
              {formErrors.confirmSecretPassword && <p className="text-sm text-red-500">{formErrors.confirmSecretPassword}</p>}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="lg:col-span-3 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-6 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              submitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }`}
          >
            {submitting ? 'Registering...' : 'Register Shop'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopRegistrationForm;