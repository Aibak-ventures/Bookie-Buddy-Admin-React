import {
  validatePhone,
  validateEmail,
  validatePincode,
  validatePasswordMatch,
  validateSecretPassword,
} from './commonValidation';

export const validateShopRegistrationForm = (formData) => {
  const errors = {};

  // === 🏬 Shop Details ===
  if (!formData.name?.trim()) {
    errors.name = 'Shop name is required';
  }

  if (!formData.place?.trim()) {
    errors.place = 'Place is required';
  }

  // Shop phone (required)
  const shopPhoneError = validatePhone(formData.shop_phone, {
    required: true,
    fieldName: 'Phone number',
  });
  if (shopPhoneError) errors.shop_phone = shopPhoneError;

  // Shop email
  const shopEmailError = validateEmail(formData.shop_email);
  if (shopEmailError) errors.shop_email = shopEmailError;

  // Shop pincode
  const shopPincodeError = validatePincode(formData.shop_pincode);
  if (shopPincodeError) errors.shop_pincode = shopPincodeError;

  // === 👤 Owner Details ===
  if (!formData.full_name?.trim()) {
    errors.full_name = 'Owner full name is required';
  }

  // Owner phone (required)
  const ownerPhoneError = validatePhone(formData.phone, {
    required: true,
    fieldName: 'Owner phone',
  });
  if (ownerPhoneError) errors.phone = ownerPhoneError;

  // Secondary phone (optional)
  if (formData.phone2) {
    const phone2Error = validatePhone(formData.phone2);
    if (phone2Error) errors.phone2 = phone2Error;
  }

  // Owner email
  const ownerEmailError = validateEmail(
    formData.email,
    'Invalid owner email'
  );
  if (ownerEmailError) errors.email = ownerEmailError;

  // === 🔒 Passwords ===
  const passwordError = validatePasswordMatch(
    formData.password,
    formData.confirmPassword
  );
  if (passwordError) errors.confirmPassword = passwordError;

  const secretPasswordError = validateSecretPassword(
    formData.secret_password,
    formData.confirmSecretPassword
  );
  if (secretPasswordError)
    errors.confirmSecretPassword = secretPasswordError;

  return errors;
};
