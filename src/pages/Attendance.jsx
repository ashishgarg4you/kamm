import { useEffect, useState } from "react";
import API from "../utils/api";

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/attendance");
        setRecords(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch attendance");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white px-3 sm:px-6 lg:px-10 py-6 transition-all duration-300 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-6 tracking-tight border-b border-indigo-100 pb-3">
          Attendance Records
        </h2>

        {/* Loading / Error States */}
        {loading && (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500 animate-pulse">
              Loading attendance...
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-6 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error}
          </div>
        )}

        {/* No Records */}
        {!loading && !error && records.length === 0 && (
          <div className="text-center py-12 bg-white/70 backdrop-blur-md border border-indigo-100 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-lg">No attendance records found.</p>
          </div>
        )}

        {/* Table View */}
        {!loading && !error && records.length > 0 && (
          <div className="w-full mt-6 overflow-hidden">
            <div className="relative overflow-x-auto max-w-full border border-indigo-100 rounded-2xl shadow-md bg-white/80 backdrop-blur-md">
              <table className="min-w-max w-full text-sm text-left text-gray-700 border-collapse">
                <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 font-semibold uppercase tracking-wide whitespace-nowrap">
                      User
                    </th>
                    <th className="px-3 sm:px-6 py-3 font-semibold uppercase tracking-wide whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-3 font-semibold uppercase tracking-wide whitespace-nowrap">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-50">
                  {records.map((r) => (
                    <tr
                      key={r._id}
                      className="hover:bg-indigo-50 transition-all duration-200"
                    >
                      <td className="px-3 sm:px-6 py-3 text-gray-700 font-medium break-words max-w-[160px]">
                        {r.userId?.name || "—"}
                      </td>
                      <td
                        className={`px-3 sm:px-6 py-3 font-semibold whitespace-nowrap ${
                          r.status === "Present"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {r.status}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-gray-600">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="truncate max-w-[120px] sm:max-w-none">
                            {new Date(r.date).toLocaleDateString()}
                          </span>
                          <span className="text-gray-400 text-xs sm:text-sm whitespace-nowrap">
                            {new Date(r.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Scroll Hint */}
            <p className="text-center text-gray-400 text-xs mt-2 sm:hidden">
              ← Swipe left/right to view →
            </p>
          </div>
        )}

        {/* ✅ Compact Card View for ultra-small screens */}
        {!loading && !error && records.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:hidden mt-8">
            {records.map((r) => (
              <div
                key={r._id}
                className="p-4 border border-indigo-100 rounded-2xl bg-white/80 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <h4 className="font-semibold text-indigo-700">
                  {r.userId?.name || "—"}
                </h4>
                <p
                  className={`mt-1 font-semibold ${
                    r.status === "Present"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {r.status}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(r.date).toLocaleDateString()}{" "}
                  <span className="text-gray-400">
                    {new Date(r.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
