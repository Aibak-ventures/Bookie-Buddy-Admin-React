import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import DataTable from "../ui components/DataTable";
import ConfirmationModal from "../Modals/ConfirmationModal";
import {
  fetchFeatures,
  addFeature,
  updateFeature,
  deleteFeature,
} from "../../api/AdminApis";
import AddFeatureModal from "../Modals/AddFeatureModal";
import FeatureDetailsModal from "../Modals/FeatureDetailsModal";

const Features = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [features, setFeatures] = useState([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(
    "/api/v3/subscriptions/admin/features/"
  );

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    featureId: null,
  });

  const [editingFeature, setEditingFeature] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingFeature, setViewingFeature] = useState(null);

  // Load Features
  const loadFeatures = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFeatures(currentUrl);
      console.log("result",data);
      
      setFeatures(data.results);
      setCount(data.count);
      setNext(data.next);
      setPrevious(data.previous);
    } catch (err) {
      setError("Unable to load features. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatures();
  }, [currentUrl]);

  // Add Feature
  const handleAddFeature = async (featureData) => {
    try {
      await addFeature(featureData);
      await loadFeatures();
      setIsAddModalOpen(false);
      alert("Feature added successfully");
    } catch (err) {
      console.error(err);
      alert(`Failed ${err}`);

    }
  };

  // Update Feature
  const handleUpdateFeature = async (featureData) => {
    try {
      await updateFeature(featureData.id, featureData);
      alert("Feature updated successfully");
      setIsAddModalOpen(false);
      setEditingFeature(null);
      await loadFeatures();
    } catch (err) {
      console.error(err);
      alert("Failed to update feature");
    }
  };

  // Delete Feature
  const handleDeleteFeature = async (id) => {
    try {
      await deleteFeature(id);
      alert("Feature deleted successfully");
      setDeleteModal({ isOpen: false, featureId: null });
      await loadFeatures();
    } catch (err) {
      alert(`Failed :${err?.response?.data?.error}`);
    }
  };

  // Search
  const filteredFeatures = features.filter((feature) =>
    [feature.name, feature.description, feature.code]
      .filter(Boolean)
      .some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const columns = [
  { header: "ID", accessor: "id" },
  { header: "Name", accessor: "name" },
  { header: "Code", accessor: "code" },
  { header: "Base Price", accessor: "base_price" },




  // Active / Inactive
  {
    header: "Status",
    accessor: "is_active",
    cell: (row) => (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          row.is_active
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {row.is_active ? "Active" : "Inactive"}
      </span>
    ),
  },



  // Actions
  {
  header: "Actions",
  accessor: "action",
  cell: (row) => (
    <div className="flex items-center gap-2">
      {/* View More */}
      <button
        className="px-3 py-1 rounded text-sm font-medium bg-gray-500 text-white hover:bg-gray-600"
        onClick={(e) => {
          e.stopPropagation();
          setViewingFeature(row);
        }}
      >
        View More
      </button>

      {/* Edit */}
      <button
        className="px-3 py-1 rounded text-sm font-medium bg-blue-500 text-white hover:bg-blue-600"
        onClick={(e) => {
          e.stopPropagation();
          setEditingFeature(row);
          setIsAddModalOpen(true);
        }}
      >
        Update
      </button>

      {/* Delete */}
      <button
        className="px-3 py-1 rounded text-sm font-medium bg-red-500 text-white hover:bg-red-600"
        onClick={(e) => {
          e.stopPropagation();
          setDeleteModal({ isOpen: true, featureId: row.id });
        }}
      >
        Delete
      </button>
    </div>
  ),
},
];


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Features</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} />
          Add Feature
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search feature..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-blue-600">Loading features...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <DataTable
            columns={columns}
            data={filteredFeatures}
            totalEntries={count}
            onNextPage={() => setCurrentUrl(next)}
            onPreviousPage={() => setCurrentUrl(previous)}
            disableNext={!next}
            disablePrevious={!previous}
            rowClickPath="features"
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, featureId: null })}
        onConfirm={() => handleDeleteFeature(deleteModal.featureId)}
        message="Are you sure you want to delete this feature?"
      />

      {/* Add / Update Modal */}
      <AddFeatureModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingFeature(null);
        }}
        onAdd={handleAddFeature}
        onUpdate={handleUpdateFeature}
        featureData={editingFeature}
      />
    {/* /show  details */}
      <FeatureDetailsModal
        isOpen={!!viewingFeature}
        onClose={() => setViewingFeature(null)}
        feature={viewingFeature}
        />
    </div>
  );
};

export default Features;

