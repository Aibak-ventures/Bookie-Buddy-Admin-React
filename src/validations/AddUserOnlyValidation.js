// validations/AddUserValidation.js

export const AddUserOnlyValidation = (formData) => {
  const errors = {};

  if (!formData.phone?.trim()) {
    errors.phone = 'Phone is required';
  } else if (!/^\+?[\d\s\-()]{10,15}$/.test(formData.phone)) {
    errors.phone = 'Invalid phone number';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  }

  if (!formData.secondary_password) {
    errors.secondary_password = 'Secret password is required';
  }

  if (!formData.role) {
    errors.role = 'Role is required';
  }

  return errors;
};
