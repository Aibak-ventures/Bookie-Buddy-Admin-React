// src/utils/errorHandler.js
export const handleApiError = (error, defaultMessage = "Something went wrong") => {
  if (error.response?.data) {
    if (error.response.data.detail) {
      return error.response.data.detail;
    }
    const errors = error.response.data;
    const firstKey = Object.keys(errors)[0];
    if (Array.isArray(errors[firstKey])) {
      return errors[firstKey][0];
    }
    return JSON.stringify(errors);
  }
  return defaultMessage;
};
