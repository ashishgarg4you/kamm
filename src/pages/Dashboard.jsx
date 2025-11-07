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

      // 🧩 Extract unique employees from attendance data
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
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header + Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Attendance Dashboard</h1>
        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border rounded-xl px-3 py-2 bg-white shadow-sm text-gray-700"
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
            className="border rounded-xl px-3 py-2 bg-white shadow-sm text-gray-700"
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
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
          >
            {loading ? "Loading..." : "Show"}
          </button>
        </div>
      </div>

      {/* Summary */}
      {showData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-2xl shadow text-center">
            <h2 className="text-lg font-semibold text-gray-600">Total Days</h2>
            <p className="text-3xl font-bold text-indigo-600">{summary.total}</p>
          </div>
          <div className="p-4 bg-white rounded-2xl shadow text-center">
            <h2 className="text-lg font-semibold text-gray-600">Present</h2>
            <p className="text-3xl font-bold text-green-600">{summary.present}</p>
          </div>
          <div className="p-4 bg-white rounded-2xl shadow text-center">
            <h2 className="text-lg font-semibold text-gray-600">Absent</h2>
            <p className="text-3xl font-bold text-red-500">{summary.absent}</p>
          </div>
        </div>
      )}

      {/* Table */}
      {showData && (
        <Tabular
          attendanceData={attendanceData}
          employees={employees}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      )}
    </div>
  );
};

export default Dashboard;
