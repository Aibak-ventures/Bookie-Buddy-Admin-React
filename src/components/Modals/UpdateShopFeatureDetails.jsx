import React, { useState, useEffect } from "react";
import { updateShopFeature } from "../../api/AdminApis";

const UpdateShopFeatureDetails = ({
  isOpen,
  onClose,
  onSuccess,
  feature,
  subscription_id,
}) => {
  const [featureData, setFeatureData] = useState({
    price_paid: "",
    start_date: null,
    end_date: null,
    is_active: true, // Add is_active field

    usage_limit_enabled: false,
    usage_limit: {
      extra_limit: null,
      valid_until: "",
      is_active: true,
      reason: "",
    },
  });

  // ✅ Populate ONLY what your old code did
  useEffect(() => {
    if (feature) {
      setFeatureData({
        price_paid: feature.price_paid ?? "",
        start_date: null,   // ✅ keep EMPTY
        end_date: null,     // ✅ keep EMPTY
        is_active: feature.is_active ?? true, // Initialize with current status

        usage_limit_enabled: !!feature.usage_limit,
        usage_limit: feature.usage_limit
          ? {
              extra_limit: feature.usage_limit.extra_limit ?? null,
              valid_until: "",
              is_active: feature.usage_limit.is_active ?? true,
              reason: feature.usage_limit.reason ?? "",
            }
          : {
              extra_limit: null,
              valid_until: "",
              is_active: true,
              reason: "",
            },
      });
    }
  }, [feature]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeatureData((prev) => ({
      ...prev,
      [name]: value || null, // ✅ empty → null
    }));
  };

  const updateUsageLimitField = (field, value) => {
    setFeatureData((prev) => ({
      ...prev,
      usage_limit: {
        ...prev.usage_limit,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    // ✅ validation
    if (
      featureData.usage_limit_enabled &&
      (featureData.usage_limit.extra_limit === null ||
        featureData.usage_limit.extra_limit <= 0)
    ) {
      alert("Extra limit is required when usage limit is enabled");
      return;
    }

    try {
      // Build payload with only non-null fields
      const payload = {
        is_active: featureData.is_active, // Always include status
      };

      // Only include fields that have been modified (not null or empty)
      if (featureData.price_paid !== null && featureData.price_paid !== "") {
        payload.price_paid = featureData.price_paid;
      }

      if (featureData.start_date !== null && featureData.start_date !== "") {
        payload.start_date = featureData.start_date;
      }

      if (featureData.end_date !== null && featureData.end_date !== "") {
        payload.end_date = featureData.end_date;
      }

      if (featureData.usage_limit_enabled) {
        payload.usage_limit = {
          extra_limit: featureData.usage_limit.extra_limit,
          valid_until:
            featureData.usage_limit.valid_until || null,
          is_active: true,
          reason: featureData.usage_limit.reason || null,
        };
      }

      console.log("payload", payload);

      await updateShopFeature(subscription_id, feature.id, payload);

      alert("Feature updated successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.log("error?.response?.data?.message", error?.response?.data?.message);

      alert(
        error?.response?.data?.message || "Failed to update feature"
      );
      console.error(error);
    }
  };

  if (!isOpen || !feature) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Update Feature – {feature.name}
          </h2>
          {/* Current Status Badge */}
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
              featureData.is_active
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {featureData.is_active ? '● Active' : '● Inactive'}
          </span>
        </div>

        {/* Status Update Section */}
        <div className="mb-4 p-4 rounded-lg border-2 border-purple-200 bg-purple-50">
          <label className="text-sm font-semibold text-gray-800 mb-3 block">
            Feature Status
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="is_active"
                checked={featureData.is_active === true}
                onChange={() => setFeatureData(prev => ({ ...prev, is_active: true }))}
                className="w-4 h-4 text-green-600 focus:ring-2 focus:ring-green-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-green-700 transition flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Active
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="is_active"
                checked={featureData.is_active === false}
                onChange={() => setFeatureData(prev => ({ ...prev, is_active: false }))}
                className="w-4 h-4 text-red-600 focus:ring-2 focus:ring-red-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-red-700 transition flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Inactive
              </span>
            </label>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {featureData.is_active 
              ? '✓ Feature will be active and available to the shop.' 
              : '✗ Feature will be inactive and unavailable to the shop.'}
          </p>
        </div>

        {/* Paid Amount */}
        <label className="text-sm">Paid Amount</label>
        <input
          type="number"
          name="price_paid"
          value={featureData.price_paid}
          onChange={handleChange}
          className="w-full border p-2 rounded-md mt-1 mb-3"
        />

        {/* Start Date */}
        <label className="text-sm">
          Start Date & Time ({feature.start_date})
        </label>
        <input
          type="datetime-local"
          name="start_date"
          value={featureData.start_date || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded-md mt-1 mb-3"
        />

        {/* End Date */}
        <label className="text-sm">
          End Date & Time ({feature.end_date})
        </label>
        <input
          type="datetime-local"
          name="end_date"
          value={featureData.end_date || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded-md mt-1 mb-3"
        />

        {/* Usage Limit Toggle */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={featureData.usage_limit_enabled}
            onChange={(e) =>
              setFeatureData((prev) => ({
                ...prev,
                usage_limit_enabled: e.target.checked,
              }))
            }
          />
          <span className="text-sm font-medium">
            Enable Usage Limit
          </span>
        </div>

        {/* Usage Limit Fields */}
        {featureData.usage_limit_enabled && (
          <div className="mt-3 space-y-2 border-l-2 pl-3 border-purple-300">
            <label className="text-sm font-medium">
              Extra Limit <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={featureData.usage_limit.extra_limit ?? ""}
              onChange={(e) =>
                updateUsageLimitField(
                  "extra_limit",
                  e.target.value === ""
                    ? null
                    : Number(e.target.value)
                )
              }
            />

            <label className="text-sm font-medium">
              Valid Until (optional)
            </label>
            <input
              type="datetime-local"
              className="w-full p-2 border rounded"
              value={featureData.usage_limit.valid_until}
              onChange={(e) =>
                updateUsageLimitField(
                  "valid_until",
                  e.target.value
                )
              }
            />

            <label className="text-sm font-medium">
              Reason (optional)
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Promotional bonus"
              value={featureData.usage_limit.reason}
              onChange={(e) =>
                updateUsageLimitField("reason", e.target.value)
              }
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 rounded-md"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateShopFeatureDetails;
