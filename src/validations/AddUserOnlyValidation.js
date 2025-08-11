export const AddUserOnlyValidation = (formData) => {
  const errors = {};

  if (!formData.phone?.trim()) {
    errors.phone = 'Phone is required';
  } else if (!/^\+?[\d\s\-()]{10,15}$/.test(formData.phone)) {
    errors.phone = 'Invalid phone number';
  }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Invalid email format';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  }

  if (!formData.confirm_password) {
    errors.confirm_password = 'Confirm password is required';
  } else if (formData.password !== formData.confirm_password) {
    errors.confirm_password = 'Passwords do not match';
  }

  if (!formData.secondary_password) {
    errors.secondary_password = 'Secret password is required';
  }

  if (!formData.confirm_secondary_password) {
    errors.confirm_secondary_password = 'Confirm secret password is required';
  } else if (formData.secondary_password !== formData.confirm_secondary_password) {
    errors.confirm_secondary_password = 'Secret passwords do not match';
  }

  if (!formData.role) {
    errors.role = 'Role is required';
  }

  return errors;
};
