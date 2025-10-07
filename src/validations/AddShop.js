export const validateShopCreation = (formData) => {
  const errors = {};

  if (!formData.name?.trim()) errors.name = 'Shop name is required';
  if (!formData.place?.trim()) errors.place = 'Place is required';

  if (!/^\d{10}$/.test(formData.phone))
    errors.phone = 'Phone number must be 10 digits';

  if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
    errors.email = 'Invalid email format';

  if (formData.pincode && !/^\d{6}$/.test(formData.pincode))
    errors.pincode = 'Pincode must be 6 digits';

  return errors;
};
