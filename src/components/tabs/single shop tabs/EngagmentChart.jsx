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

function EngagementChart({ shop_id }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState("monthly");
  const [reportType, setReportType] = useState("sales");
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");

  const fetchReport = async () => {
    setLoading(true);
    try {
      const payload = {
        shop_id: shop_id,
        report_type: reportType === "both" ? undefined : reportType, // let backend include both if not specified
        period: period,
        start_date: startDate,
        end_date: endDate,
      };

      const response = await getShopReport(payload);
      

      if (response.status === "success") {
        const result = response.data.results;

        const salesData = result.sales || [];
        const bookingData = result.bookings || [];

        // Merge all periods
        const allPeriods = Array.from(
          new Set([
            ...salesData.map((i) => i.period),
            ...bookingData.map((i) => i.period),
          ])
        );

        const combinedData = allPeriods.map((period) => ({
          name: period,
          sales: salesData.find((s) => s.period === period)?.count || 0,
          bookings: bookingData.find((b) => b.period === period)?.count || 0,
        }));

        setChartData(combinedData);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [period, reportType, startDate, endDate]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      {/* Header and Filters */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Engagement Report</h2>

        <div className="flex flex-wrap gap-3 items-center">
          {/* Report Type */}
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="sales">Sales</option>
            <option value="bookings">Bookings</option>
            <option value="both">Both</option>
          </select>

          {/* Period */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          {/* Date Range */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Chart Section */}
      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading Chart...</div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {(reportType === "sales" || reportType === "both") && (
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Sales"
              />
            )}
            {(reportType === "bookings" || reportType === "both") && (
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#10b981"
                strokeWidth={3}
                name="Bookings"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default EngagementChart;
