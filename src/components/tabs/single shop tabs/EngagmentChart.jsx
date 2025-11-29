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

// Helper functions
const getMonthRange = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  return {
    start: firstDay.toISOString().split("T")[0],
    end: lastDay.toISOString().split("T")[0],
  };
};

const getYearRange = (year) => ({
  start: `${year}-01-01`,
  end: `${year}-12-31`,
});

function EngagementChart({ shop_id }) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const { start, end } = getMonthRange(currentYear, currentMonth);

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState("monthly");
  const [reportType, setReportType] = useState("all");
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);

  // ✅ FIX ADDED HERE
  const [endYear, setEndYear] = useState(currentYear);

  const [selectedMonth, setSelectedMonth] = useState(
    `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`
  );
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [monthlyError, setMonthlyError] = useState("");
  const [yearlyError, setYearlyError] = useState("");

  const validateYearRange = (start, end) => {
    if (start < 2020) return "Start year cannot be less than 2020.";
    if (end > 2100) return "End year cannot be greater than 2100.";
    if (parseInt(start) > parseInt(end))
      return "Start year must be less than or equal to end year.";
    return "";
  };

  const validateMonthlyYear = (year) => {
    if (year < 2020) return "Year must be greater than or equal to 2020.";
    if (year > 2100) return "Year must be less than or equal to 2100.";
    return "";
  };

  const fetchReport = async () => {
    if ((period === "yearly" && yearlyError) || (period === "monthly" && monthlyError)) {
      console.warn("Validation failed, skipping fetch");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        shop_id: shop_id,
        report_type: reportType === "all" ? undefined : reportType,
        period,
        start_date: startDate,
        end_date: endDate,
      };

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

        const combined = allPeriods.map((p) => ({
          name: p,
          sales: salesData.find((s) => s.period === p)?.count || 0,
          bookings: bookingData.find((b) => b.period === p)?.count || 0,
          tailor_orders: tailorData.find((t) => t.period === p)?.count || 0,
        }));

        setChartData(combined);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [shop_id, period, reportType, startDate, endYear]);

  const handleMonthChange = (e) => {
    const value = e.target.value;
    setSelectedMonth(value);
    const [year, month] = value.split("-");
    const { start, end } = getMonthRange(parseInt(year), parseInt(month) - 1);
    setStartDate(start);
    setEndDate(end);
  };

  const handleYearChange = (e) => {
    const y = parseInt(e.target.value);
    setSelectedYear(y.toString());
    const err = validateMonthlyYear(y);
    setMonthlyError(err);

    if (!err) {
      const { start, end } = getYearRange(y);
      setStartDate(start);
      setEndDate(end);
    }
  };

  const handleYearlyRangeChange = (type, value) => {
    const v = parseInt(value);
    if (type === "start") {
      setStartDate(`${v}-01-01`);
    } else {
      setEndYear(v);
      setEndDate(`${v}-12-31`);
    }
    const err = validateYearRange(parseInt(selectedYear), v);
    setYearlyError(err);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Engagement Report</h2>

        <div className="flex flex-wrap gap-3">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="sales">Sales</option>
            <option value="bookings">Bookings</option>
            <option value="tailor_orders">Tailor Orders</option>
            <option value="all">All</option>
          </select>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          {(period === "daily" || period === "weekly") && (
            <input
              type="month"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          )}

          {period === "monthly" && (
            <div className="flex flex-col">
              <input
                type="number"
                value={selectedYear}
                onChange={handleYearChange}
                className={`border ${monthlyError ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 w-24 text-sm`}
              />
              {monthlyError && <span className="text-red-500 text-xs">{monthlyError}</span>}
            </div>
          )}

          {period === "yearly" && (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={selectedYear}
                  onChange={(e) => handleYearlyRangeChange("start", e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-24 text-sm"
                />
                <span className="text-gray-600 font-semibold">to</span>
                <input
                  type="number"
                  value={endYear}
                  onChange={(e) => handleYearlyRangeChange("end", e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-24 text-sm"
                />
              </div>
              {yearlyError && <span className="text-red-500 text-xs">{yearlyError}</span>}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading chart...</div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />

           <Line type="monotone" dataKey="sales" strokeWidth={3} name="Sales" stroke="#3b82f6" />
          <Line type="monotone" dataKey="bookings" strokeWidth={3} name="Bookings" stroke="#10b981" />
          <Line type="monotone" dataKey="tailor_orders" strokeWidth={3} name="Tailor Orders" stroke="#8b5cf6" />

          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default EngagementChart;
