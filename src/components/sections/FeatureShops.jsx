import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Store, Calendar, CheckCircle, XCircle } from "lucide-react";
import DataTable from "../ui components/DataTable";
import { fetchShopsByFeature } from "../../api/AdminApis";

const FeatureShops = () => {
  const { featureId } = useParams();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [shops, setShops] = useState([]);
  const [summary, setSummary] = useState(null);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load shops using this feature
  const loadShops = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchShopsByFeature(featureId);
      setShops(data.results || []);
      setSummary(data.summary || null);
      setCount(data.count || 0);
      setNext(data.next);
      setPrevious(data.previous);
    } catch (err) {
      setError("Unable to load shops for this feature. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (featureId) {
      loadShops();
    }
  }, [featureId]);

  // Search filter
  const filteredShops = shops.filter((shop) =>
    [shop.shop_name, shop.shop_phone, shop.shop_email, shop.shop_place]
      .filter(Boolean)
      .some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const columns = [
    { header: "Shop ID", accessor: "shop_id" },
    { header: "Shop Name", accessor: "shop_name" },
    { header: "Phone", accessor: "shop_phone" },
    { 
      header: "Email", 
      accessor: "shop_email",
      cell: (row) => row.shop_email || "N/A"
    },
    { header: "Place", accessor: "shop_place" },
    {
      header: "Shop Status",
      accessor: "shop_is_active",
      cell: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
            row.shop_is_active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.shop_is_active ? (
            <>
              <CheckCircle size={14} /> Active
            </>
          ) : (
            <>
              <XCircle size={14} /> Inactive
            </>
          )}
        </span>
      ),
    },
    {
      header: "Feature Status",
      accessor: "feature_is_active",
      cell: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
            row.feature_is_active
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {row.feature_is_active ? (
            <>
              <CheckCircle size={14} /> Active
            </>
          ) : (
            <>
              <XCircle size={14} /> Expired
            </>
          )}
        </span>
      ),
    },
    {
      header: "Start Date",
      accessor: "feature_start_date",
      cell: (row) => new Date(row.feature_start_date).toLocaleDateString(),
    },
    {
      header: "End Date",
      accessor: "feature_end_date",
      cell: (row) => new Date(row.feature_end_date).toLocaleDateString(),
    },
    {
      header: "Subscription",
      accessor: "subscription_status",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.subscription_status === "ACTIVE"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {row.subscription_status}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/features")}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Shops Using Feature
            </h1>
            {summary && (
              <p className="text-sm text-gray-600 mt-1">
                {summary.feature_name} ({summary.feature_code})
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-800">
                  {summary.total_assignments}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Assignments</p>
                <p className="text-2xl font-bold text-green-600">
                  {summary.active_assignments}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive Assignments</p>
                <p className="text-2xl font-bold text-red-600">
                  {summary.inactive_assignments}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Feature Type</p>
                <p className="text-xl font-bold text-purple-600">
                  {summary.feature_type}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shops Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Shops List ({count})
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search shops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-blue-600">Loading shops...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No shops found using this feature.</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredShops}
            totalEntries={count}
            onNextPage={() => next && loadShops(next)}
            onPreviousPage={() => previous && loadShops(previous)}
            disableNext={!next}
            disablePrevious={!previous}
            rowClickPath="shops"
          />
        )}
      </div>
    </div>
  );
};

export default FeatureShops;
