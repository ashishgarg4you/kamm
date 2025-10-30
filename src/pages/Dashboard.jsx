import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import API from "../utils/api";
import { Spinner, Alert, Container, Card } from "react-bootstrap";

export default function Dashboard() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ Always include auth token
        const token = localStorage.getItem("token");
        const { data } = await API.get("/attendance", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Group attendance by user
        const grouped = data.reduce((acc, a) => {
          const name = a.userId?.name || "Unknown";
          acc[name] = (acc[name] || 0) + 1;
          return acc;
        }, {});

        setChartData(
          Object.entries(grouped).map(([name, count]) => ({ name, count }))
        );
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setError(err.response?.data?.message || "Failed to fetch attendance data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔹 Loading state
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Loading attendance data...</p>
      </Container>
    );
  }

  // 🔹 Error state
  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  // 🔹 Empty data state
  if (chartData.length === 0) {
    return (
      <Container className="mt-5">
        <Card className="p-4 text-center shadow">
          <Alert variant="info">No attendance data available.</Alert>
        </Card>
      </Container>
    );
  }

  // ✅ Success: render chart
  return (
    <Container className="mt-5">
      <Card className="p-4 shadow">
        <h3 className="mb-4 text-center">Attendance Overview</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#007bff" barSize={40} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Container>
  );
}
