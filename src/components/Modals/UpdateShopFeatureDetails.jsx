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
      const payload = {
        price_paid: featureData.price_paid,
        start_date: featureData.start_date,
        end_date: featureData.end_date,
      };

      if (featureData.usage_limit_enabled) {
        payload.usage_limit = {
          extra_limit: featureData.usage_limit.extra_limit,
          valid_until:
            featureData.usage_limit.valid_until || null,
          is_active: true,
          reason: featureData.usage_limit.reason || null,
        };
      }

      await updateShopFeature(subscription_id, feature.id, payload);

      alert("Feature updated successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      alert(
        error?.response?.data?.message || "Failed to update feature"
      );
      console.error(error);
    }
  };

  if (!isOpen || !feature) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          Update Feature – {feature.name}
        </h2>

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
