import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid email or password";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-50 overflow-hidden p-4 sm:p-10">
      {/* Decorative Orbs */}
      <div className="absolute w-64 h-64 bg-indigo-300/30 rounded-full blur-3xl top-[-60px] left-[-80px]" />
      <div className="absolute w-72 h-72 bg-blue-300/20 rounded-full blur-3xl bottom-[-80px] right-[-60px]" />

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-lg border border-indigo-100 rounded-3xl shadow-xl p-6 sm:p-8 transition-all duration-500 hover:shadow-2xl animate-fadeIn">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-indigo-700 mb-6 tracking-tight">
          Manager Login
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl mb-4 text-center animate-fadeIn">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full border border-indigo-200 rounded-xl px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full border border-indigo-200 rounded-xl px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-xl text-white font-semibold shadow-md transition-all duration-300 ${
              loading
                ? "bg-indigo-400 cursor-not-allowed shimmer"
                : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 hover:scale-[1.02]"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} Attendance System
        </p>
      </div>
    </div>
  );
}
