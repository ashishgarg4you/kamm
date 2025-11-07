import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // ✅ npm install lucide-react

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-indigo-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          onClick={() => setIsOpen(false)}
          className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent tracking-tight"
        >
          Attendance<span className="text-indigo-700">App</span>
        </Link>

        {/* Hamburger Menu for Mobile */}
        <button
          aria-label="Toggle Menu"
          className="sm:hidden text-indigo-700 hover:text-indigo-900 transition-all duration-200"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-6">
          <Link
            to="/employee"
            className="text-gray-700 font-medium hover:text-indigo-700 transition-all duration-200"
          >
            Employee Portal
          </Link>

          {token && (
            <>
              <Link
                to="/dashboard"
                className="text-gray-700 font-medium hover:text-indigo-700 transition-all duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/users"
                className="text-gray-700 font-medium hover:text-indigo-700 transition-all duration-200"
              >
                Users
              </Link>
              <Link
                to="/attendance"
                className="text-gray-700 font-medium hover:text-indigo-700 transition-all duration-200"
              >
                Attendance
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium hover:from-indigo-700 hover:to-indigo-800 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`sm:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col bg-white/95 backdrop-blur-md border-t border-indigo-100 shadow-md px-4 py-4 space-y-3">
          <Link
            to="/employee"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 font-medium hover:text-indigo-700 transition-all duration-200"
          >
            Employee Portal
          </Link>

          {token && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 font-medium hover:text-indigo-700 transition-all duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/users"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 font-medium hover:text-indigo-700 transition-all duration-200"
              >
                Users
              </Link>
              <Link
                to="/attendance"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 font-medium hover:text-indigo-700 transition-all duration-200"
              >
                Attendance
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full text-center px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium hover:from-indigo-700 hover:to-indigo-800 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
