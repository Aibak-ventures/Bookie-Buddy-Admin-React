import {
  validatePhone,
  validateEmail,
  validatePasswordMatch,
} from './commonValidation';

export const validateUserForm = (formData) => {
  const errors = {};

  if (!formData.full_name?.trim()) {
    errors.full_name = 'Full name is required';
  }

  // 📞 Phone
  const phoneError = validatePhone(formData.phone, {
    required: true,
  });
  if (phoneError) errors.phone = phoneError;

  // 📧 Email
  const emailError = validateEmail(
    formData.email,
    'Invalid email address'
  );
  if (emailError) errors.email = emailError;

  // 🔒 Password
  const passwordError = validatePasswordMatch(
    formData.password,
    formData.confirm_password
  );
  if (passwordError) errors.confirm_password = passwordError;

  // 🎭 Role
  if (!formData.role) {
    errors.role = 'Role is required';
  }

  // 🏪 Shop Role
  if (!formData.shop_role) {
    errors.shop_role = 'Shop role is required';
  }

  return errors;
};
