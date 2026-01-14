import React, { useEffect, useState } from "react";
import { fetchFeatures, addFeatureToShop } from "../../api/AdminApis";

const AddShopFeaturesModal = ({
  shopId,
  subscription_id,
  isOpen,
  onClose,
  onSuccess,
  currentFeatures = [],
}) => {
  const [features, setFeatures] = useState([]);
  const [saving, setSaving] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState({});
  const [expandedFeature, setExpandedFeature] = useState(null);

  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setSelectedFeatures({});
      setExpandedFeature(null);
      loadFeatures();
      setPage(1);
    }
  }, [isOpen]);

  const loadFeatures = async (url) => {
    try {
      const res = await fetchFeatures(url);
      const assignedIds = currentFeatures.map((f) => f.id);
      const filtered = (res.results || []).filter(
        (feature) => !assignedIds.includes(feature.id)
      );

      setFeatures(filtered);
      setNextUrl(res.next);
      setPrevUrl(res.previous);
    } catch (err) {
      console.error("Error fetching features:", err);
    }
  };

  const goNext = () => {
    if (nextUrl) {
      loadFeatures(nextUrl);
      setPage((p) => p + 1);
    }
  };

  const goPrev = () => {
    if (prevUrl) {
      loadFeatures(prevUrl);
      setPage((p) => p - 1);
    }
  };

  const toggleFeature = (feature) => {
    setSelectedFeatures((prev) => {
      if (prev[feature.id]) {
        const updated = { ...prev };
        delete updated[feature.id];
        if (expandedFeature === feature.id) setExpandedFeature(null);
        return updated;
      }

      setExpandedFeature(feature.id);
      return {
        ...prev,
        [feature.id]: {
          feature_id: feature.id,
          feature_name: feature.name,
          price_paid: feature.base_price,
          start_date: new Date().toISOString().slice(0, 16),
          end_date: "",
          usage_limit_enabled: false,
          usage_limit: {
            extra_limit: null,
            valid_until: "",
            is_active: true,
            reason: "",
          },
        },
      };
    });
  };

  const updateField = (featureId, field, value) => {
    setSelectedFeatures((prev) => ({
      ...prev,
      [featureId]: {
        ...prev[featureId],
        [field]: value,
      },
    }));
  };

  const updateUsageLimitField = (featureId, field, value) => {
    setSelectedFeatures((prev) => ({
      ...prev,
      [featureId]: {
        ...prev[featureId],
        usage_limit: {
          ...prev[featureId].usage_limit,
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    const selectedList = Object.values(selectedFeatures);

    if (selectedList.length === 0) {
      alert("Please select at least one feature");
      return;
    }

    for (const f of selectedList) {
      if (
        f.usage_limit_enabled &&
        (f.usage_limit.extra_limit === null || f.usage_limit.extra_limit <= 0)
      ) {
        alert("Extra limit is required when usage limit is enabled");
        return;
      }
    }

    setSaving(true);

    try {
      const payload = {
        features: selectedList.map((f) => {
          const base = {
            feature_id: f.feature_id,
            price_paid: f.price_paid,
            start_date: f.start_date,
            end_date: f.end_date || undefined,
          };

          if (f.usage_limit_enabled) {
            base.usage_limit = {
              extra_limit: f.usage_limit.extra_limit,
              valid_until: f.usage_limit.valid_until || undefined,
              is_active: true,
              reason: f.usage_limit.reason || undefined,
            };
          }

          return base;
        }),
      };

      const response = await addFeatureToShop(subscription_id, payload);
      alert(response?.data?.status || "Features added successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating shop:", error);
      alert("Failed to update features");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const selectedCount = Object.keys(selectedFeatures).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Add Addon Features</h2>
              <p className="text-purple-100 text-sm">
                Select features and configure their settings for this shop
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Selection Counter */}
          {selectedCount > 0 && (
            <div className="mt-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">{selectedCount} feature{selectedCount !== 1 ? 's' : ''} selected</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* Features Grid */}
          {features.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No features available</p>
              <p className="text-gray-400 text-sm mt-1">All features have been assigned or none exist</p>
            </div>
          ) : (
            <div className="space-y-3">
              {features.map((feature) => {
                const selected = selectedFeatures[feature.id];
                const isExpanded = expandedFeature === feature.id;

                return (
                  <div
                    key={feature.id}
                    className={`border-2 rounded-xl transition-all duration-200 ${selected
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm'
                      }`}
                  >
                    {/* Feature Header */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          {/* Custom Checkbox */}
                          <label className="relative flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!selected}
                              onChange={() => toggleFeature(feature)}
                              className="sr-only peer"
                            />
                            <div className="w-6 h-6 border-2 border-gray-300 rounded-md peer-checked:bg-purple-600 peer-checked:border-purple-600 transition-all flex items-center justify-center">
                              {selected && (
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </label>

                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg">{feature.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {feature.feature_type}
                              </span>
                              <span className="text-sm text-gray-600">
                                Base Price: <span className="font-semibold text-purple-600">₹{feature.base_price}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Expand/Collapse Button */}
                        {selected && (
                          <button
                            onClick={() => setExpandedFeature(isExpanded ? null : feature.id)}
                            className="text-purple-600 hover:bg-purple-100 rounded-lg p-2 transition-all"
                          >
                            <svg
                              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Feature Configuration Form */}
                      {selected && isExpanded && (
                        <div className="mt-4 pt-4 border-t border-purple-200 space-y-4">

                          {/* Price and Dates Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Price Paid */}
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Price Paid
                                </div>
                              </label>
                              <input
                                type="number"
                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                placeholder="0.00"
                                value={selected.price_paid}
                                onChange={(e) => updateField(feature.id, "price_paid", Number(e.target.value))}
                              />
                            </div>

                            {/* Start Date */}
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  Start Date <span className="text-red-500">*</span>
                                </div>
                              </label>
                              <input
                                type="datetime-local"
                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                value={selected.start_date}
                                onChange={(e) => updateField(feature.id, "start_date", e.target.value)}
                              />
                            </div>

                            {/* End Date */}
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  End Date <span className="text-gray-400 text-xs">(Optional)</span>
                                </div>
                              </label>
                              <input
                                type="datetime-local"
                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                value={selected.end_date}
                                onChange={(e) => updateField(feature.id, "end_date", e.target.value)}
                              />
                            </div>
                          </div>

                          {/* Usage Limit Section */}
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-200">
                            <label className="flex items-center gap-3 cursor-pointer group">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={selected.usage_limit_enabled}
                                  onChange={(e) =>
                                    setSelectedFeatures((prev) => ({
                                      ...prev,
                                      [feature.id]: {
                                        ...prev[feature.id],
                                        usage_limit_enabled: e.target.checked,
                                      },
                                    }))
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-purple-600 transition-all"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-900">Enable Usage Limit</span>
                                <p className="text-xs text-gray-600">Set additional usage restrictions for this feature</p>
                              </div>
                            </label>

                            {selected.usage_limit_enabled && (
                              <div className="mt-4 pt-4 border-t border-purple-300 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* Extra Limit */}
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                      Extra Limit <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="number"
                                      className="w-full px-4 py-2.5 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                      placeholder="Enter limit"
                                      value={selected.usage_limit.extra_limit ?? ""}
                                      onChange={(e) =>
                                        updateUsageLimitField(
                                          feature.id,
                                          "extra_limit",
                                          e.target.value === "" ? null : Number(e.target.value)
                                        )
                                      }
                                    />
                                  </div>

                                  {/* Valid Until */}
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                      Valid Until <span className="text-gray-400 text-xs">(Optional)</span>
                                    </label>
                                    <input
                                      type="datetime-local"
                                      className="w-full px-4 py-2.5 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                      value={selected.usage_limit.valid_until}
                                      onChange={(e) =>
                                        updateUsageLimitField(feature.id, "valid_until", e.target.value)
                                      }
                                    />
                                  </div>
                                </div>

                                {/* Reason */}
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Reason <span className="text-gray-400 text-xs">(Optional)</span>
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full px-4 py-2.5 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                    placeholder="e.g., Promotional bonus, Special offer"
                                    value={selected.usage_limit.reason}
                                    onChange={(e) =>
                                      updateUsageLimitField(feature.id, "reason", e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mb-4">
            <button
              disabled={!prevUrl}
              onClick={goPrev}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${prevUrl
                  ? 'bg-white border-2 border-purple-300 text-purple-600 hover:bg-purple-50'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-bold">
              Page {page}
            </div>

            <button
              disabled={!nextUrl}
              onClick={goNext}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${nextUrl
                  ? 'bg-white border-2 border-purple-300 text-purple-600 hover:bg-purple-50'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-all"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving || selectedCount === 0}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 ${saving || selectedCount === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105'
                }`}
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save {selectedCount} Feature{selectedCount !== 1 ? 's' : ''}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddShopFeaturesModal;
