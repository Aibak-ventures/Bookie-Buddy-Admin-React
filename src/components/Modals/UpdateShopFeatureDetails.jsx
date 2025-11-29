import React, { useState, useEffect } from "react";
import { updateShopFeature } from "../../api/AdminApis";

const UpdateShopFeatureDetails = ({ isOpen, onClose, onSuccess, feature ,subscription_id }) => {
  const [featureData, setFeatureData] = useState({
    id: feature?.id,
    price_paid: feature?.price_paid || "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    if (feature) {
      setFeatureData((prev) => ({
        ...prev,
        id: feature.id,
        price_paid: feature.price_paid,
        start_date:  null,
        end_date:  null,
      }));
    }
  }, [feature]);



  const handleChange = (e) => {
    setFeatureData({
      ...featureData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
        
      await updateShopFeature(subscription_id , feature.id, featureData);
      alert("Feature updated successfully!");
      onSuccess();
      onClose();
    } catch (error) {
        
      alert(error?.response?.data?.message|| "Failed to update feature");
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Update Feature</h2>

        <label className="text-sm">Paid Amount</label>
        <input
          type="number"
          name="price_paid"
          value={featureData.price_paid}
          onChange={handleChange}
          className="w-full border p-2 rounded-md mt-1 mb-3"
        />

        <label className="text-sm">Start Date & Time ({feature.start_date})</label>
        <input
          type="datetime-local"
          name="start_date"
          value={featureData.start_date}
          onChange={handleChange}
          className="w-full border p-2 rounded-md mt-1 mb-3"
        />

        <label className="text-sm">End Date & Time ({feature.end_date})</label>
        <input
          type="datetime-local"
          name="end_date"
          value={featureData.end_date}
          onChange={handleChange}
          className="w-full border p-2 rounded-md mt-1 mb-4"
        />


        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded-md">Close</button>
          <button onClick={handleSave} className="px-4 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700">Save</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateShopFeatureDetails;
