export const validateShopRegistrationForm = (formData) => {
  const errors = {};

  // === 🏬 Shop Details ===
  if (!formData.name?.trim()) {
    errors.name = 'Shop name is required';
  }

  if (!formData.place?.trim()) {
    errors.place = 'Place is required';
  }

  if (!/^\d{10}$/.test(formData.shop_phone)) {
    errors.shop_phone = 'Phone number must be 10 digits';
  }

  if (formData.shop_email && !/\S+@\S+\.\S+/.test(formData.shop_email)) {
    errors.shop_email = 'Invalid email format';
  }

  if (formData.shop_pincode && !/^\d{6}$/.test(formData.shop_pincode)) {
    errors.shop_pincode = 'Pincode must be 6 digits';
  }

  // === 👤 Owner Details ===
  if (!formData.full_name?.trim()) {
    errors.full_name = 'Owner full name is required';
  }

  if (!formData.phone?.trim()) {
    errors.phone = 'Owner phone is required';
  } else if (!/^\d{10}$/.test(formData.phone)) {
    errors.phone = 'Owner phone must be 10 digits';
  }

  if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Invalid owner email';
  }

  // === 🔒 Passwords ===
  if (!formData.password?.trim()) {
    errors.password = 'Password is required';
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!formData.secondary_password?.trim()) {
    errors.secondary_password = 'Secret password is required';
  }

  if (formData.secondary_password !== formData.confirmSecretPassword) {
    errors.confirmSecretPassword = 'Secret passwords do not match';
  }

  return errors;
};
