import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import NewProblem from "./pages/NewProblem";
import React from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="font-bold text-gray-800 hover:text-gray-600">
            Feed
          </Link>
          <Link
            to="/new"
            className="font-bold text-gray-800 hover:text-gray-600"
          >
            Post Problem
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-700">Hello, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-blue-500 hover:text-blue-700 font-semibold"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-blue-500 hover:text-blue-700 font-semibold"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="p-4">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/new" element={<NewProblem />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </div>
  );
}
