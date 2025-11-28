import React, { useState, useEffect } from "react";
import { updateShopSubscription } from "../../api/AdminApis";

const STATUS_OPTIONS = ["ACTIVE", "EXPIRED", "SUSPENDED"];

const UpdateShopSubscriptionModal = ({ isOpen, onClose, subscription_id, currentSub, onSuccess }) => {
  const [formData, setFormData] = useState({
    status: currentSub?.status || "ACTIVE",
    start_date: "", // optional
    end_date: "",   // optional
    plan_price_paid: currentSub?.paid_amount || "",
    payment_status: currentSub?.payment_status || false,
    auto_renew: currentSub?.auto_renew || false,
  });

  useEffect(() => {
    if (currentSub) {
      setFormData({
        status: currentSub?.status || "ACTIVE",
        start_date: "",
        end_date: "",
        plan_price_paid: currentSub?.paid_amount || "",
        payment_status: currentSub?.payment_status || false,
        auto_renew: currentSub?.auto_renew || false,
      });
    }
  }, [currentSub]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subscription_id) return;

    // Prepare payload
    const payload = {
      status: formData.status,
      plan_price_paid: formData.plan_price_paid,
      payment_status: formData.payment_status,
      auto_renew: formData.auto_renew,
    };

    // Only add start_date/end_date if admin updated it
    if (formData.start_date) payload.start_date = formData.start_date;
    if (formData.end_date) payload.end_date = formData.end_date;

    try {
      await updateShopSubscription(subscription_id, payload);
      alert("Subscription updated successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to update subscription:", err);
      alert("Failed to update subscription");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-w-full">
        <h3 className="text-lg font-semibold mb-4">Update Subscription</h3>

        <form onSubmit={handleSubmit} className="space-y-4">

         

          {/* Status */}
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Plan Price Paid */}
          <div>
            <label className="block text-sm font-medium">Plan Price Paid</label>
            <input
              type="number"
              step="0.01"
              name="plan_price_paid"
              value={formData.plan_price_paid}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          {/* Payment Status */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="payment_status"
              checked={formData.payment_status}
              onChange={handleChange}
            />
            <label>Payment Status (Paid)</label>
          </div>

          {/* Auto Renew */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="auto_renew"
              checked={formData.auto_renew}
              onChange={handleChange}
            />
            <label>Auto Renew</label>
          </div>

          {/* Optional Start/End Date Inputs */}
          <div className="mt-4 p-3 bg-gray-100 rounded space-y-2">
            <p className="text-sm text-gray-700">
              <strong>Current Start Date:</strong> {currentSub?.start_date || "N/A"}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Current End Date:</strong> {currentSub?.end_date || "N/A"}
            </p>

            <div>
              <label className="block text-sm font-medium">Update Start Date (Optional)</label>
              <input
                type="datetime-local"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Update End Date (Optional)</label>
              <input
                type="datetime-local"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Update
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UpdateShopSubscriptionModal;
