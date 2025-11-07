import React, { useMemo } from "react";

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

    // after today's date => not yet happened
    if (isCurrentMonth && dateToCheck > today) return "–";

    // before or equal today => Absent
    return "A";
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Attendance Sheet –{" "}
        {new Date(selectedYear, selectedMonth - 1).toLocaleString("default", { month: "long" })}{" "}
        {selectedYear}
      </h3>

      <table className="min-w-full border-collapse border border-gray-200 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Token</th>
            <th className="border p-2 text-left">Employee</th>
            {days.map((d) => (
              <th key={d} className="border p-2 text-center">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.tokenCode}>
              <td className="border p-2">{emp.tokenCode}</td>
              <td className="border p-2">{emp.name}</td>
              {days.map((day) => {
                const status = getStatus(emp, day);
                const color =
                  status === "P"
                    ? "text-green-600 font-semibold"
                    : status === "A"
                    ? "text-red-500 font-semibold"
                    : "text-gray-400";
                return (
                  <td key={day} className={`border p-2 text-center ${color}`}>
                    {status}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tabular;
