import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import DataTable from "../ui components/DataTable";
import ConfirmationModal from "../Modals/ConfirmationModal";
import {
  fetchSubscriptions,
  addSubscription,
  updateSubscription,
  deleteSubscription,
} from "../../api/AdminApis";
import AddSubscriptionModal from "../Modals/AddSubscriptionModal";
import SubscriptionDetailsModal from "../Modals/SubscriptionDetailsModal";

const Subscriptions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(
    "/api/v3/subscriptions/admin/subscription-plans/"
  );

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    subscriptionId: null,
  });

  const [editingSubscription, setEditingSubscription] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingSubscription, setViewingSubscription] = useState(null);

  // Load Subscriptions
  const loadSubscriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSubscriptions(currentUrl);
      setSubscriptions(data.results);
      setCount(data.count);
      setNext(data.next);
      setPrevious(data.previous);
    } catch (err) {
      setError("Unable to load subscriptions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, [currentUrl]);

  // Add Subscription
  const handleAddSubscription = async (subscriptionData) => {
    try {
      await addSubscription(subscriptionData);
      await loadSubscriptions();
      setIsAddModalOpen(false);
      alert("Subscription plan added successfully");
    } catch (err) {
      alert(`Failed :${err?.response?.data?.error}`)

    }
  };

  // Update Subscription
  const handleUpdateSubscription = async (subscriptionData) => {
    try {
      await updateSubscription(subscriptionData.id, subscriptionData);
      alert("Subscription plan updated successfully");
      setIsAddModalOpen(false);
      setEditingSubscription(null);
      await loadSubscriptions();
    } catch (err) {
        alert(`Failed :${err?.response?.data?.error}`)

    }
  };

  // Delete Subscription
  const handleDeleteSubscription = async (id) => {
    try {
      await deleteSubscription(id);
      alert("Subscription plan deleted successfully");
      setDeleteModal({ isOpen: false, subscriptionId: null });
      await loadSubscriptions();
    } catch (err) {
      alert(`Failed :${err?.response?.data?.error}`)

    }
  };

  // Search
  const filteredSubscriptions = subscriptions.filter((sub) =>
    [sub.name, sub.description, sub.plan_type]
      .filter(Boolean)
      .some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Type", accessor: "plan_type" },
    { header: "Base Price", accessor: "base_price" },
    { header: "Max Users", accessor: "max_users" },
    { header: "Max Products", accessor: "max_products" },

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

    {
      header: "Actions",
      accessor: "action",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded text-sm font-medium bg-gray-500 text-white hover:bg-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              setViewingSubscription(row);
            }}
          >
            View More
          </button>

          <button
            className="px-3 py-1 rounded text-sm font-medium bg-blue-500 text-white hover:bg-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              setEditingSubscription(row);
              setIsAddModalOpen(true);
            }}
          >
            Update
          </button>

          <button
            className="px-3 py-1 rounded text-sm font-medium bg-red-500 text-white hover:bg-red-600"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({ isOpen: true, subscriptionId: row.id });
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
        <h1 className="text-3xl font-bold text-gray-800">Subscriptions</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} />
          Add Subscription
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search subscription..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-blue-600">Loading subscriptions...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <DataTable
            columns={columns}
            data={filteredSubscriptions}
            totalEntries={count}
            onNextPage={() => setCurrentUrl(next)}
            onPreviousPage={() => setCurrentUrl(previous)}
            disableNext={!next}
            disablePrevious={!previous}
            rowClickPath="subscriptions"
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, subscriptionId: null })}
        onConfirm={() => handleDeleteSubscription(deleteModal.subscriptionId)}
        message="Are you sure you want to delete this subscription plan?"
      />

      <AddSubscriptionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingSubscription(null);
        }}
        onAdd={handleAddSubscription}
        onUpdate={handleUpdateSubscription}
        subscriptionData={editingSubscription}
      />

      <SubscriptionDetailsModal
        isOpen={!!viewingSubscription}
        onClose={() => setViewingSubscription(null)}
        subscription={viewingSubscription}
      />
    </div>
  );
};

export default Subscriptions;
