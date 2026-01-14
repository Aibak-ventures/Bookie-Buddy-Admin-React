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

  // Store MULTIPLE selected features + their details
  const [selectedFeatures, setSelectedFeatures] = useState({});

  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setSelectedFeatures({});
      loadFeatures();
      setPage(1);
    }
  }, [isOpen]);

  const loadFeatures = async (url) => {
    try {
      const res = await fetchFeatures(url);
      

      const assignedIds = currentFeatures.map((f) => f.id);

      // filter OUT already assigned features
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

  // Toggle feature selection
  const toggleFeature = (feature) => {
    setSelectedFeatures((prev) => {
      if (prev[feature.id]) {
        const updated = { ...prev };
        delete updated[feature.id];
        return updated;
      }

      return {
        ...prev,
        [feature.id]: {
          feature_id: feature.id,
          price_paid: feature.base_price,
          start_date: new Date().toISOString().slice(0, 16),
          end_date: "",

          // ✅ NEW: usage limit support
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

    // ✅ Validation: extra_limit mandatory if enabled
    for (const f of selectedList) {
      if (
        f.usage_limit_enabled &&
        (f.usage_limit.extra_limit === null ||
          f.usage_limit.extra_limit <= 0)
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          Manage Addon Features
        </h2>

        {/* FEATURES LIST */}
        <div className="max-h-64 overflow-y-auto space-y-3 mb-3 border rounded-md p-3">
          {features.length === 0 ? (
            <p className="text-gray-500 text-sm">No features found.</p>
          ) : (
            features.map((feature) => {
              const selected = selectedFeatures[feature.id];
              return (
                <div key={feature.id} className="pb-3 border-b">
                  <label className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">
                        {feature.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {feature.feature_type}
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={!!selected}
                      onChange={() => toggleFeature(feature)}
                    />
                  </label>

                  {selected && (
                    <div className="mt-2 space-y-2">
                      <label>Price Paid (optional)</label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        value={selected.price_paid}
                        onChange={(e) =>
                          updateField(
                            feature.id,
                            "price_paid",
                            Number(e.target.value)
                          )
                        }
                      />

                      <label>Start Date</label>
                      <input
                        type="datetime-local"
                        className="w-full p-2 border rounded"
                        value={selected.start_date}
                        onChange={(e) =>
                          updateField(
                            feature.id,
                            "start_date",
                            e.target.value
                          )
                        }
                      />

                      <label>End Date (optional)</label>
                      <input
                        type="datetime-local"
                        className="w-full p-2 border rounded"
                        value={selected.end_date}
                        onChange={(e) =>
                          updateField(
                            feature.id,
                            "end_date",
                            e.target.value
                          )
                        }
                      />

                      {/* Usage Limit Toggle */}
                      <div className="flex items-center gap-2 mt-2">
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
                        />
                        <span className="text-sm font-medium">
                          Enable Usage Limit
                        </span>
                      </div>

                      {/* Usage Limit Fields */}
                      {selected.usage_limit_enabled && (
                        <div className="mt-2 space-y-2 border-l-2 pl-3 border-purple-300">
                          <label>
                            Extra Limit{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            className="w-full p-2 border rounded"
                            value={selected.usage_limit.extra_limit ?? ""}
                            onChange={(e) =>
                              updateUsageLimitField(
                                feature.id,
                                "extra_limit",
                                e.target.value === ""
                                  ? null
                                  : Number(e.target.value)
                              )
                            }
                          />

                          <label>Valid Until (optional)</label>
                          <input
                            type="datetime-local"
                            className="w-full p-2 border rounded"
                            value={selected.usage_limit.valid_until}
                            onChange={(e) =>
                              updateUsageLimitField(
                                feature.id,
                                "valid_until",
                                e.target.value
                              )
                            }
                          />

                          <label>Reason (optional)</label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded"
                            placeholder="Promotional bonus"
                            value={selected.usage_limit.reason}
                            onChange={(e) =>
                              updateUsageLimitField(
                                feature.id,
                                "reason",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mb-4">
          <button
            disabled={!prevUrl}
            onClick={goPrev}
            className={`px-3 py-1 rounded ${
              prevUrl
                ? "bg-gray-200 hover:bg-gray-300"
                : "bg-gray-100 cursor-not-allowed"
            }`}
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">Page {page}</span>

          <button
            disabled={!nextUrl}
            onClick={goNext}
            className={`px-3 py-1 rounded ${
              nextUrl
                ? "bg-gray-200 hover:bg-gray-300"
                : "bg-gray-100 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            {saving ? "Saving..." : "Save Features"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddShopFeaturesModal;
