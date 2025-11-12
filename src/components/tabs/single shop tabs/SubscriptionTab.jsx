import React, { useEffect, useState } from "react";
import { getShopSubscriptionDetails } from "../../../api/AdminApis";

// ✅ import all modals
import AssignPlanForShop from "../../Modals/AssignPlanForShop";
import UpdateShopPlanModal from "../../Modals/UpdateShopPlanModal";
import UpdateShopFeaturesModal from "../../Modals/UpdateShopFeaturesModal";

const SubscriptionTab = ({ shop_id, shopSubscriptionStatus }) => {
  console.log("subscription status",shopSubscriptionStatus);
  
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(shopSubscriptionStatus); // ✅ Manage status locally

  // ✅ Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateSubModal, setShowUpdateSubModal] = useState(false);
  const [showUpdateFeaturesModal, setShowUpdateFeaturesModal] = useState(false);

  // ✅ Sync local status with incoming prop
  useEffect(() => {
    setStatus(shopSubscriptionStatus);
  }, [shopSubscriptionStatus]);

  useEffect(() => {
    if (status === "ACTIVE") {
      fetchSubscriptionDetails();
    }
  }, [shop_id, status, showAddModal]);

  const fetchSubscriptionDetails = async () => {
    setLoading(true);
    try {
      const data = await getShopSubscriptionDetails(shop_id);
      setSubscriptionData(data);
      setStatus("ACTIVE");
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

      {status === "ACTIVE" && (
        <div className="absolute right-0 top-0 flex gap-2">
          <button
            onClick={() => setShowUpdateSubModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Update Subscription
          </button>
          <button
            onClick={() => setShowUpdateFeaturesModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Update Features
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
          setStatus("ACTIVE"); // ✅ update local status
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
      ) : status === "ACTIVE" && subscriptionData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* Left Section – Plan Info */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold mb-2">
              {subscriptionData.plan_name || "N/A"}
            </h4>
            <p className="text-blue-100 mb-4">
              ₹{subscriptionData.price || "N/A"}
            </p>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs">
                Active
              </span>
              <span className="text-blue-100">
                Until {subscriptionData.expiry_date || "N/A"}
              </span>
            </div>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
              Manage Subscription
            </button>
          </div>

          {/* Right Section – Features */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h5 className="font-medium mb-4">Plan Features</h5>
            <ul className="space-y-2">
              {subscriptionData.features && subscriptionData.features.length > 0 ? (
                subscriptionData.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-500">No features listed.</p>
              )}
            </ul>
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
