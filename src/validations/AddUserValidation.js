// validations/AddUserValidation.js

export const validateUserForm = (formData) => {
  const errors = {};

  if (!formData.full_name?.trim()) {
    errors.full_name = 'Full name is required';
  }

  if (!formData.last_name?.trim()) {
    errors.last_name = 'Last name is required';
  }

  if (!formData.phone?.trim()) {
    errors.phone = 'Phone is required';
  } else if (!/^\+?[\d\s\-()]{10,15}$/.test(formData.phone)) {
    errors.phone = 'Invalid phone number';
  }

  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Invalid email address';
  }

  if (!formData.password || formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (!formData.confirm_password) {
    errors.confirm_password = 'Please confirm your password';
  } else if (formData.confirm_password !== formData.password) {
    errors.confirm_password = 'Passwords do not match';
  }

  if (!formData.secondary_password || formData.secondary_password.length < 8) {
    errors.secondary_password = 'Secret password must be at least 8 characters';
  }

  if (!formData.confirm_secondary_password) {
    errors.confirm_secondary_password = 'Please confirm your secret password';
  } else if (formData.confirm_secondary_password !== formData.secondary_password) {
    errors.confirm_secondary_password = 'Secret passwords do not match';
  }

  if (!formData.role) {
    errors.role = 'Role is required';
  }

  if (!formData.shop_role) {
    errors.shop_role = 'Shop role is required';
  }

  return errors;
};
