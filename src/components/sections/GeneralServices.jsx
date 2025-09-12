import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import DataTable from "../ui components/DataTable";
import ConfirmationModal from "../Modals/ConfirmationModal";
import {
  addGeneralService,
  fetchGeneralServices,
  toggleGeneralServiceStatus,
  updateGeneralService,
  deleteGeneralService,
} from "../../api/AdminApis";
import AddGeneralServiceModal from "../Modals/AddGeneralServiceModal";

const GeneralServices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(
    "/api/v1/service/admin/general-services/"
  );

  const [modalState, setModalState] = useState({
    isOpen: false,
    serviceId: null,
    isActive: null,
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    serviceId: null,
  });

  const [editingService, setEditingService] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load services
  const loadServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGeneralServices(currentUrl);
      console.log("data",data);
      
      setServices(data.results);
      setCount(data.count);
      setNext(data.next);
      setPrevious(data.previous);
    } catch (err) {
      setError("Unable to load general services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, [currentUrl]);

  // Add service
  const handleAddService = async (serviceData) => {
    
    try {
      await addGeneralService(serviceData);
      await loadServices();
      setIsAddModalOpen(false);
      alert("General service added successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to add general service");
    }
  };

  // Update service
  const handleUpdateService = async (serviceData) => {
    try {
      await updateGeneralService(serviceData.id, serviceData);
      alert("General service updated successfully");
      setIsAddModalOpen(false);
      setEditingService(null);
      await loadServices();
    } catch (err) {
      console.error(err);
      alert("Failed to update general service");
    }
  };

  // Delete service
  const handleDeleteService = async (id) => {
    try {
      await deleteGeneralService(id);
      alert("General service deleted successfully");
      setDeleteModal({ isOpen: false, serviceId: null });
      await loadServices();
    } catch (err) {
      console.error(err);
      alert("Failed to delete general service");
    }
  };

  // Toggle status
  const handleToggleStatus = async (id, isActive) => {
    try {
      await toggleGeneralServiceStatus(id, !isActive);
      setServices((prev) =>
        prev.map((service) =>
          service.id === id ? { ...service, is_active: !isActive } : service
        )
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filteredServices = services.filter((service) =>
    [service.name, service.description]
      .filter(Boolean)
      .some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const columns = [
    {
      header: "Service Name",
      accessor: "name",
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <img
            src={
              row.icon ||
              "https://ui-avatars.com/api/?name=NA&background=random&size=40&rounded=true"
            }
            alt={row.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <span className="font-medium text-gray-800">{row.name}</span>
        </div>
      ),
    },
    { header: "Description", accessor: "description" },
    { header: "Main service", accessor: "main_category_name" },

    {
      header: "Created At",
      accessor: "created_at",
      cell: (row) => (
        <span className="text-sm text-gray-500">{row.created_at}</span>
      ),
    },
    
    {
      header: "Action",
      accessor: "action",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {/* Activate / Deactivate */}
          <button
            className={`px-3 py-1 rounded text-sm font-medium ${
              row.is_active
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setModalState({
                isOpen: true,
                serviceId: row.id,
                isActive: row.is_active,
              });
            }}
          >
            {row.is_active ? "Deactivate" : "Activate"}
          </button>

          {/* Edit / Update */}
          <button
            className="px-3 py-1 rounded text-sm font-medium bg-blue-500 text-white hover:bg-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              setEditingService(row);
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
              setDeleteModal({ isOpen: true, serviceId: row.id });
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
        <h1 className="text-3xl font-bold text-gray-800">General Services</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} />
          Add General service
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-blue-600">Loading general services...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <DataTable
            columns={columns}
            data={filteredServices}
            totalEntries={count}
            onNextPage={() => setCurrentUrl(next)}
            onPreviousPage={() => setCurrentUrl(previous)}
            disableNext={!next}
            disablePrevious={!previous}
            rowClickPath="general-services"
          />
        )}
      </div>

      {/* Activate / Deactivate Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onConfirm={() =>
          handleToggleStatus(modalState.serviceId, modalState.isActive)
        }
        message={`Are you sure you want to ${
          modalState.isActive ? "deactivate" : "activate"
        } this service?`}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, serviceId: null })}
        onConfirm={() => handleDeleteService(deleteModal.serviceId)}
        message="Are you sure you want to delete this service?"
      />

      {/* Add / Update Modal */}
      <AddGeneralServiceModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingService(null);
        }}
        onAdd={handleAddService}
        onUpdate={handleUpdateService}
        serviceData={editingService}
      />
    </div>
  );
};

export default GeneralServices;
