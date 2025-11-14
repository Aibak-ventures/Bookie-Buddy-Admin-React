import React, { useEffect, useState } from "react";
import { fetchFeatures, addFeatureToShop } from "../../api/AdminApis";

const UpdateShopFeaturesModal = ({
  shopId,
  isOpen,
  onClose,
  onSuccess,
  currentFeatures = [],
}) => {
  const [features, setFeatures] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [saving, setSaving] = useState(false);

  const [featureData, setFeatureData] = useState({});

  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setSelectedFeature(null);
      setFeatureData({});
      loadFeatures();
      setPage(1);
    }
  }, [isOpen]);

const loadFeatures = async (url) => {
  try {
    const res = await fetchFeatures(url);

    // Already assigned IDs
    const assignedIds = currentFeatures.map((f) => f.id);

    // Filter out assigned features
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

  const updateField = (field, value) => {
    setFeatureData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /** Save only one feature */
  const handleSave = async () => {
    if (!selectedFeature) {
      alert("Please select one feature to add");
      return;
    }

    // Check if already assigned
    const alreadyAssignedIds = currentFeatures.map((f) => f.id);
    if (alreadyAssignedIds.includes(selectedFeature)) {
      alert("This feature is already added to the shop");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        feature_id: selectedFeature,
        start_date: new Date().toISOString(),
      };

      if (featureData.price_paid) payload.price_paid = Number(featureData.price_paid);
      if (featureData.end_date) payload.end_date = featureData.end_date;

      const response = await addFeatureToShop(shopId, payload);
      console.log("response",response);
      alert(response?.data?.status || "feature added successfully")
      

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating shop:", error);
      alert("Failed to update feature");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Manage Addon Features</h2>

        <div className="max-h-64 overflow-y-auto space-y-3 mb-3 border rounded-md p-3">
          {features.length === 0 ? (
            <p className="text-gray-500 text-sm">No features found.</p>
          ) : (
            features.map((feature) => (
              <div key={feature.id} className="pb-3 border-b">
                <label className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{feature.name}</p>
                    <p className="text-xs text-gray-500">{feature.feature_type}</p>
                  </div>

                  {/* RADIO BUTTON (only one selection allowed) */}
                  <input
                    type="radio"
                    name="selectedFeature"
                    checked={selectedFeature === feature.id}
                    onChange={() => {
                      setSelectedFeature(feature.id);
                      setFeatureData({});
                    }}
                  />
                </label>

                {selectedFeature === feature.id && (
                  <div className="mt-2 space-y-2">
                  <label htmlFor="">Price Paid(optional)</label>

                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={featureData.price_paid || ""}
                      onChange={(e) => updateField("price_paid", e.target.value)}
                    />
                  <label htmlFor="">End Date (optional)</label>
                    <input
                      type="datetime-local"
                      className="w-full p-2 border rounded"
                      value={featureData.end_date || ""}
                      onChange={(e) => updateField("end_date", e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex justify-between items-center mb-4">
          <button
            disabled={!prevUrl}
            onClick={goPrev}
            className={`px-3 py-1 rounded ${
              prevUrl ? "bg-gray-200 hover:bg-gray-300" : "bg-gray-100 cursor-not-allowed"
            }`}
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">Page {page}</span>

          <button
            disabled={!nextUrl}
            onClick={goNext}
            className={`px-3 py-1 rounded ${
              nextUrl ? "bg-gray-200 hover:bg-gray-300" : "bg-gray-100 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>

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
            {saving ? "Saving..." : "Save Feature"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateShopFeaturesModal;
