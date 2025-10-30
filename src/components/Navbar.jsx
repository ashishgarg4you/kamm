import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          AttendanceApp
        </Link>

        <div className="d-flex">
          {/* ✅ Public link visible always */}
          <Link to="/employee" className="nav-link text-white me-3">
            Employee Portal
          </Link>

          {/* ✅ Show these only if logged in */}
          {token && (
            <>
              <Link to="/dashboard" className="nav-link text-white me-3">
                Dashboard
              </Link>
              <Link to="/users" className="nav-link text-white me-3">
                Users
              </Link>
              <Link to="/attendance" className="nav-link text-white me-3">
                Attendance
              </Link>
              <button className="btn btn-outline-light" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
