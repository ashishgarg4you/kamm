import { useState } from "react";
import API from "../utils/api";
import { toast } from "react-toastify";

export default function MarkAttendance() {
  const [tokenCode, setTokenCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMark = async () => {
    if (!tokenCode.trim()) return toast.warning("Enter your token code!");
    try {
      setLoading(true);
      await API.post("/attendance/mark", { tokenCode });
      toast.success("Attendance marked successfully!");
      setTokenCode("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid token code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center mt-5">
      <h3>Mark Attendance</h3>
      <div className="mt-3">
        <input
          type="text"
          placeholder="Enter your token code"
          value={tokenCode}
          onChange={(e) => setTokenCode(e.target.value)}
          className="form-control w-50 mx-auto"
        />
        <button
          onClick={handleMark}
          disabled={loading}
          className="btn btn-primary mt-3"
        >
          {loading ? "Marking..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
