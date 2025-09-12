// src/validations/featureValidation.js

export const validateFeatureForm = (formData) => {
  const errors = {};

  if (!formData.name || formData.name.trim() === "") {
    errors.name = "Feature name is required";
  }

  if (!formData.code || formData.code.trim() === "") {
    errors.code = "Feature code is required";
  }

  if (!formData.feature_type || formData.feature_type.trim() === "") {
    errors.feature_type = "Feature type is required";
  }

  if (formData.base_price < 0) {
    errors.base_price = "Base price cannot be negative";
  }

  return errors;
};
