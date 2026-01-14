import React, { useEffect, useState } from "react";
import { getShopSubscriptionDetails, cancelShopSubscription } from "../../../api/AdminApis";
import UpdateShopFeatureDetails from "../../Modals/UpdateShopFeatureDetails";
import { deleteShopFeature } from "../../../api/AdminApis";

// Modals
import AssignPlanForShop from "../../Modals/AssignPlanForShop";
import AddShopFeaturesModal from "../../Modals/AddShopFeaturesModal";
import UpdateShopSubscriptionModal from "../../Modals/UpdateShopSubscriptionModal";

const SubscriptionTab = ({ shop_id, shopSubscriptionStatus }) => {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(shopSubscriptionStatus);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateFeaturesModal, setShowUpdateFeaturesModal] = useState(false);

  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showFeatureEditModal, setShowFeatureEditModal] = useState(false);

  // Sync status
  useEffect(() => {
    setStatus(shopSubscriptionStatus);
  }, [shopSubscriptionStatus]);

  // ✅ PARSE CUSTOM DATE (your backend format)
  const parseCustomDate = (dateString) => {
    try {
      if (!dateString) return new Date("");
      const [datePart, timePart] = dateString.split(" ");
      if (!datePart) return new Date("");

      const [day, month, year] = datePart.split("-").map(Number);
      const [hours, minutes, seconds] = (timePart || "00:00:00").split(":").map(Number);

      return new Date(year, month - 1, day, hours, minutes, seconds);
    } catch {
      return new Date("");
    }
  };

  // ✅ FORMAT DATE + TIME IN IST 12 HOUR
  const formatDateTime = (dateString) => {
    const d = parseCustomDate(dateString);
    if (isNaN(d.getTime())) return "N/A";

    // Convert to IST timezone and 12 hour format
    return d.toLocaleString("en-GB", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // 🚀 CALCULATE REMAINING DAYS (unchanged)
  const calculateRemainingDays = (start, end) => {
    try {
      const today = new Date();
      const endDate = parseCustomDate(end);
      if (isNaN(endDate.getTime())) return 0;
      const diff = endDate - today;
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    } catch (err) {
      console.log("here some error ", err);
      return 0;
    }
  };

  // FETCH SUBSCRIPTION IF ACTIVE (unchanged)
  useEffect(() => {
      fetchSubscriptionDetails();
  }, [shop_id, status]);

  const fetchSubscriptionDetails = async () => {
    setLoading(true);
    try {
      const res = await getShopSubscriptionDetails(shop_id);
      const data = res?.data?.subscription || null;
    console.log("this is my response",res);
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

  const handleDeleteFeature = async (featureId) => {
    if (!window.confirm("Are you sure you want to delete this feature?")) return;
  
    try {
      await deleteShopFeature(subscriptionData.id, featureId);
      alert("Feature deleted successfully!");
      fetchSubscriptionDetails();
    } catch (error) {
      alert("Failed to delete feature");
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedFeature) {
      setShowFeatureEditModal(true);
    }
  }, [selectedFeature]);

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

      

      <AddShopFeaturesModal
        shopId={shop_id}
        subscription_id={subscriptionData?.id}
        isOpen={showUpdateFeaturesModal}
        onClose={() => setShowUpdateFeaturesModal(false)}
        onSuccess={fetchSubscriptionDetails}
        currentFeatures={subscriptionData?.addon_features || []}
      />

      {loading ? (
        <p className="text-blue-500 mt-6">Loading subscription details...</p>
      ) : !subscriptionData ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-600 mt-12">
          No active plans for this shop.
        </div>
      ) : subscriptionData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">

          {/* LEFT CARD */}
          <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 p-6 rounded-2xl shadow-xl text-white">
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
                  onClick={() => setShowUpdateModal(true)}
                  className="bg-white text-blue-700 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium shadow-sm"
                >
                  Update
                </button>
                <button
                  onClick={handleCancelSubscription}
                  className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm font-medium shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="mt-4">
              <span className="inline-block px-3 py-1 bg-green-500 rounded-full text-xs font-semibold">
                {subscriptionData.status}
              </span>
            </div>

            <div className="mt-5 text-xl font-semibold">
              {calculateRemainingDays(subscriptionData.start_date, subscriptionData.end_date)} days left
            </div>
            

            <div className="mt-1 text-sm text-blue-200">
              {formatDateTime(subscriptionData.start_date)} → {formatDateTime(subscriptionData.end_date)}
            </div>
            <div className="mt-1 text-sm text-white-200">
              Auto Renew: {subscriptionData.auto_renew ? "Enabled" : "Disabled"}
            </div>
             <div className="mt-1 text-sm text-white-200">
              Payment Status: {subscriptionData.payment_status ? "Paid" : "Pending"}
            </div>  
             <div className="mt-1 text-sm text-white-200">
              Paid Amount: ₹{subscriptionData.paid_amount || "0"} 
            </div>  
          </div>

          {/* ############################ */}
          {/* ✅ UPDATED FEATURES UI BELOW */}
          {/* ############################ */}

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">

            <div className="flex justify-between items-center mb-5">
              <h4 className="text-xl font-bold text-gray-800">Addon Features</h4>
            </div>

            {subscriptionData.addon_features?.length > 0 ? (
              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin">

                {subscriptionData.addon_features.map((feature) => (
                  <div key={feature.id}
                    className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">

                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-lg font-bold text-purple-700">{feature.name}</h5>
                       
                      </div>

                      <span className="text-base font-extrabold text-blue-600">₹{feature.price_paid}</span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs text-gray-600">

                      <div>
                        <p className="uppercase tracking-wide font-semibold text-gray-500 text-[10px]">Paid</p>
                        <p className="font-medium">₹{feature.price_paid}</p>
                      </div>

                      <div>
                        <p className="uppercase font-semibold tracking-wide text-gray-500 text-[10px]">Start</p>
                        <p className="font-medium">{formatDateTime(feature.start_date)}</p>
                      </div>

                      <div>
                        <p className="uppercase font-semibold tracking-wide text-gray-500 text-[10px]">End</p>
                        <p className="font-medium">{formatDateTime(feature.end_date)}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => setSelectedFeature(feature)}
                        className="bg-purple-600 text-white px-4 py-1.5 rounded-xl text-xs hover:bg-purple-700 transition-colors"
                      >✏ Edit</button>

                      <button
                        onClick={() => handleDeleteFeature(feature.id)}
                        className="bg-red-600 text-white px-4 py-1.5 rounded-xl text-xs hover:bg-red-700 transition-colors"
                      >🗑 Delete</button>
                    </div>

                  </div>
                ))}

              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-xl text-center text-gray-500 text-sm">
                No addon features available.
              </div>
            )}

            {/* ✅ ADD FEATURES BUTTON */}
            {subscriptionData?.id && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowUpdateFeaturesModal(true)}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md"
                >+ Add Features</button>
              </div>
            )}

          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500 mt-12">
          No subscription data available.
        </div>
      )}

      <UpdateShopFeatureDetails
        isOpen={showFeatureEditModal}
        onClose={() => setShowFeatureEditModal(false)}
        onSuccess={fetchSubscriptionDetails}
        feature={selectedFeature}
        subscription_id={subscriptionData?.id}
      />

      <UpdateShopSubscriptionModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        subscription_id={subscriptionData?.id}
        onSuccess={fetchSubscriptionDetails}
        currentSub={subscriptionData}
      />
      <AssignPlanForShop
        shopId={shop_id}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchSubscriptionDetails}
      />
      
    </div>
  );
};

export default SubscriptionTab;
