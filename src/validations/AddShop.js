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
  // ✅ Secret password mandatory
  if (!formData.secret_password?.trim()) {
    errors.secret_password = 'Secret password is required';
  } else if (formData.secret_password.length < 4) {
    errors.secret_password = 'Secret password must be at least 4 characters';
  }

  // ✅ Confirmation mandatory
  if (!formData.confirm_secret_password?.trim()) {
    errors.confirm_secret_password = 'Please confirm secret password';
  } else if (formData.confirm_secret_password !== formData.secret_password) {
    errors.confirm_secret_password = 'Secret password does not match';
  }
  return errors;
};
