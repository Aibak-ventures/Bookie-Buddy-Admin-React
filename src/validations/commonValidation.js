// 📞 Phone validation (supports +, digits, spaces)
export const validatePhone = (
    phone,
    {
      required = false,
      fieldName = 'Phone',
    } = {}
  ) => {
    if (!phone?.trim()) {
      return required ? `${fieldName} is required` : null;
    }
  
    // ✅ EXACT regex you requested
    if (!/^\+?\d[\d\s]*$/.test(phone.trim())) {
      return 'Enter valid phone number';
    }
  
    return null;
  };
  
  // 📧 Email validation (same as your files)
  export const validateEmail = (
    email,
    message = 'Invalid email format'
  ) => {
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      return message;
    }
    return null;
  };
  
  // 📮 Pincode validation (same as your files)
  export const validatePincode = (pincode) => {
    if (pincode && !/^\d{6}$/.test(pincode)) {
      return 'Pincode must be 6 digits';
    }
    return null;
  };
  
  // 🔒 Password match (same logic)
  export const validatePasswordMatch = (
    password,
    confirmPassword,
    fieldName = 'Password'
  ) => {
    if (!password?.trim()) {
      return `${fieldName} is required`;
    }
  
    if (password !== confirmPassword) {
      return `${fieldName}s do not match`;
    }
  
    return null;
  };
  
  // 🔐 Secret password (same logic)
  export const validateSecretPassword = (
    password,
    confirmPassword
  ) => {
    if (!password?.trim()) {
      return 'Secret password is required';
    }
  
    if (password.length < 4) {
      return 'Secret password must be at least 4 characters';
    }
  
    if (!confirmPassword?.trim()) {
      return 'Please confirm secret password';
    }
  
    if (password !== confirmPassword) {
      return 'Secret password does not match';
    }
  
    return null;
  };
  