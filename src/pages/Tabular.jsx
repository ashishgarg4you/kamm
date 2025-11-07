import React, { useMemo } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Tabular = ({ attendanceData = [], employees = [], selectedMonth, selectedYear }) => {
  const today = new Date();
  const isCurrentMonth =
    selectedMonth === today.getMonth() + 1 && selectedYear === today.getFullYear();
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

  const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  const getStatus = (emp, day) => {
    const dateToCheck = new Date(selectedYear, selectedMonth - 1, day);

    const record = attendanceData.find(
      (a) =>
        a.userId?.tokenCode === emp.tokenCode &&
        new Date(a.date).toDateString() === dateToCheck.toDateString()
    );

    if (record && record.status === "Present") return "P";
    if (isCurrentMonth && dateToCheck > today) return "–";
    return "A";
  };

  // 🧾 Format attendance data into a 2D array for export
  const formatDataForExport = () => {
    const header = ["Token", "Employee", ...days.map((d) => `${d}`)];
    const rows = employees.map((emp) => {
      const row = [emp.tokenCode, emp.name];
      days.forEach((day) => row.push(getStatus(emp, day)));
      return row;
    });
    return [header, ...rows];
  };

  // 📤 Export CSV
  const handleDownloadCSV = () => {
    const csvData = formatDataForExport();
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const fileName = `attendance_${selectedMonth}_${selectedYear}.csv`;
    saveAs(blob, fileName);
  };

  // 📊 Export Excel
  const handleDownloadXLSX = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(formatDataForExport());
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    const fileName = `attendance_${selectedMonth}_${selectedYear}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="w-full mt-8">
      <div className="bg-white/80 backdrop-blur-md border border-indigo-100 rounded-2xl shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5 border-b border-indigo-100 pb-3">
          <h3 className="text-lg sm:text-xl font-bold text-indigo-700 tracking-tight">
            Attendance Sheet —{" "}
            {new Date(selectedYear, selectedMonth - 1).toLocaleString("default", {
              month: "long",
            })}{" "}
            {selectedYear}
          </h3>

          {/* Export Buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg font-medium shadow hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200"
            >
              ⬇️ CSV
            </button>
            <button
              onClick={handleDownloadXLSX}
              className="px-4 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium shadow hover:from-green-600 hover:to-green-700 transition-all duration-200"
            >
              📘 Excel
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="relative overflow-x-auto overflow-y-hidden rounded-xl border border-indigo-100 shadow-inner scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-indigo-50">
          <table className="min-w-max text-sm md:text-[15px] text-gray-700 border-collapse">
            <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white sticky top-0 z-20">
              <tr>
                <th className="sticky left-0 z-30 bg-indigo-700/95 backdrop-blur-sm border-r border-indigo-500 py-3 px-3 sm:px-4 text-left font-semibold whitespace-nowrap">
                  Token
                </th>
                <th className="sticky left-[85px] sm:left-[120px] z-30 bg-indigo-700/95 backdrop-blur-sm border-r border-indigo-500 py-3 px-3 sm:px-4 text-left font-semibold whitespace-nowrap">
                  Employee
                </th>
                {days.map((d) => (
                  <th
                    key={d}
                    className="py-3 px-2 text-center font-semibold border-r border-indigo-500 min-w-[35px]"
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-indigo-50 bg-white/90">
              {employees.length === 0 ? (
                <tr>
                  <td
                    colSpan={days.length + 2}
                    className="text-center text-gray-500 py-6"
                  >
                    No employee data found.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr
                    key={emp.tokenCode}
                    className="hover:bg-indigo-50/70 transition-all duration-200"
                  >
                    <td className="sticky left-0 bg-white border-r border-indigo-100 px-3 sm:px-4 py-2 font-semibold text-indigo-600 whitespace-nowrap z-10">
                      {emp.tokenCode}
                    </td>
                    <td className="sticky left-[85px] sm:left-[120px] bg-white border-r border-indigo-100 px-3 sm:px-4 py-2 whitespace-nowrap z-10">
                      {emp.name}
                    </td>

                    {days.map((day) => {
                      const status = getStatus(emp, day);
                      const color =
                        status === "P"
                          ? "text-green-600 font-semibold"
                          : status === "A"
                          ? "text-red-500 font-semibold"
                          : "text-gray-400";
                      return (
                        <td
                          key={day}
                          className={`text-center py-2 px-2 border-r border-indigo-50 ${color}`}
                        >
                          {status}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Scroll hint */}
        <p className="text-center text-gray-400 text-xs mt-3 sm:hidden">
          ← Swipe left/right to view →
        </p>
      </div>
    </div>
  );
};

export default Tabular;
