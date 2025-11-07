// src/components/EmployeeMark.jsx
import { useState } from "react";
import API from "../utils/api";
import { toast } from "react-toastify";
import { Card, Button, Form, Container, Table, Spinner } from "react-bootstrap";

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
    <Container
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <Card className="p-4 shadow-lg" style={{ width: "400px" }}>
        <h3 className="text-center mb-4">Employee Attendance</h3>

        <Form>
          <Form.Group>
            <Form.Label>Enter Token Code</Form.Label>
            <Form.Control
              type="text"
              value={tokenCode}
              onChange={(e) => setTokenCode(e.target.value)}
              placeholder="e.g. EMP1234"
              disabled={loading}
            />
          </Form.Group>

          <Button className="mt-3 w-100" onClick={handleMark} disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" animation="border" /> Marking...
              </>
            ) : (
              "Mark Attendance"
            )}
          </Button>
        </Form>

        {status && (
          <div className="mt-3 text-center fw-bold">
            <p>{status}</p>
          </div>
        )}

        {/* ✅ Attendance History */}
        {history.length > 0 && (
          <div className="mt-4">
            <h6 className="text-center mb-2">Last 5 Days</h6>

            {fetching ? (
              <div className="text-center">
                <Spinner animation="border" size="sm" />
              </div>
            ) : (
              <Table striped bordered size="sm">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i}>
                      <td>{new Date(h.date).toLocaleDateString()}</td>
                      <td>{h.status}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        )}
      </Card>
    </Container>
  );
};

export default EmployeeMark;
