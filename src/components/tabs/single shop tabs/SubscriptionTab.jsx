import React, { useEffect, useState } from "react";
import { getShopSubscriptionDetails, cancelShopSubscription } from "../../../api/AdminApis";

// Modals
import AssignPlanForShop from "../../Modals/AssignPlanForShop";
import UpdateShopPlanModal from "../../Modals/UpdateShopPlanModal";
import UpdateShopFeaturesModal from "../../Modals/UpdateShopFeaturesModal";

const SubscriptionTab = ({ shop_id, shopSubscriptionStatus }) => {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(shopSubscriptionStatus);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateSubModal, setShowUpdateSubModal] = useState(false);
  const [showUpdateFeaturesModal, setShowUpdateFeaturesModal] = useState(false);
  console.log("my subscription data",subscriptionData);
  

  // Sync status
  useEffect(() => {
    setStatus(shopSubscriptionStatus);
  }, [shopSubscriptionStatus]);

  // Parse custom date (DD-MM-YYYY HH:mm:ss)
  const parseCustomDate = (dateString) => {
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("-").map(Number);
    return new Date(`${year}-${month}-${day}T${timePart}`);
  };

  // 🚀 Calculate remaining days
  const calculateRemainingDays = (start, end) => {
    try {
      const today = new Date();
      const endDate = parseCustomDate(end);

      if (isNaN(endDate)) return 0;
      if (today > endDate) return 0;

      const diff = endDate - today;
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    } catch {
      return 0;
    }
  };

  // Fetch subscription if active
  useEffect(() => {
    if (status === "ACTIVE") {
      fetchSubscriptionDetails();
    }
  }, [shop_id, status]);

  const fetchSubscriptionDetails = async () => {
    setLoading(true);
    try {
      const res = await getShopSubscriptionDetails(shop_id);
      const data = res?.data?.subscription || null;

      setSubscriptionData(data);
      setStatus(data?.status === "ACTIVE" ? "ACTIVE" : "NONE");
    } catch (err) {
      console.error("Error fetching subscription details:", err);
      setSubscriptionData(null);
      setStatus("NONE");
    } finally {
      setLoading(false);
    }
  };

  // 🚨 CANCEL SUBSCRIPTION HANDLER
  const handleCancelSubscription = async () => {
    if (!subscriptionData?.id) {
      alert("Subscription not found");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this subscription?")) {
      return;
    }

    try {
      await cancelShopSubscription(subscriptionData.id);
      alert("Subscription cancelled successfully");

      setStatus("NONE");
      setSubscriptionData(null);

      fetchSubscriptionDetails();
    } catch (err) {
      console.error("Error canceling subscription:", err);
      alert("Failed to cancel subscription");
    }
  };

  return (
    <div className="relative">
      <h3 className="text-lg font-semibold mb-6">Subscription Details</h3>

      {/* Add Subscription Button */}
      {status === "NONE" && (
        <div className="absolute right-0 top-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            + Add Subscription
          </button>
        </div>
      )}

      {/* Modals */}
      <AssignPlanForShop
        shopId={shop_id}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          setStatus("ACTIVE");
          fetchSubscriptionDetails();
        }}
      />

      <UpdateShopPlanModal
        shopId={shop_id}
        isOpen={showUpdateSubModal}
        onClose={() => setShowUpdateSubModal(false)}
        onSuccess={fetchSubscriptionDetails}
      />

      <UpdateShopFeaturesModal
        shopId={shop_id}
        isOpen={showUpdateFeaturesModal}
        onClose={() => setShowUpdateFeaturesModal(false)}
        onSuccess={fetchSubscriptionDetails}
        currentFeatures={subscriptionData?.addon_features || []}
      />

      {/* MAIN CONTENT */}
      {loading ? (
        <p className="text-blue-500 mt-6">Loading subscription details...</p>
      ) : status === "NONE" ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-600 mt-12">
          No active plans for this shop.
        </div>
      ) : subscriptionData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">

          {/* LEFT CARD - Subscription Info */}
          <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 p-6 rounded-2xl shadow-xl text-white">

            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-2xl font-bold mb-1">
                  {subscriptionData.plan?.name || "N/A"}
                </h4>
                <p className="text-blue-200 text-sm">
                  {subscriptionData.plan?.plan_type || "N/A"}
                </p>
              </div>

              <div className="space-x-2 flex">
                <button
                  onClick={() => setShowUpdateSubModal(true)}
                  className="bg-white text-blue-700 px-3 py-1 rounded-md hover:bg-gray-100 
                          transition-colors text-sm font-medium shadow-sm"
                >
                  Update
                </button>

                {/* ❌ CANCEL BUTTON HERE */}
                <button
                  onClick={handleCancelSubscription}
                  className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 
                          transition-colors text-sm font-medium shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mt-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold 
                        bg-green-500 text-white tracking-wide">
                {subscriptionData.status}
              </span>
            </div>

            {/* Remaining Days */}
            <div className="mt-5 text-xl font-semibold">
              <span className="text-white">
                {calculateRemainingDays(subscriptionData.start_date, subscriptionData.end_date)}
              </span>{" "}
              <span className="text-blue-200 text-sm">days left</span>
            </div>

            {/* Duration */}
            <div className="mt-1 text-sm text-blue-200">
              {subscriptionData.start_date} → {subscriptionData.end_date}
            </div>

            <div className="my-6 border-t border-white/30"></div>

            {/* Details */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-200">Paid Amount:</span>
                <span className="font-medium text-white">
                  ₹{subscriptionData.paid_amount || "N/A"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-blue-200">Payment Status:</span>
                <span className="font-medium">
                  {subscriptionData.payment_status ? "Paid" : "Unpaid"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-blue-200">Auto Renew:</span>
                <span className="font-medium">
                  {subscriptionData.auto_renew ? "Enabled" : "Disabled"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-blue-200">Base Price:</span>
                <span className="font-medium">
                  ₹{subscriptionData.plan?.base_price || "N/A"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-blue-200">Duration:</span>
                <span className="font-medium">
                  {subscriptionData.plan?.duration_days || "N/A"} days
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT CARD — Addon Features */}
          <div className="relative bg-gray-50 p-6 rounded-lg shadow-md">
            <h5 className="font-medium mb-4">Addon Features</h5>

            {subscriptionData.addon_features?.length > 0 ? (
              <ul className="space-y-3">
                {subscriptionData.addon_features.map((feature) => (
                  <li
                    key={feature.id}
                    className="border-b pb-2 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{feature.name}</p>
                      <p className="text-xs text-gray-500">
                        Active till {feature.end_date}
                      </p>
                    </div>
                    <span className="text-sm text-blue-600 font-semibold">
                      ₹{feature.price_paid}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No addon features available.</p>
            )}

            <button
              onClick={() => setShowUpdateFeaturesModal(true)}
              className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              {subscriptionData.addon_features?.length > 0 ? "Update Feature Details" : "Add Feature"}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500 mt-12">
          No subscription data available.
        </div>
      )}
    </div>
  );
};

export default SubscriptionTab;
