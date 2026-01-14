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

  // Format date only (no time)
  const formatDateOnly = (dateString) => {
    const d = parseCustomDate(dateString);
    if (isNaN(d.getTime())) return "N/A";

    return d.toLocaleDateString("en-GB", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // 🚀 CALCULATE REMAINING DAYS
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

  // FETCH SUBSCRIPTION IF ACTIVE
  useEffect(() => {
    fetchSubscriptionDetails();
  }, [shop_id, status]);

  const fetchSubscriptionDetails = async () => {
    setLoading(true);
    try {
      const res = await getShopSubscriptionDetails(shop_id);
      const data = res?.data?.subscription || null;
      console.log("this is my response", res);
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

  const handleAddFeatureClick = () => {
    if (!subscriptionData?.id) {
      alert("⚠️ Please assign a subscription plan first before adding features.");
      return;
    }
    setShowUpdateFeaturesModal(true);
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'active') {
      return 'bg-emerald-500 text-white';
    } else if (statusLower === 'expired') {
      return 'bg-red-500 text-white';
    } else if (statusLower === 'pending') {
      return 'bg-amber-500 text-white';
    }
    return 'bg-gray-500 text-white';
  };

  // Get remaining days color
  const getRemainingDaysColor = (days) => {
    if (days <= 7) return 'text-red-100';
    if (days <= 30) return 'text-amber-100';
    return 'text-emerald-100';
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 -m-6 p-4 sm:p-6">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Subscription Management
          </h3>
          <p className="text-gray-600 mt-1 text-xs sm:text-sm">Manage subscription plans and addon features</p>
        </div>

        {status === "NONE" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Assign Subscription Plan</span>
            <span className="sm:hidden">Add Plan</span>
          </button>
        )}
      </div>

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

      <AddShopFeaturesModal
        shopId={shop_id}
        subscription_id={subscriptionData?.id}
        isOpen={showUpdateFeaturesModal}
        onClose={() => setShowUpdateFeaturesModal(false)}
        onSuccess={fetchSubscriptionDetails}
        currentFeatures={subscriptionData?.addon_features || []}
      />

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

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-blue-600"></div>
          <p className="text-blue-600 mt-4 font-semibold text-sm sm:text-base">Loading subscription details...</p>
        </div>
      ) : !subscriptionData ? (
        /* Empty State - No Subscription */
        <div className="max-w-2xl mx-auto mt-10 sm:mt-20">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-12 text-center border-2 border-dashed border-gray-300">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">No Active Subscription</h4>
            <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
              This shop doesn't have an active subscription plan. Assign a plan to enable premium features and addons.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold inline-flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Assign Subscription Plan
            </button>
          </div>
        </div>
      ) : (
        /* Active Subscription View */
        <div className="space-y-4 sm:space-y-6">

          {/* Subscription Plan Card */}
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8 relative">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white opacity-5 rounded-full -mr-24 sm:-mr-32 -mt-24 sm:-mt-32"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-white opacity-5 rounded-full -ml-16 sm:-ml-24 -mb-16 sm:-mb-24"></div>

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 sm:mb-6">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h4 className="text-2xl sm:text-3xl font-bold text-white">
                        {subscriptionData.plan?.name || "N/A"}
                      </h4>
                      <span className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusBadge(subscriptionData.status)} w-fit`}>
                        {subscriptionData.status}
                      </span>
                    </div>
                    <p className="text-blue-100 text-sm sm:text-base font-medium">
                      {subscriptionData.plan?.plan_type || "N/A"}
                    </p>
                  </div>

                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() => setShowUpdateModal(true)}
                      className="flex-1 sm:flex-none bg-white text-blue-700 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl hover:bg-blue-50 transition-all duration-200 text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-1 sm:gap-2"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Update
                    </button>
                    <button
                      onClick={handleCancelSubscription}
                      className="flex-1 sm:flex-none bg-red-600 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl hover:bg-red-700 transition-all duration-200 text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-1 sm:gap-2"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Remaining Days - Prominent Display */}
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-blue-100 text-xs sm:text-sm font-semibold mb-1">Time Remaining</p>
                      <p className={`text-3xl sm:text-5xl font-bold ${getRemainingDaysColor(calculateRemainingDays(subscriptionData.start_date, subscriptionData.end_date))}`}>
                        {calculateRemainingDays(subscriptionData.start_date, subscriptionData.end_date)}
                        <span className="text-lg sm:text-2xl ml-2">days</span>
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-blue-100 text-xs sm:text-sm font-semibold mb-1">Subscription Period</p>
                      <p className="text-white text-base sm:text-lg font-bold">
                        {formatDateOnly(subscriptionData.start_date)}
                      </p>
                      <p className="text-blue-200 text-xs sm:text-sm">to</p>
                      <p className="text-white text-base sm:text-lg font-bold">
                        {formatDateOnly(subscriptionData.end_date)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subscription Details Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <p className="text-blue-200 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">Auto Renew</p>
                    <p className="text-white text-sm sm:text-lg font-bold">
                      {subscriptionData.auto_renew ? "✓ Enabled" : "✗ Disabled"}
                    </p>
                  </div>

                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <p className="text-blue-200 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">Payment Status</p>
                    <p className="text-white text-sm sm:text-lg font-bold">
                      {subscriptionData.payment_status ? "✓ Paid" : "⏳ Pending"}
                    </p>
                  </div>

                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <p className="text-blue-200 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">Amount Paid</p>
                    <p className="text-white text-sm sm:text-lg font-bold">₹{subscriptionData.paid_amount || "0"}</p>
                  </div>

                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <p className="text-blue-200 text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1">Plan ID</p>
                    <p className="text-white text-sm sm:text-lg font-bold">#{subscriptionData.plan?.id || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Addon Features Section */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
              <div>
                <h4 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
                  <span className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </span>
                  <span className="text-lg sm:text-2xl">Addon Features</span>
                </h4>
                <p className="text-gray-600 text-xs sm:text-sm mt-1 ml-10 sm:ml-13">
                  {subscriptionData.addon_features?.length || 0} feature{subscriptionData.addon_features?.length !== 1 ? 's' : ''} active
                </p>
              </div>

              <button
                onClick={handleAddFeatureClick}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Add Feature</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg">
              <div className="flex items-start gap-2 sm:gap-3">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-blue-900 font-semibold text-xs sm:text-sm">Feature Assignment Requirement</p>
                  <p className="text-blue-700 text-xs sm:text-sm mt-1">
                    An active subscription plan is required before assigning addon features. Features extend the base plan capabilities.
                  </p>
                </div>
              </div>
            </div>

            {subscriptionData.addon_features?.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100">
                {subscriptionData.addon_features.map((feature) => (
                  <div
                    key={feature.id}
                    className="group bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-2 border-purple-200 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                      <div className="flex-1">
                        <h5 className="text-lg sm:text-xl font-bold text-purple-700 mb-1 group-hover:text-purple-800 transition-colors">
                          {feature.name}
                        </h5>
                        <div className="flex items-center gap-2">
                          <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            ₹{feature.price_paid}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white bg-opacity-60 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 text-xs">
                        <div>
                          <p className="uppercase tracking-wide font-bold text-gray-500 mb-1 text-[10px] sm:text-xs">Amount</p>
                          <p className="font-bold text-gray-800 text-xs sm:text-sm">₹{feature.price_paid}</p>
                        </div>
                        <div>
                          <p className="uppercase font-bold tracking-wide text-gray-500 mb-1 text-[10px] sm:text-xs">Start</p>
                          <p className="font-semibold text-gray-800 text-[10px] sm:text-xs">{formatDateOnly(feature.start_date)}</p>
                        </div>
                        <div>
                          <p className="uppercase font-bold tracking-wide text-gray-500 mb-1 text-[10px] sm:text-xs">End</p>
                          <p className="font-semibold text-gray-800 text-[10px] sm:text-xs">{formatDateOnly(feature.end_date)}</p>
                        </div>
                      </div>
                    </div>
                    <h6 className="font-bold">Usage info</h6>


                    <div className="bg-white bg-opacity-60 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                    <h6 className="font-semibold py-3">Total usage : {feature?.usage_limit?.use ?? "N/A"}</h6>

                      <div className="grid grid-cols-3 gap-2 sm:gap-3 text-xs">
                        <div>
                          <p className="uppercase tracking-wide font-bold text-gray-500 mb-1 text-[10px] ">Extra lmt</p>
                          <p className="font-bold text-gray-800 text-xs sm:text-sm">{feature?.usage_limit?.extra_limit ?? "N/A"}</p>
                        </div>
                        <div>
                          <p className="uppercase font-bold tracking-wide text-gray-500 mb-1 text-[10px] ">Valid</p>
                          <p className="font-semibold text-gray-800 text-[10px] sm:text-xs">{feature?.usage_limit?.valid_until ?? "N/A"}</p>
                        </div>
                        <div>
                          <p className="uppercase font-bold tracking-wide text-gray-500 mb-1 text-[10px] ">Reason</p>
                          <p className="font-semibold text-gray-800 text-[10px] sm:text-xs">{feature?.usage_limit?.reason ?? "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedFeature(feature)}
                        className="flex-1 bg-purple-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold hover:bg-purple-700 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 hover:scale-105"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFeature(feature.id)}
                        className="flex-1 bg-red-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold hover:bg-red-700 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 hover:scale-105"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 p-8 sm:p-12 rounded-xl sm:rounded-2xl text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h5 className="text-base sm:text-lg font-bold text-gray-700 mb-2">No Addon Features</h5>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 max-w-md mx-auto">
                  Enhance this subscription by adding premium features and capabilities.
                </p>
                <button
                  onClick={handleAddFeatureClick}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold inline-flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Your First Feature
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionTab;