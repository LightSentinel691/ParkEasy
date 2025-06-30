import React from "react";
import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

function AuthenticationHome({setIsAuthenticated}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleRedirectHome = () => navigate("/");
  const handleRegistration = () => navigate("Register");
  const handleLogin = () => navigate("/Authentication");

  const currentPath = location.pathname;

  return (
    <>
      {/* Navigation Bar */}
      <div className="HomeNavBar flex justify-between items-center px-6 bg-white shadow-md py-6">
        <div className="text-3xl font-semibold flex items-center gap-1" onClick={handleRedirectHome}>
          <span className="w-2 h-2 bg-black rounded-full inline-block"></span>
          ParkEasy
        </div>
        <div className="text-lg flex gap-6 text-gray-700">
          <span
            className="cursor-pointer hover:text-blue-600"
            onClick={handleRedirectHome}
          >
            Home
          </span>
          <span className="cursor-pointer hover:text-blue-600">About</span>
          <span className="cursor-pointer hover:text-blue-600">Contact</span>
        </div>
      </div>

      {/* Authentication Links Section */}
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome to ParkEasy
        </h1>
        <div className="flex justify-center space-x-8 mb-2">
          <button
            onClick={handleLogin}
            className={`pb-2 font-medium ${
              currentPath === "/Authentication"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-600 transition"
            }`}
          >
            Login
          </button>
          <button
            onClick={handleRegistration}
            className={`pb-2 font-medium ${
              currentPath === "/Authentication/Register"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-600 transition"
            }`}
          >
            Register
          </button>
        </div>
        <hr className="border-t border-gray-300 w-3/4 mx-auto mt-2" />
      </div>
      <Outlet context={{setIsAuthenticated}} />
    </>
  );
}

export default AuthenticationHome;

