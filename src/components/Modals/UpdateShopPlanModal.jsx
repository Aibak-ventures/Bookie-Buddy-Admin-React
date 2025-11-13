// src/components/Modals/UpdateShopPlanModal.jsx
import React, { useEffect, useState } from "react";
import { fetchSubscriptions, assignSubscriptionToShop } from "../../api/AdminApis";

const UpdateShopPlanModal = ({ shopId, isOpen, onClose, onSuccess }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen]);

  const fetchPlans = async () => {
    try {
      const res = await fetchSubscriptions();
      setPlans(res?.data || []);
    } catch (err) {
      console.error("Error fetching plans:", err);
    }
  };

  const handleUpdate = async () => {
    if (!selectedPlan) {
      alert("Please select a plan first!");
      return;
    }
    setLoading(true);
    try {
      await updateShopPlan(shopId, {
        plan_id: selectedPlan,
        payment_status: paymentStatus,
        start_date: startDate,
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error updating plan:", err);
      alert("Failed to update plan. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Update Subscription Plan</h2>

        {/* Plan Selection */}
        {/* <label className="block text-sm font-medium mb-2">Select Plan</label>
        <select
          value={selectedPlan || ""}
          onChange={(e) => setSelectedPlan(e.target.value)}
          className="border border-gray-300 rounded-md w-full p-2 mb-4"
        >
          <option value="">-- Select a Plan --</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name} — ₹{plan.base_price}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium mb-2">
          Payment Completed?
        </label>
        <input
          type="checkbox"
          checked={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.checked)}
          className="mb-4"
        />

        <label className="block text-sm font-medium mb-2">
          Subscription Start Date
        </label>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-300 rounded-md w-full p-2 mb-6"
        /> */}

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateShopPlanModal;
