import React, { useEffect, useState } from "react";
import DataTable from "../ui components/DataTable";
import { fetchIdleDaysReport } from "../../api/AdminApis";
import { useNavigate, useLocation } from "react-router-dom";

const IdleDaysReport = () => {
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 NO DEFAULT VALUES
  const [periodDays, setPeriodDays] = useState("");
  const [threshold, setThreshold] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const page = Number(queryParams.get("page") || 1);

  /* ---------------- FETCH DATA ---------------- */
  const fetchReport = async (pageNo = 1) => {
    setLoading(true);
    try {
      const res = await fetchIdleDaysReport({
        period_days: Number(periodDays),
        threshold: Number(threshold),
        page: pageNo,
      });

      const payload = res?.data?.data || {};

      setRows(payload.shops || []);
      setCount(res?.data?.count || 0);
      setNext(res?.data?.next);
      setPrevious(res?.data?.previous);
    } catch (err) {
      console.error("Idle days report error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ❌ REMOVED INITIAL AUTO FETCH */
  // useEffect(() => {
  //   fetchReport(page);
  // }, [page]);

  /* ---------------- APPLY FILTER ---------------- */
  const handleApplyFilter = () => {
    // ✅ VALIDATION
    if (!periodDays || !threshold) {
      alert("Both Period Days and Idle Threshold are required");
      return;
    }

    navigate(`?page=1`);
    fetchReport(1);
  };

  /* ---------------- TABLE COLUMNS ---------------- */
  const columns = [
    {
      header: "Shop",
      accessor: "name",
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <img
            src={
              row.img ||
              "https://ui-avatars.com/api/?name=NA&background=random&size=40&rounded=true"
            }
            alt={row.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <span className="font-medium text-gray-800">{row.name}</span>
        </div>
      ),
    },
    { header: "Place", accessor: "place" },
    { header: "Active Days", accessor: "active_days" },
    { header: "Idle Days", accessor: "idle_days" },
    { header: "Total Bookings", accessor: "total_bookings" },
    { header: "Total Sales", accessor: "total_sales" },
    {
      header: "Last Activity",
      accessor: "last_activity_date",
      cell: (row) =>
        row.last_activity_date
          ? new Date(row.last_activity_date).toLocaleDateString()
          : "N/A",
    },
    {
      header: "Subscription",
      accessor: "subscription_status",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.subscription_status === "ACTIVE"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.subscription_status}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Idle Days Report
      </h1>

      {/* FILTER FORM */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period Days *
            </label>
            <input
              type="number"
              min="1"
              value={periodDays}
              onChange={(e) => setPeriodDays(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Idle Threshold (Days) *
            </label>
            <input
              type="number"
              min="1"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-40"
            />
          </div>

          <button
            onClick={handleApplyFilter}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {loading ? (
          <p className="text-blue-600">Loading report...</p>
        ) : (
          <DataTable
            columns={columns}
            data={rows}
            totalEntries={count}
            onNextPage={() => {
              if (next) {
                const nextPage = new URL(next).searchParams.get("page");
                navigate(`?page=${nextPage}`);
                fetchReport(nextPage);
              }
            }}
            onPreviousPage={() => {
              if (previous) {
                const prevPage = new URL(previous).searchParams.get("page");
                navigate(`?page=${prevPage}`);
                fetchReport(prevPage);
              }
            }}
            disableNext={!next}
            disablePrevious={!previous}
            rowClickPath="shops"
          />
        )}
      </div>
    </div>
  );
};

export default IdleDaysReport;
