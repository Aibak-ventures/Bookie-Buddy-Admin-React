export const AddUserOnlyValidation = (formData) => {
  const errors = {};

  if (!formData.phone?.trim()) {
    errors.phone = 'Phone is required';
  } else if (!/^\+?\d[\d\s]*$/.test(formData.phone.trim())) {
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



  if (!formData.role) {
    errors.role = 'Role is required';
  }

  return errors;
};
