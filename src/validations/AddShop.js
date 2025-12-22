import {
  validatePhone,
  validateEmail,
  validatePincode,
  validateSecretPassword,
} from './commonValidation';

export const validateShopCreation = (formData) => {
  const errors = {};

  if (!formData.name?.trim()) errors.name = 'Shop name is required';
  if (!formData.place?.trim()) errors.place = 'Place is required';

  // 📞 Phone (using common validation)
  const phoneError = validatePhone(formData.phone, {
    required: true,
  });
  if (phoneError) errors.phone = phoneError;

  const phone2Error = validatePhone(formData.phone2, {
    required: false,
  });
  if (phone2Error) errors.phone2 = phone2Error;

  // 📧 Email
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  // 📮 Pincode
  const pincodeError = validatePincode(formData.pincode);
  if (pincodeError) errors.pincode = pincodeError;

  // 🔐 Secret password
  const secretPasswordError = validateSecretPassword(
    formData.secret_password,
    formData.confirm_secret_password
  );
  if (secretPasswordError)
    errors.confirm_secret_password = secretPasswordError;

  return errors;
};
