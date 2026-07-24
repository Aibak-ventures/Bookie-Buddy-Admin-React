import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Plus,
} from 'lucide-react';
import DataTable from "../ui components/DataTable";
import { fetchOrganizations } from '../../api/AdminApis';
import CreateOrganizationModal from "../Modals/CreateOrganizationModal";

const OrganizationsList = () => {
  const navigate = useNavigate();
const location = useLocation();

const queryParams = new URLSearchParams(location.search);

const initialSearch = queryParams.get("search") || "";
const initialPage = Number(queryParams.get("page")) || 1;

const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  
  // Pagination States
  const [count, setCount] = useState(0);
const [next, setNext] = useState(null);
const [previous, setPrevious] = useState(null);

const [currentUrl, setCurrentUrl] = useState(
  `/api/v1/shop/admin/organizations/?page=${initialPage}&search=${initialSearch}`
);

 const refreshOrganizations = async () => {
  setLoading(true);
  setError(null);

  try {
    const response = await fetchOrganizations(currentUrl);

    console.log("Next:", response.next);
    console.log("Previous:", response.previous);

    setOrganizations(response.results || []);
    setCount(response.count || 0);
    setNext(response.next);
    setPrevious(response.previous);
  } catch (err) {
    console.error(err);
    setError("Failed to fetch organizations.");
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  refreshOrganizations();
}, [currentUrl]);


const columns = [
  {
    header: "Organization",
    accessor: "name",
    cell: (row) => (
      <div className="flex items-center space-x-3">
        {row.image ? (
          <img
            src={row.image}
            alt={row.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center font-semibold text-purple-700">
            {row.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-gray-500">
            Token: {row.public_token}
          </div>
        </div>
      </div>
    ),
  },

  {
    header: "Phone",
    accessor: "phone",
  },

  {
    header: "Email",
    accessor: "email",
  },

  {
    header: "Place",
    accessor: "place",
  },

  {
    header: "Branches",
    accessor: "shop_count",
    cell: (row) => (
      <span className="px-2 py-1 rounded bg-purple-100 text-purple-700">
        {row.shop_count}
      </span>
    ),
  },

  {
    header: "Status",
    accessor: "is_active",
    cell: (row) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
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
    header: "Action",
    accessor: "action",
    cell: (row) => (
      <button
        onClick={() => navigate(`/organizations/${row.id}`)}
        className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        View
      </button>
    ),
  },
];


  if (loading && organizations.length === 0) {
    return <div className="p-6 text-purple-600 font-medium">Loading organization list...</div>;
  }
  
  if (error) return <div className="p-6 text-red-500 font-medium">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Title/Action Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Organizations</h1>
            <p className="text-sm text-gray-500">Manage business groups, global profiles, and linked branch properties.</p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center justify-center bg-purple-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition shadow-sm self-start sm:self-auto"
          >
            <Plus size={18} className="mr-1.5" /> Create New Organization
          </button>
        </div>

        {/* Catalog Table Card Container */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="relative">
                    <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                    />

                    <input
                    type="text"
                    placeholder="Search organizations..."
                    value={searchTerm}
                    onChange={(e) => {
                            const value = e.target.value;

                            setSearchTerm(value);
                            navigate(`?page=1&search=${value}`);
                            setCurrentUrl(
                                `/api/v1/shop/admin/organizations/?page=1&search=${value}`
                            );
                            }}
                    className="pl-10 pr-4 py-2 border rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                </div>
                {loading ? (
                <p className="text-purple-600">Loading organizations...</p>
                ) : error ? (
                <p className="text-red-600">{error}</p>
                ) : (
                <DataTable
                    columns={columns}
                    data={organizations}
                    totalEntries={count}
                    onNextPage={() => {
                    if (next) {
                        const nextPage = new URL(next).searchParams.get("page");

                        navigate(`?page=${nextPage}&search=${searchTerm}`);

                        setCurrentUrl(
                        `/api/v1/shop/admin/organizations/?page=${nextPage}&search=${searchTerm}`
                        );
                    }
                    }}
                    onPreviousPage={() => {
                    console.log("Previous URL:", previous);

                    if (previous) {
                        const url = new URL(previous);

                        console.log("Search Params:", url.search);
                        console.log("Page:", url.searchParams.get("page"));
                        console.log("Search:", url.searchParams.get("search"));

                        const prevPage = url.searchParams.get("page") || "1";

                        navigate(`?page=${prevPage}&search=${searchTerm}`);

                        setCurrentUrl(
                        `/api/v1/shop/admin/organizations/?page=${prevPage}&search=${searchTerm}`
                        );
                    }
                    }}
                    disableNext={!next}
                    disablePrevious={!previous}
                    rowClickPath="organizations"
                />
                )}
          
        <CreateOrganizationModal
            isOpen={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onCreated={refreshOrganizations}
        />

      </div>
    </div>
    </div>

  );
};

export default OrganizationsList;