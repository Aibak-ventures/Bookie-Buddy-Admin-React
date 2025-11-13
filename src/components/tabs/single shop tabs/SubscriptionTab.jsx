import React, { useEffect, useState } from "react";
import { getShopSubscriptionDetails } from "../../../api/AdminApis";

// ✅ Import modals
import AssignPlanForShop from "../../Modals/AssignPlanForShop";
import UpdateShopPlanModal from "../../Modals/UpdateShopPlanModal";
import UpdateShopFeaturesModal from "../../Modals/UpdateShopFeaturesModal";

const SubscriptionTab = ({ shop_id, shopSubscriptionStatus }) => {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(shopSubscriptionStatus);

  // ✅ Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateSubModal, setShowUpdateSubModal] = useState(false);
  const [showUpdateFeaturesModal, setShowUpdateFeaturesModal] = useState(false);

  // ✅ Sync status with incoming prop
  useEffect(() => {
    setStatus(shopSubscriptionStatus);
  }, [shopSubscriptionStatus]);

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
      console.log('data',data);
      
      setSubscriptionData(data);
      if (data?.status === "ACTIVE") setStatus("ACTIVE");
      else setStatus("NONE");
    } catch (err) {
      console.error("Error fetching subscription details:", err);
      setSubscriptionData(null);
      setStatus("NONE");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <h3 className="text-lg font-semibold mb-6">Subscription Details</h3>

      {/* ===================== HEADER BUTTONS ===================== */}
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

      {/* ===================== MODALS ===================== */}
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
      />

      {/* ===================== MAIN CONTENT ===================== */}
      {loading ? (
        <p className="text-blue-500 mt-6">Loading subscription details...</p>
      ) : status === "NONE" ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-600 mt-12">
          No active plans for this shop.
        </div>
      ) : subscriptionData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* LEFT SECTION – PLAN DETAILS */}
          <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold mb-2">
              {subscriptionData.plan?.name || "N/A"}
            </h4>
            <p className="text-blue-100 mb-4">
              ₹{subscriptionData.plan?.base_price || "N/A"} /{" "}
              {subscriptionData.plan?.duration_days || "N/A"} days
            </p>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs">
                {subscriptionData.status}
              </span>
              <span className="text-blue-100">
                Until {subscriptionData.end_date || "N/A"}
              </span>
            </div>

            <p className="text-sm mb-2">
              <strong>Plan Type:</strong> {subscriptionData.plan?.plan_type}
            </p>
            <p className="text-sm mb-2">
              <strong>Paid Amount:</strong> ₹{subscriptionData.paid_amount}
            </p>
            <p className="text-sm mb-4">
              <strong>Auto Renew:</strong>{" "}
              {subscriptionData.auto_renew ? "Enabled" : "Disabled"}
            </p>

            <button
              onClick={() => setShowUpdateSubModal(true)}
              className="absolute top-4 right-4 bg-white text-blue-600 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              Update Plan Details
            </button>
          </div>

          {/* RIGHT SECTION – ADDON FEATURES */}
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
              Update Feature Details
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
