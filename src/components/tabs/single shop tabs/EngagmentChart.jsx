import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getShopReport } from "../../../api/AdminApis";

function EngagementChart({ shop_id = 7 }) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // Get current month range (1st → last day)
  const getCurrentMonthRange = () => {
    const first = new Date(currentYear, currentMonth, 1);
    const last = new Date(currentYear, currentMonth + 1, 0);

    return {
      start: first.toISOString().split("T")[0],
      end: last.toISOString().split("T")[0],
    };
  };

  const getLastSixMonthsRange = () => {
    const today = new Date();
  
    // Start = first day of month, 5 months ago
    const start = new Date(today.getFullYear(), today.getMonth() - 5, 1);
  
    // End = last day of current month
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    };
  };

  const { start: defaultMonthStart, end: defaultMonthEnd } = getCurrentMonthRange();

  // Default → Monthly: full year
  const [reportType, setReportType] = useState("all");

  const { start: defaultStart, end: defaultEnd } = getLastSixMonthsRange();

const [period, setPeriod] = useState("monthly");
const [startDate, setStartDate] = useState(defaultStart);
const [endDate, setEndDate] = useState(defaultEnd);


  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------------------------------------------------
  // AUTO UPDATE DATE RANGE BASED ON PERIOD
  // ---------------------------------------------------------
  useEffect(() => {
    if (period === "daily" || period === "weekly") {
      setStartDate(defaultMonthStart);
      setEndDate(defaultMonthEnd);
    }
  
    if (period === "monthly") {
      const { start, end } = getLastSixMonthsRange();
      setStartDate(start);
      setEndDate(end);
    }
  
    if (period === "yearly") {
      setStartDate(`${currentYear}-01-01`);
      setEndDate(`${currentYear}-12-31`);
    }
  }, [period]);
  

  // ---------------------------------------------------------
  // DATE VALIDATION → startDate must NOT exceed endDate
  // ---------------------------------------------------------
  useEffect(() => {
    if (startDate > endDate) {
      alert("Start date cannot be greater than End date. Auto-correcting...");
      setEndDate(startDate);
    }
  }, [startDate, endDate]);

  // ---------------------------------------------------------
  // FETCH REPORT
  // ---------------------------------------------------------
  const fetchReport = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);

    try {
      const payload = {
        shop_id:shop_id,
        period,
        start_date: startDate,
        end_date: endDate,
        report_type: reportType === "all" ? undefined : reportType,
      };

      console.log("Payload:", payload);

      const response = await getShopReport(payload);

      if (response.status === "success") {
        const result = response.data.results;

        const salesData = result.sales || [];
        const bookingData = result.bookings || [];
        const tailorData = result.tailor_orders || [];

        const allPeriods = Array.from(
          new Set([
            ...salesData.map((i) => i.period),
            ...bookingData.map((i) => i.period),
            ...tailorData.map((i) => i.period),
          ])
        );

        const formatted = allPeriods.map((p) => ({
          name: p,
          sales: salesData.find((s) => s.period === p)?.count || 0,
          bookings: bookingData.find((b) => b.period === p)?.count || 0,
          tailor_orders: tailorData.find((t) => t.period === p)?.count || 0,
        }));

        setChartData(formatted);
      }
    } catch (err) {
      console.error("Fetch error →", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [period, reportType, startDate, endDate]);

  // ---------------------------------------------------------
  // RENDER UI
  // ---------------------------------------------------------
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex flex-wrap justify-between mb-6">
        <h2 className="text-xl font-semibold">Engagement Report</h2>

        <div className="flex flex-wrap gap-3">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="sales">Sales</option>
            <option value="bookings">Bookings</option>
            <option value="tailor_orders">Tailor Orders</option>
          </select>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading chart…</div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} />
            <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={3} />
            <Line type="monotone" dataKey="tailor_orders" stroke="#8b5cf6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default EngagementChart;
