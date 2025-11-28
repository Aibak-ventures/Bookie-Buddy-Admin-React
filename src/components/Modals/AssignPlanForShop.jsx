import React, { useEffect, useState } from "react";
import { fetchSubscriptions, assignSubscriptionToShop } from "../../api/AdminApis";

const AssignPlanForShop = ({ shopId, isOpen, onClose, onSuccess }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [assigning, setAssigning] = useState(false);

  // Form Fields
  const [paidAmount, setPaidAmount] = useState("");
  const [autoRenew, setAutoRenew] = useState(false);
  const [durationDays, setDurationDays] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(false);

  // Editable start date (Default: Current IST)
  const getCurrentISTDateTimeLocal = () => {
    const now = new Date();
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + istOffsetMs);
    return istDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
  };

  const [startDate, setStartDate] = useState(getCurrentISTDateTimeLocal());

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await fetchSubscriptions();

      const plansArray =
        Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data?.data)
          ? data.data
          : [];

      setPlans(plansArray);
    } catch (err) {
      console.error("Error fetching plans:", err);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateEndDate = (start, days) => {
    const startObj = new Date(start);
    startObj.setDate(startObj.getDate() + Number(days));
    return startObj.toISOString().split(".")[0];
  };

  // ✅ Formatter for 12hr IST preview
  const formatTo12HrIST = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleAssign = async () => {
    if (!selectedPlan) return alert("Please select a plan first");
    if (!paidAmount) return alert("Please enter paid amount");
    if (!durationDays) return alert("Please enter duration days");

    setAssigning(true);

    try {
      const startISO = new Date(startDate).toISOString().split(".")[0];
      const endDate = calculateEndDate(startISO, durationDays);

      const payload = {
        shop_id: shopId,
        plan_id: selectedPlan.id,
        payment_status: paymentStatus,
        start_date: startISO,
        end_date: endDate,
        plan_price_paid: Number(paidAmount),
        auto_renew: autoRenew,
        duration_days: Number(durationDays),
      };

      await assignSubscriptionToShop(payload);

      alert("✅ Subscription assigned successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error assigning subscription:", err);
      alert("❌ Failed to assign subscription");
    } finally {
      setAssigning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 relative">

        <h2 className="text-2xl font-semibold mb-4">Assign Subscription Plan</h2>

        {loading ? (
          <p className="text-blue-500 text-center">Loading plans...</p>
        ) : plans.length === 0 ? (
          <p className="text-gray-500 text-center">No plans available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-auto p-2">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => {
                  setSelectedPlan(plan);
                  setDurationDays(plan.duration_days);
                  setPaidAmount(plan.base_price);
                }}
                className={`border rounded-lg p-5 cursor-pointer transition-all ${
                  selectedPlan?.id === plan.id
                    ? "border-blue-600 bg-blue-50 shadow-md"
                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{plan.name}</h3>
                  <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {plan.plan_type}
                  </span>
                </div>

                <p className="text-gray-600 mb-2">{plan.description}</p>
                <p className="text-gray-700 font-medium mb-1">
                  💰 <span className="text-green-600">₹{plan.base_price}</span>
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  Duration: <b>{plan.duration_days} days</b>
                </p>

                <ul className="text-sm text-gray-700 space-y-1 mt-2">
                  <li>📦 Max Products: {plan.max_products}</li>
                  <li>👥 Max Users: {plan.max_users}</li>
                  <li>📅 Bookings/Month: {plan.max_bookings_per_month}</li>
                </ul>

                {plan.included_features?.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium text-gray-800 mb-1">Included Features:</p>
                    <ul className="text-sm text-gray-600 list-disc ml-5 space-y-1">
                      {plan.included_features.map((f) => (
                        <li key={f.id}>{f.name} ({f.feature_type})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedPlan && (
          <div className="mt-6 space-y-4 border-t pt-4">

            {/* Paid Amount */}
            <div>
              <label className="block font-medium mb-1">Paid Amount (₹)</label>
              <input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Duration Days */}
            <div>
              <label className="block font-medium mb-1">Duration Days</label>
              <input
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Auto Renew */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoRenew}
                onChange={(e) => setAutoRenew(e.target.checked)}
              />
              <label className="font-medium">Auto Renew</label>
            </div>

            {/* Payment Status */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.checked)}
              />
              <label className="font-medium">Payment Status</label>
            </div>

            {/* ✅ Editable Start Date */}
            <div>
              <label className="block font-medium mb-1">Start Date</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              <p className="text-sm text-gray-600 mt-1">
                🕒 IST Preview: {formatTo12HrIST(startDate)} (IST)
              </p>
            </div>

          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100">
            Cancel
          </button>
          <button
            disabled={assigning}
            onClick={handleAssign}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {assigning ? "Assigning..." : "Assign Plan"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AssignPlanForShop;
