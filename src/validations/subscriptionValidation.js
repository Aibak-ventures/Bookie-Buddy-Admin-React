// src/utils/validation/subscriptionValidation.js
export const validateSubscriptionForm = (formData, availableFeatures = []) => {
  const errors = {};

  // === 📛 Name ===
  if (!formData.name?.trim()) {
    errors.name = "Subscription name is required";
  } else if (formData.name.length > 100) {
    errors.name = "Name cannot exceed 100 characters";
  }

  // === 🏷️ Plan Type ===
  const validPlanTypes = ["BASIC", "PREMIUM", "ENTERPRISE"];
  if (!formData.plan_type) {
    errors.plan_type = "Plan type is required";
  } else if (!validPlanTypes.includes(formData.plan_type)) {
    errors.plan_type = "Invalid plan type";
  }

  // === 💰 Base Price ===
  if (formData.base_price === null || formData.base_price === undefined) {
    errors.base_price = "Base price is required";
  } else if (isNaN(formData.base_price)) {
    errors.base_price = "Base price must be a number";
  } else if (formData.base_price < 0) {
    errors.base_price = "Base price cannot be negative";
  }

  // === 👥 Max Users ===
  if (formData.max_users !== undefined && formData.max_users < 0) {
    errors.max_users = "Max users cannot be negative";
  }

  // === 📦 Max Products ===
  if (formData.max_products !== undefined && formData.max_products < 0) {
    errors.max_products = "Max products cannot be negative";
  }

  // === 📅 Max Bookings Per Month ===
  if (
    formData.max_bookings_per_month !== undefined &&
    formData.max_bookings_per_month < 0
  ) {
    errors.max_bookings_per_month = "Max bookings cannot be negative";
  }

  // === ⏳ Duration ===
  if (formData.duration_days !== undefined && formData.duration_days < 0) {
    errors.duration_days = "Duration days cannot be negative";
  }

  // === ✅ Features ===
  if (formData.included_features?.length > 0) {
    const featureIds = availableFeatures.map((f) => f.id);
    const invalidFeatures = formData.included_features.filter(
      (fid) => !featureIds.includes(fid)
    );
    if (invalidFeatures.length > 0) {
      errors.included_features = "Some selected features are invalid or inactive";
    }
  }

  return errors;
};
