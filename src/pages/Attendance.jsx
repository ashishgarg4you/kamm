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

  if (loading) return <p style={{ padding: "20px" }}>Loading attendance...</p>;
  if (error) return <p style={{ color: "red", padding: "20px" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Attendance Records</h2>

      {records.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%" }}>
          <thead style={{ background: "#f8f9fa" }}>
            <tr>
              <th>User</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id}>
                <td>{r.userId?.name}</td>
                <td>{r.status}</td>
                <td>{new Date(r.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Attendance;
