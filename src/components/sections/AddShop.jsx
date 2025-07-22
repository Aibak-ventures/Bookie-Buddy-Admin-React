import React, { useState } from 'react';
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
    secondary_password: '',
    confirmSecretPassword: '',

    name: '', // businessName
    place: '',
    shop_phone: '',
    shop_email: '',
    shop_gst_number: '',
    shop_state: '',
    shop_address: '',
    shop_city: '',
    shop_pincode: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [logoFiles, setLogoFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSecondaryPassword, setShowSecondaryPassword] = useState(false);
  const [showConfirmSecretPassword, setShowConfirmSecretPassword] = useState(false);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateShopRegistrationForm(formData); // You can adjust validation accordingly
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);

    try {
      const response = await registerShopWithUser(formData, logoFiles[0]);
      if (response.status === 201) {
        alert('Shop registered!');
        navigate('/shops');
      }
    } catch (error) {
      console.error('Shop registration failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const stateOptions = [{ value: 'kerala', label: 'Kerala' }];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shop Details */}
          <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Shop Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormInput
                  label="Shop Name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                />
                {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
              </div>
              <div>
                <FormInput
                  label="Place"
                  value={formData.place}
                  onChange={handleInputChange('place')}
                />
                {formErrors.place && <p className="text-sm text-red-500">{formErrors.place}</p>}
              </div>
              <div>
                <FormInput
                  label="Shop Phone"
                  value={formData.shop_phone}
                  onChange={handleInputChange('shop_phone')}
                />
                {formErrors.shop_phone && <p className="text-sm text-red-500">{formErrors.shop_phone}</p>}
              </div>
              <div>
                <FormInput
                  label="Shop Email"
                  value={formData.shop_email}
                  onChange={handleInputChange('shop_email')}
                />
                {formErrors.shop_email && <p className="text-sm text-red-500">{formErrors.shop_email}</p>}
              </div>
              <FormInput
                label="GST Number"
                value={formData.shop_gst_number}
                onChange={handleInputChange('shop_gst_number')}
              />
              <FormSelect
                label="State"
                options={stateOptions}
                value={formData.shop_state}
                onChange={handleInputChange('shop_state')}
              />
              <FormInput
                label="Address"
                value={formData.shop_address}
                onChange={handleInputChange('shop_address')}
              />
              <FormInput
                label="City"
                value={formData.shop_city}
                onChange={handleInputChange('shop_city')}
              />
              <div>
                <FormInput
                  label="Pincode"
                  value={formData.shop_pincode}
                  onChange={handleInputChange('shop_pincode')}
                />
                {formErrors.shop_pincode && <p className="text-sm text-red-500">{formErrors.shop_pincode}</p>}
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Shop Logo</h2>
            <FileUpload
              onFileChange={setLogoFiles}
              accept="image/*"
              multiple={false}
            />
          </div>

          {/* Owner Details */}
          <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Owner Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormInput
                  label="Full Name"
                  value={formData.full_name}
                  onChange={handleInputChange('full_name')}
                />
                {formErrors.full_name && <p className="text-sm text-red-500">{formErrors.full_name}</p>}
              </div>

              <div>
                <FormInput
                  label="Owner Phone"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                />
                {formErrors.phone && <p className="text-sm text-red-500">{formErrors.phone}</p>}
              </div>

              <div>
                <FormInput
                  label="Owner Email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                />
                {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
              </div>

              {/* Password with eye toggle */}
              <div className="relative">
                <FormInput
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
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
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {formErrors.confirmPassword && <p className="text-sm text-red-500">{formErrors.confirmPassword}</p>}
              </div>

              {/* Secret Password with eye toggle */}
              <div className="relative">
                <FormInput
                  label="Secret Password"
                  type={showSecondaryPassword ? 'text' : 'password'}
                  value={formData.secondary_password}
                  onChange={handleInputChange('secondary_password')}
                />
                <button
                  type="button"
                  onClick={() => setShowSecondaryPassword(!showSecondaryPassword)}
                  className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showSecondaryPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {formErrors.secondary_password && <p className="text-sm text-red-500">{formErrors.secondary_password}</p>}
              </div>

              {/* Confirm Secret Password with eye toggle */}
              <div className="relative">
                <FormInput
                  label="Confirm Secret Password"
                  type={showConfirmSecretPassword ? 'text' : 'password'}
                  value={formData.confirmSecretPassword}
                  onChange={handleInputChange('confirmSecretPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmSecretPassword(!showConfirmSecretPassword)}
                  className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showConfirmSecretPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {formErrors.confirmSecretPassword && <p className="text-sm text-red-500">{formErrors.confirmSecretPassword}</p>}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="lg:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2 text-white rounded-md focus:outline-none ${
                submitting
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {submitting ? 'Registering...' : 'Register Shop'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ShopRegistrationForm;