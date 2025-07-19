// validations/validateShopRegistrationForm.js

export const validateShopRegistrationForm = (formData) => {
  const errors = {};

  // Shop Details
  if (!formData.businessName.trim()) {
    errors.businessName = 'Business name is required';
  }

  if (!formData.place.trim()) {
    errors.place = 'Place is required';
  }

  if (!formData.phone.trim()) {
    errors.phone = 'Phone is required';
  } else if (!/^\d{10}$/.test(formData.phone)) {
    errors.phone = 'Phone number must be 10 digits';
  }

  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Invalid email';
  }

  if (!formData.state.trim()) {
    errors.state = 'State is required';
  }

  // Owner Details
  if (!formData.firstName.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!formData.lastName.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!formData.ownerPhone.trim()) {
    errors.ownerPhone = 'Owner phone is required';
  } else if (!/^\d{10}$/.test(formData.ownerPhone)) {
    errors.ownerPhone = 'Owner phone must be 10 digits';
  }

  if (!formData.ownerEmail.trim()) {
    errors.ownerEmail = 'Owner email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.ownerEmail)) {
    errors.ownerEmail = 'Invalid owner email';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!formData.secretPassword) {
    errors.secretPassword = 'Secret password is required';
  } else if (formData.secretPassword.length < 4) {
    errors.secretPassword = 'Secret password must be at least 4 characters';
  }

  if (formData.secretPassword !== formData.confirmSecretPassword) {
    errors.confirmSecretPassword = 'Secret passwords do not match';
  }

  return errors;
};
