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

  // Default to current month range
  const { start, end } = getMonthRange(currentYear, currentMonth);

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState("daily");
  const [reportType, setReportType] = useState("both");
  const [startDate, setStartDate] = useState(start);
  const [endDate, setEndDate] = useState(end);

  // Selections
  const [selectedMonth, setSelectedMonth] = useState(
    `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`
  );
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [startYear, setStartYear] = useState(currentYear - 1);
  const [endYear, setEndYear] = useState(currentYear);
  const [yearlyError, setYearlyError] = useState("");
  const [monthlyError, setMonthlyError] = useState("");

  // ---- VALIDATION HELPERS ----
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

  // ---- API CALL ----
  const fetchReport = async () => {
    // Prevent invalid fetch
    if ((period === "yearly" && yearlyError) || (period === "monthly" && monthlyError)) {
      console.warn("Validation failed, skipping fetch.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        shop_id: shop_id,
        report_type: reportType === "both" ? undefined : reportType,
        period,
        start_date: startDate,
        end_date: endDate,
      };

      const response = await getShopReport(payload);

      if (response.status === "success") {
        const result = response.data.results;
        const salesData = result.sales || [];
        const bookingData = result.bookings || [];

        const allPeriods = Array.from(
          new Set([
            ...salesData.map((i) => i.period),
            ...bookingData.map((i) => i.period),
          ])
        );

        const combinedData = allPeriods.map((p) => ({
          name: p,
          sales: salesData.find((s) => s.period === p)?.count || 0,
          bookings: bookingData.find((b) => b.period === p)?.count || 0,
        }));

        setChartData(combinedData);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---- HANDLERS ----
  const handleMonthChange = (e) => {
    const value = e.target.value;
    setSelectedMonth(value);
    const [year, month] = value.split("-");
    const { start, end } = getMonthRange(parseInt(year), parseInt(month) - 1);
    setStartDate(start);
    setEndDate(end);
  };

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year.toString());
    const error = validateMonthlyYear(year);
    setMonthlyError(error);

    if (!error) {
      const { start, end } = getYearRange(year);
      setStartDate(start);
      setEndDate(end);
    }
  };

  const handleYearlyRangeChange = (type, value) => {
    const numericValue = parseInt(value);
    if (type === "start") {
      setStartYear(numericValue);
      setStartDate(`${numericValue}-01-01`);
      setEndDate(`${endYear}-12-31`);
      const error = validateYearRange(numericValue, endYear);
      setYearlyError(error);
    } else {
      setEndYear(numericValue);
      setStartDate(`${startYear}-01-01`);
      setEndDate(`${numericValue}-12-31`);
      const error = validateYearRange(startYear, numericValue);
      setYearlyError(error);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [period, reportType, startDate, endDate]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      {/* Header and Filters */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Engagement Report
        </h2>

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
            onChange={(e) => {
              const newPeriod = e.target.value;
              setPeriod(newPeriod);
              setYearlyError("");
              setMonthlyError("");

              if (newPeriod === "monthly") {
                const { start, end } = getYearRange(currentYear);
                setSelectedYear(currentYear.toString());
                setStartDate(start);
                setEndDate(end);
              } else if (newPeriod === "yearly") {
                const s = currentYear - 1;
                const e = currentYear;
                setStartYear(s);
                setEndYear(e);
                setStartDate(`${s}-01-01`);
                setEndDate(`${e}-12-31`);
              } else {
                const { start, end } = getMonthRange(currentYear, currentMonth);
                setSelectedMonth(
                  `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`
                );
                setStartDate(start);
                setEndDate(end);
              }
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          {/* Month Picker for Daily/Weekly */}
          {(period === "daily" || period === "weekly") && (
            <input
              type="month"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}

          {/* Year Picker for Monthly */}
          {period === "monthly" && (
            <div className="flex flex-col gap-1">
              <input
                type="number"
                min="2020"
                max="2100"
                value={selectedYear}
                onChange={handleYearChange}
                className={`border ${
                  monthlyError ? "border-red-500" : "border-gray-300"
                } rounded-lg px-3 py-2 w-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
              {monthlyError && (
                <span className="text-red-500 text-xs">{monthlyError}</span>
              )}
            </div>
          )}

          {/* Year Interval for Yearly */}
          {period === "yearly" && (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="2020"
                  max="2100"
                  value={startYear}
                  onChange={(e) =>
                    handleYearlyRangeChange("start", e.target.value)
                  }
                  className={`border ${
                    yearlyError ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 w-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
                />
                <span className="text-gray-500 font-semibold">to</span>
                <input
                  type="number"
                  min="2020"
                  max="2100"
                  value={endYear}
                  onChange={(e) =>
                    handleYearlyRangeChange("end", e.target.value)
                  }
                  className={`border ${
                    yearlyError ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 w-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
                />
              </div>
              {yearlyError && (
                <span className="text-red-500 text-xs">{yearlyError}</span>
              )}
            </div>
          )}
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
