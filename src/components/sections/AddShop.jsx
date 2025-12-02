import React, { useState, useEffect } from 'react';
import FormInput from '../ui components/FormInput';
import FileUpload from '../ui components/FileUpload';
import FormSelect from '../ui components/FormSelect';
import { registerShopWithUser } from '../../api/AdminApis';
import { useNavigate } from 'react-router-dom';
import { validateShopRegistrationForm } from '../../validations/AddShopWithUser';
import { Eye, EyeOff } from 'lucide-react';

const ShopRegistrationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '', // ownerPhone
    email: '', // ownerEmail
    password: '',
    confirmPassword: '',

    // ✅ SHOP CREATION SECTION
    name: '', // businessName
    place: '',
    shop_phone: '',
    phone2: '',
    shop_email: '',
    shop_gst_number: '',
    shop_state: '',
    shop_address: '',
    shop_city: '',
    shop_pincode: '',
    booking_start_id: '',
    sale_start_id: '',

    // ✅ moved here + renamed key
    secret_password: '',
    confirmSecretPassword: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [logoFiles, setLogoFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSecretPassword, setShowSecretPassword] = useState(false);
  const [showConfirmSecretPassword, setShowConfirmSecretPassword] = useState(false);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
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
        alert('Shop registered!');
        navigate('/shops');
      }
    } catch (err) {
      alert(`Failed :${err?.response?.data?.error}`);
    } finally {
      setSubmitting(false);
    }
  };

  const stateOptions = [
    { value: 'kerala', label: 'Kerala' },
    { value: 'tamil nadu', label: 'Tamil Nadu' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'andhra pradesh', label: 'Andhra Pradesh' },
    { value: 'telangana', label: 'Telangana' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'goa', label: 'Goa' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Shop Details */}
          <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Shop Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <FormInput label="Shop Name" value={formData.name} onChange={handleInputChange('name')} />
                {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
              </div>

              <div>
                <FormInput label="Place" value={formData.place} onChange={handleInputChange('place')} />
                {formErrors.place && <p className="text-sm text-red-500">{formErrors.place}</p>}
              </div>

              <div>
                <FormInput label="Shop Phone 1" value={formData.shop_phone} onChange={handleInputChange('shop_phone')} />
                {formErrors.shop_phone && <p className="text-sm text-red-500">{formErrors.shop_phone}</p>}
              </div>

              <div>
                <FormInput label="Shop Phone 2" value={formData.phone2} onChange={handleInputChange('phone2')} />
                {formErrors.phone2 && <p className="text-sm text-red-500">{formErrors.phone2}</p>}
              </div>

              <div>
                <FormInput label="Shop Email" value={formData.shop_email} onChange={handleInputChange('shop_email')} />
                {formErrors.shop_email && <p className="text-sm text-red-500">{formErrors.shop_email}</p>}
              </div>

              <div>
                <FormInput label="Invoice Start From" type="number" value={formData.booking_start_id} onChange={handleInputChange('booking_start_id')} />
                {formErrors.booking_start_id && <p className="text-sm text-red-500">{formErrors.booking_start_id}</p>}
              </div>

              <div>
                <FormInput label="Invoice Start For Sales" type="number" value={formData.sale_start_id} onChange={handleInputChange('sale_start_id')} />
                {formErrors.sale_start_id && <p className="text-sm text-red-500">{formErrors.sale_start_id}</p>}
              </div>

              <FormInput label="GST Number" value={formData.shop_gst_number} onChange={handleInputChange('shop_gst_number')} />
              <FormSelect label="State" options={stateOptions} value={formData.shop_state} onChange={handleInputChange('shop_state')} />
              <FormInput label="Address" value={formData.shop_address} onChange={handleInputChange('shop_address')} />
              <FormInput label="City" value={formData.shop_city} onChange={handleInputChange('shop_city')} />

              {/* ✅ SHOP SECRET PASSWORD SECTION */}
              <div className="relative md:col-span-2 bg-white border border-gray-200 p-4 rounded-lg shadow-sm mb-2">
                <h3 className="text-md font-medium mb-2">Shop Security</h3>

                <div className="relative">
                  <FormInput
                    label="Shop Secret Password"
                    type={showSecretPassword ? 'text' : 'password'}
                    value={formData.secret_password}
                    onChange={handleInputChange('secret_password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretPassword(!showSecretPassword)}
                    className="absolute right-3 top-[38px] text-gray-500"
                    tabIndex={-1}
                  >
                    {showSecretPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {formErrors.secret_password && <p className="text-sm text-red-500">{formErrors.secret_password}</p>}
                </div>

                <div className="relative">
                  <FormInput
                    label="Confirm Shop Secret Password"
                    type={showConfirmSecretPassword ? 'text' : 'password'}
                    value={formData.confirmSecretPassword}
                    onChange={handleInputChange('confirmSecretPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmSecretPassword(!showConfirmSecretPassword)}
                    className="absolute right-3 top-[38px] text-gray-500"
                    tabIndex={-1}
                  >
                    {showConfirmSecretPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {formErrors.confirmSecretPassword && <p className="text-sm text-red-500">{formErrors.confirmSecretPassword}</p>}
                </div>
              </div>

            </div>
          </div>

          {/* Logo Upload */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Shop Logo</h2>
            <FileUpload onFileChange={setLogoFiles} accept="image/*" multiple={false} />
          </div>

          {/* Owner Details */}
          <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Owner Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <FormInput label="Full Name" value={formData.full_name} onChange={handleInputChange('full_name')} />
                {formErrors.full_name && <p className="text-sm text-red-500">{formErrors.full_name}</p>}
              </div>

              <div>
                <FormInput label="Owner Phone" value={formData.phone} onChange={handleInputChange('phone')} />
                {formErrors.phone && <p className="text-sm text-red-500">{formErrors.phone}</p>}
              </div>

              {/* Password */}
              <div className="relative">
                <FormInput label="Password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleInputChange('password')} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-gray-500" tabIndex={-1}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <FormInput label="Confirm Password" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleInputChange('confirmPassword')} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-[38px] text-gray-500" tabIndex={-1}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {formErrors.confirmPassword && <p className="text-sm text-red-500">{formErrors.confirmPassword}</p>}
              </div>

            </div>
          </div>

          {/* Submit */}
          <div className="lg:col-span-3 flex justify-end">
            <button type="submit" disabled={submitting} className="px-6 py-2 bg-blue-600 text-white rounded-md">
              {submitting ? 'Registering...' : 'Register Shop'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ShopRegistrationForm;