// components/Modals/ResetPasswordModal.jsx
import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";

const ResetPasswordModal = ({ isOpen, onClose, onReset, userId }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // Eye toggle
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    let tempErrors = {};

    // Validation
    if (password !== confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
      setErrors(tempErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const response = await onReset(userId, password);

      alert(response?.message || "Password reset successfully");
      setPassword("");
      setConfirmPassword("");
      onClose();
    } catch (err) {
      tempErrors.general =
        err?.error || err?.response?.data?.error || "Failed to reset password";
      setErrors(tempErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Reset Password
            </h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowConfirmation(true); // Show confirmation modal
            }}
            className="space-y-4"
          >
            {/* New Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-8 text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-8 text-gray-500"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* General Error */}
            {errors.general && (
              <p className="text-sm text-red-500 mt-2">{errors.general}</p>
            )}

         
            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={() => handleSubmit()}
        message="Do you want to change the password?"
      />
    </>
  );
};

export default ResetPasswordModal;
