export const validateShopUpdateForm = (formData) => {
  const errors = {};

  // Shop name is mandatory
  if (!formData.name?.trim()) {
    errors.name = 'Shop name is required';
  }
  if (!formData.place?.trim()) {
    errors.place = 'place  is required';
  }

  // Phone validation
 if (!/^\d{10}$/.test(formData.phone)) {
    errors.phone = 'Phone must be 10 digits';
  }

  // Email validation
 if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Invalid email format';
  }



  // Optional: You can validate other fields like pincode, gst_number, etc.
  if (formData.pincode &&  !/^\d{6}$/.test(formData.pincode)) {
    errors.pincode = 'Pincode must be 6 digits';
  }

  // Optional: Validate each T&C is not empty
//   const emptyTerms = formData.terms_and_conditions?.some(term => !term.trim());
//   if (emptyTerms) {
//     errors.terms_and_conditions = 'Each term must be filled out';
//   }

  return errors;
};
