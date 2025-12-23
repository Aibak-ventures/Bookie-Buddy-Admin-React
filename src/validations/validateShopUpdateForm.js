export const validateShopUpdateForm = (formData) => {
  // console.log("THIS I SMY FORM DATA IN VALIDATION",formData);
  const errors = {};

  if (!formData.name?.trim()) {
    errors.name = 'Shop name is required';
  }
  if (!formData.place?.trim()) {
    errors.place = 'Place is required';
  }

  console.log("THIS I SMY PHONE",formData.phone2);
  if (formData.phone && !/^\+?\d[\d\s]*$/.test(formData.phone.trim())) {
    errors.phone2 = 'Phone must contain only digits';
  }

  if (formData.phone2 && !/^\+?\d[\d\s]*$/.test(formData.phone2.trim())) {
    errors.phone2 = 'Phone must contain only digits';
  }


  // if (formData.phone2 && !/^\d{10}$/.test(formData.phone2)) {
  // console.log("THIS I SMY PHONE2",formData.phone2);
  //   errors.phone2 = 'Phone 2 must be 10 digits';
  // }

  if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Invalid email format';
  }
 if( !formData.secret_password?.trim()) {
    errors.secret_password = 'Secret password is required';
  }
  if (formData.secret_password && formData.secret_password.length < 4) {
    errors.secret_password = "Secret password must be at least 4 characters";
  }

  if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
    errors.pincode = 'Pincode must be 6 digits';
  }

  return errors;
};
