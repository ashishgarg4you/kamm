import React, { useState } from "react";
import { toast } from "react-hot-toast";
import API from "../utils/api";
import Tabular from "./Tabular";

const Dashboard = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [summary, setSummary] = useState({ total: 0, present: 0, absent: 0 });
  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setShowData(true);

      const token = localStorage.getItem("token");
      const { data } = await API.get("/attendance", {
        headers: { Authorization: `Bearer ${token}` },
        params: { month: selectedMonth, year: selectedYear },
      });

      setAttendanceData(data);

      // 🧩 Extract unique employees
      const uniqueEmployees = [];
      const seen = new Set();

      data.forEach((rec) => {
        const tokenCode = rec.userId?.tokenCode;
        if (tokenCode && !seen.has(tokenCode)) {
          seen.add(tokenCode);
          uniqueEmployees.push({
            tokenCode,
            name: rec.userId?.name || "—",
          });
        }
      });

      setEmployees(uniqueEmployees);

      // ---- Calculate Summary ----
      const today = new Date();
      const isCurrentMonth =
        selectedMonth === today.getMonth() + 1 &&
        selectedYear === today.getFullYear();

      const totalDays = isCurrentMonth
        ? today.getDate()
        : new Date(selectedYear, selectedMonth, 0).getDate();

      const totalRecords = uniqueEmployees.length * totalDays;
      const presentCount = data.filter((a) => a.status === "Present").length;
      const absentCount = totalRecords - presentCount;

      setSummary({
        total: totalRecords,
        present: presentCount,
        absent: absentCount,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4 sm:p-8 md:p-10 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header + Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-4 border-b border-indigo-100">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-700 tracking-tight text-center sm:text-left">
            Attendance Dashboard
          </h1>

          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="border border-indigo-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none rounded-xl px-3 py-2 bg-white shadow-sm text-gray-700 transition-all duration-200 hover:border-indigo-400"
            >
              {months.map((month, i) => (
                <option key={i} value={i + 1}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border border-indigo-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none rounded-xl px-3 py-2 bg-white shadow-sm text-gray-700 transition-all duration-200 hover:border-indigo-400"
            >
              {[2024, 2025, 2026].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <button
              onClick={fetchAttendance}
              disabled={loading}
              className={`px-5 py-2.5 font-semibold rounded-xl shadow-md text-white transition-all duration-300 ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.03]"
              }`}
            >
              {loading ? "Loading..." : "Show"}
            </button>
          </div>
        </div>

        {/* Skeleton Summary while Loading */}
        {loading && showData && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8 animate-fadeIn">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 bg-white/70 backdrop-blur-md rounded-2xl border border-indigo-100 shadow-md text-center"
              >
                <div className="h-4 w-24 bg-indigo-100 rounded mx-auto mb-4 shimmer"></div>
                <div className="h-10 w-16 bg-indigo-200 rounded mx-auto shimmer"></div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Cards */}
        {!loading && showData && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8 animate-fadeIn">
            <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-indigo-100 shadow-md text-center hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <h2 className="text-lg font-medium text-gray-600">Total Days</h2>
              <p className="text-4xl font-bold text-indigo-600 mt-2">
                {summary.total}
              </p>
            </div>
            <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-green-100 shadow-md text-center hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <h2 className="text-lg font-medium text-gray-600">Present</h2>
              <p className="text-4xl font-bold text-green-600 mt-2">
                {summary.present}
              </p>
            </div>
            <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-red-100 shadow-md text-center hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <h2 className="text-lg font-medium text-gray-600">Absent</h2>
              <p className="text-4xl font-bold text-red-500 mt-2">
                {summary.absent}
              </p>
            </div>
          </div>
        )}

        {/* Attendance Table or Skeleton */}
        {showData && (
          <div className="mt-10 animate-fadeIn overflow-x-auto">
            {loading ? (
              <div className="p-6 border border-indigo-100 bg-white/60 rounded-2xl shadow-sm">
                <div className="h-5 w-1/4 bg-indigo-100 rounded mb-6 shimmer"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-5 bg-indigo-50 rounded shimmer"></div>
                  ))}
                </div>
              </div>
            ) : (
              <Tabular
                attendanceData={attendanceData}
                employees={employees}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
