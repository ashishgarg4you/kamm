import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Attendance from "./pages/Attendance";

import EmployeeMark from "./pages/EmployeeMark";

function App() {
  return (
    <>
      {/* ✅ Navbar visible always */}
      <Navbar />

      <div className="container mt-4">
        <Routes>
          {/* ✅ Public Employee Attendance Page */}
          <Route path="/employee" element={<EmployeeMark />} />

          {/* ✅ Manager/Admin Login */}
          <Route path="/" element={<Login />} />

          {/* ✅ Protected Routes for Manager */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            }
          />


          {/* ✅ Catch-all (optional) */}
          <Route path="*" element={<Login />} />
        </Routes>
      </div>

      {/* ✅ Toast notifications */}
      <ToastContainer position="top-right" theme="colored" />

      
    </>
  );
}

export default App;
