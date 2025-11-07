import { useState } from "react";
import API from "../utils/api";
import { toast } from "react-toastify";

const EmployeeMark = () => {
  const [tokenCode, setTokenCode] = useState("");
  const [status, setStatus] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // ✅ Mark attendance by token code
  const handleMark = async () => {
    if (!tokenCode.trim()) return toast.error("Enter your token code");

    try {
      setLoading(true);
      const { data } = await API.post("/attendance/mark-by-token", { tokenCode });
      setStatus(`✅ ${data.message}`);
      toast.success(data.message);
      setTokenCode("");
      fetchAttendanceHistory(tokenCode); // Refresh history after marking
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to mark attendance";
      toast.error(msg);
      setStatus(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch last 5 days attendance
  const fetchAttendanceHistory = async (code) => {
    try {
      setFetching(true);
      const { data } = await API.get(`/attendance/history/${code}`);
      setHistory(data);
    } catch {
      setHistory([]);
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-50 p-4 sm:p-8">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl border border-indigo-100 shadow-lg p-6 sm:p-8 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-indigo-700 mb-6 tracking-tight">
          Employee Attendance
        </h2>

        {/* Token Input */}
        <div className="space-y-3">
          <label className="block text-gray-700 font-medium">Enter Token Code</label>
          <input
            type="text"
            value={tokenCode}
            onChange={(e) => setTokenCode(e.target.value)}
            placeholder="e.g. EMP1234"
            disabled={loading}
            className="w-full border border-indigo-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-700 placeholder-gray-400"
          />
          <button
            onClick={handleMark}
            disabled={loading}
            className={`w-full mt-3 py-2.5 rounded-xl text-white font-semibold shadow-md transition-all duration-300 ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 hover:scale-[1.02]"
            }`}
          >
            {loading ? "Marking..." : "Mark Attendance"}
          </button>
        </div>

        {/* Status message */}
        {status && (
          <div
            className={`mt-4 text-center font-semibold ${
              status.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {status}
          </div>
        )}

        {/* Attendance History */}
        {history.length > 0 && (
          <div className="mt-8 animate-fadeIn">
            <h4 className="text-lg font-semibold text-gray-700 text-center mb-3 border-b border-indigo-100 pb-1">
              Last 5 Days
            </h4>

            {fetching ? (
              <div className="p-4 border border-indigo-100 bg-white/70 rounded-2xl shadow-sm space-y-3">
                <div className="h-4 w-1/3 bg-indigo-100 rounded shimmer"></div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-4 w-full bg-indigo-50 rounded shimmer"></div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-indigo-100 rounded-xl overflow-hidden shadow-sm">
                  <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm uppercase">
                    <tr>
                      <th className="py-2 px-4 text-left">Date</th>
                      <th className="py-2 px-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-50 bg-white/80 backdrop-blur-sm">
                    {history.map((h, i) => (
                      <tr
                        key={i}
                        className="hover:bg-indigo-50 transition-all duration-200"
                      >
                        <td className="py-2 px-4 text-gray-700 whitespace-nowrap">
                          {new Date(h.date).toLocaleDateString()}
                        </td>
                        <td
                          className={`py-2 px-4 font-semibold ${
                            h.status === "Present"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {h.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeMark;
