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

  if (!formData.password || formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!formData.secondary_password || formData.secondary_password.length < 4) {
    errors.secondary_password = 'Secret password must be at least 4 characters';
  }

  if (!formData.role) {
    errors.role = 'Role is required';
  }

  if (!formData.shop_role) {
    errors.shop_role = 'Shop role is required';
  }

  return errors;
};
