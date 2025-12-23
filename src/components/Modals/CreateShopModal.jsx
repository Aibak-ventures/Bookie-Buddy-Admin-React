import React, { useState } from 'react';
import FormInput from '../ui components/FormInput';
import FileUpload from '../ui components/FileUpload';
import FormSelect from '../ui components/FormSelect';
import { createShop } from '../../api/AdminApis';
import { validateShopCreation } from '../../validations/AddShop';
import { Eye, EyeOff } from 'lucide-react';

const CreateShopModal = ({ isOpen, onClose, onCreated }) => {
  if (!isOpen) return null;
  const [showSecret, setShowSecret] = useState(false);
const [showConfirmSecret, setShowConfirmSecret] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    place: '',
    phone: '',
    phone2: '',
    email: '',
    gst_number: '',
    state: '',
    address: '',
    city: '',
    pincode: '',
    sale_start_id: '',
    booking_start_id: '',
    secret_password: '',
    confirm_secret_password: '',
    
  });

  const [logoFiles, setLogoFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const stateOptions = [
    { value: 'kerala', label: 'Kerala' },
    { value: 'tamil nadu', label: 'Tamil Nadu' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'andhra pradesh', label: 'Andhra Pradesh' },
    { value: 'telangana', label: 'Telangana' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'goa', label: 'Goa' },
  ];


  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateShopCreation(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      await createShop(formData, logoFiles[0]);
      onCreated();
      onClose();
    } catch (err) {
      alert('Failed to create shop');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">Create New Shop</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormInput
                label="Shop Name"
                value={formData.name}
                onChange={handleInputChange('name')}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div>
              <FormInput
                label="Place"
                value={formData.place}
                onChange={handleInputChange('place')}
              />
              {errors.place && <p className="text-sm text-red-500">{errors.place}</p>}
            </div>

            <div>
              <FormInput
                label="Shop Phone 1"
                value={formData.phone}
                onChange={handleInputChange('phone')}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div>
              <FormInput
                label="Shop Phone 2"
                value={formData.phone2}
                onChange={handleInputChange('phone2')}
              />
              {errors.phone2 && <p className="text-sm text-red-500">{errors.phone2}</p>}
            </div>

            <div>
              <FormInput
                label="Shop Email"
                value={formData.email}
                onChange={handleInputChange('email')}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <FormInput
                label="GST Number"
                value={formData.gst_number}
                onChange={handleInputChange('gst_number')}
              />
              {errors.gst_number && <p className="text-sm text-red-500">{errors.gst_number}</p>}
            </div>

            <div>
              <FormSelect
                label="State"
                options={stateOptions}
                value={formData.state}
                onChange={handleInputChange('state')}
              />
              {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
            </div>

            <div>
              <FormInput
                label="Address"
                value={formData.address}
                onChange={handleInputChange('address')}
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>

            <div>
              <FormInput
                label="City"
                value={formData.city}
                onChange={handleInputChange('city')}
              />
              {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
            </div>
             <div>
              <FormInput
                label="Invoice Start For Booking"
                type="number"
                value={formData.booking_start_id}
                onChange={handleInputChange('booking_start_id')}
              />
              {errors.booking_start_id && (
                <p className="text-sm text-red-500">{errors.booking_start_id}</p>
              )}
            </div>
            <div>
              <FormInput
                label="Invoice Start For Sales"
                type="number"
                value={formData.sale_start_id}
                onChange={handleInputChange('sale_start_id')}
              />
              {errors.sale_start_id && (
                <p className="text-sm text-red-500">{errors.sale_start_id}</p>
              )}
            </div>
            



            <div>
              <FormInput
                label="Pincode"
                value={formData.pincode}
                onChange={handleInputChange('pincode')}
              />
              {errors.pincode && <p className="text-sm text-red-500">{errors.pincode}</p>}
            </div>
          </div>
             {/* ✅ SECRET PASSWORD */}
          <div className="relative w-full">
            <FormInput
              label="Secret Password"
              type={showSecret ? "text" : "password"}
              value={formData.secret_password}
              onChange={handleInputChange('secret_password')}
            />

            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-3 top-[38px] text-gray-500"
            >
              {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {errors.secret_password && (
              <p className="text-sm text-red-500">{errors.secret_password}</p>
            )}
          </div>

          {/* ✅ CONFIRM SECRET PASSWORD */}
          <div className="relative w-full">
            <FormInput
              label="Confirm Secret Password"
              type={showConfirmSecret ? "text" : "password"}
              value={formData.confirm_secret_password}
              onChange={handleInputChange('confirm_secret_password')}
            />

            <button
              type="button"
              onClick={() => setShowConfirmSecret(!showConfirmSecret)}
              className="absolute right-3 top-[38px] text-gray-500"
            >
              {showConfirmSecret ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {errors.confirm_secret_password && (
              <p className="text-sm text-red-500">{errors.confirm_secret_password}</p>
            )}
          </div>


          <div>
            <FileUpload onFileChange={setLogoFiles} accept="image/*" multiple={false} />
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 rounded text-white ${
                submitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {submitting ? 'Creating...' : 'Create Shop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShopModal;
