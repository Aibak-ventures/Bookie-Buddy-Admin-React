import React, { useState } from 'react';
import FormInput from '../ui components/FormInput';
import FileUpload from '../ui components/FileUpload';
import { updateShopDetails } from '../../api/AdminApis';
import { Eye, EyeOff, X } from 'lucide-react';
import { validateShopUpdateForm } from '../../validations/validateShopUpdateForm';
import FormSelect from '../ui components/FormSelect';

const UpdateShopModal = ({ shopData, onClose, onSuccess }) => {
  
  
  const initialForm = {
    name: shopData.name || '',
    phone: shopData.phone || '',
    phone2:shopData.phone2 || '',
    email: shopData.email || '',
    gst_number: shopData.gst_number || '',
    address: shopData.address || '',
    city: shopData.city || '',
    state: shopData.state || '',
    pincode: shopData.pincode || '',
    place: shopData.place || '',
    extra_stock_limit: shopData.extra_stock_limit || '',
    sale_start_id: shopData.sale_start_id ,
    booking_start_id: shopData.booking_start_id ,
    secret_password: shopData.secret_password || '',

    terms_and_conditions: Array.isArray(shopData.terms_and_conditions)
      ? shopData.terms_and_conditions
      : [''],
  };
  console.log("THIS I SMY DATA",initialForm);

  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  // ✅ Add this state at top of component (UpdateShopModal.jsx)
const [showSecret, setShowSecret] = useState(false);

  const handleChange = (field) => (e) => {
    
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleTermChange = (index, value) => {
    const updatedTerms = [...formData.terms_and_conditions];
    updatedTerms[index] = value;
    setFormData((prev) => ({ ...prev, terms_and_conditions: updatedTerms }));
  };

  const handleAddTerm = () => {
    setFormData((prev) => ({
      ...prev,
      terms_and_conditions: [...prev.terms_and_conditions, ''],
    }));
  };

  const handleRemoveTerm = (index) => {
    const updated = [...formData.terms_and_conditions];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, terms_and_conditions: updated }));
  };
const handleSubmit = async () => {
  const validationErrors = validateShopUpdateForm(formData);

  setFormErrors(validationErrors);
  if (Object.keys(validationErrors).length > 0) return;

  const patchData = new FormData();

  const normalize = (val) => typeof val === 'string' ? val.trim() : val;

  const cleanTerms = formData.terms_and_conditions
    .map(normalize)
    .filter((term) => term !== ''); // Remove empty strings

  Object.entries(formData).forEach(([key, value]) => {
    const original = shopData[key];

    let isChanged = false;

    if (key === 'terms_and_conditions') {
      const originalCleaned = Array.isArray(original)
        ? original.map(normalize).filter((term) => term !== '')
        : [];

      isChanged = JSON.stringify(cleanTerms) !== JSON.stringify(originalCleaned);

      if (isChanged) {
        patchData.append(key, JSON.stringify(cleanTerms));
      }

    }
     else if (key === 'sale_start_id' || key === 'booking_start_id') {
      // ✅ Compare numerically (avoid string-number mismatch)
      const newValue = value ? Number(value) : null;
      const oldValue = original ? Number(original) : null;
      if (newValue !== oldValue) {
        patchData.append(key, newValue);
      }
    }

     else {
      isChanged = normalize(value) !== normalize(original || '');
      if (isChanged) {
        patchData.append(key, normalize(value));
      }
    }
  });

  if (imageFile) {
    patchData.append('img', imageFile);
  }

  setSubmitting(true);


  try {
    const res = await updateShopDetails(shopData.id, patchData);
    
    if (res.status === 200 || res.status === 204) {
      onSuccess?.();
      alert("updated successfully")
      onClose?.();
    }
  } catch (err) {
    alert(`Failed :${err?.response?.data?.error}`)


  } finally {
    setSubmitting(false);
  }
};


  const stateOptions = [
  { value: 'kerala', label: 'Kerala' },
  // Add more states as needed
];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-4">Update Shop Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormInput
              label="Shop Name"
              value={formData.name}
              onChange={handleChange('name')}
            />
            {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
          </div>
          <div>
          <FormInput label="Phone"  value={formData.phone} onChange={handleChange('phone')} />
          {formErrors.phone && <p className="text-sm text-red-500">{formErrors.phone}</p>}
          </div>
          <div>
          <FormInput label="Phone 2"    value={formData.phone2} onChange={handleChange('phone2')} />
          {formErrors.phone2 && <p className="text-sm text-red-500">{formErrors.phone2}</p>}
          </div>
          <div>
          <FormInput label="Email" value={formData.email} onChange={handleChange('email')} />
          {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
          </div>
          <FormInput
            label="GST Number"
            value={formData.gst_number}
            onChange={handleChange('gst_number')}
          />
          <FormInput
            label="Address"
            value={formData.address}
            onChange={handleChange('address')}
          />
          <FormInput label="City" value={formData.city} onChange={handleChange('city')} />
          <div>
            <FormSelect
                label="State"
                options={stateOptions}
                value={formData.state}
                onChange={handleChange('state')}
            />
            </div>
          <div>
          <FormInput
            label="Pincode"
            value={formData.pincode}
            onChange={handleChange('pincode')}
          />
          {formErrors.pincode && <p className="text-sm text-red-500">{formErrors.pincode}</p>}
            </div>
            <div>
          <FormInput label="Place" value={formData.place} onChange={handleChange('place')} />
            {formErrors.place && <p className="text-sm text-red-500">{formErrors.place}</p>}
            </div>

          <FormInput
          label="Extra Stock Limit"
          type="number"
          value={formData.extra_stock_limit}
          onChange={handleChange('extra_stock_limit')}
          onWheel={(e) => e.target.blur()}   // 👈 prevents scroll changing value
        />
        <FormInput
          label="Invoice Start For Booking"
          type="number"
          value={formData.booking_start_id}
          onChange={handleChange('booking_start_id')}
        />
         <FormInput
          label="Invoice Start For Sales"
          type="number"
          value={formData.sale_start_id}
          onChange={handleChange('sale_start_id')}
        />
            {/* ✅ SECRET PASSWORD INPUT ADDED */}
          <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Secret Password</label>

  <div className="relative">
    <input
      type={showSecret ? "text" : "password"}
      name="secret_password"
      value={formData.secret_password}
      onChange={handleChange('secret_password')}
      className="w-full border border-gray-300 rounded-md p-2 pr-10"
      placeholder="Enter Secret Password"
    />

    {/* ✅ EYE BUTTON */}
     <button
      type="button"
      onClick={() => setShowSecret(!showSecret)}
      className="absolute right-3 top-[13px] text-gray-500"
      tabIndex={-1}
    >
      {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>

  {formErrors.secret_password && (
    <p className="text-sm text-red-500 mt-1">{formErrors.secret_password}</p>
  )}
</div>

        </div>

        {/* ✅ Terms and Conditions Section */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Terms and Conditions
          </label>
          <div className="space-y-2">
            {formData.terms_and_conditions.map((term, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={term}
                  onChange={(e) => handleTermChange(idx, e.target.value)}
                  className="flex-1 border rounded-md p-2"
                  placeholder={`Term #${idx + 1}`}
                />
                <button
                  type="button"
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleRemoveTerm(idx)}
                  disabled={formData.terms_and_conditions.length === 1}
                >
                  <X />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddTerm}
              className="text-blue-600 text-sm hover:underline mt-1"
            >
              + Add another term
            </button>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shop Logo
          </label>
          <FileUpload
            onFileChange={(files) => setImageFile(files[0])}
            accept="image/*"
            multiple={false}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-6 py-2 text-white rounded-md focus:outline-none ${
              submitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {submitting ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateShopModal;
