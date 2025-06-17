import React from "react";
import parkEasyLogo from "../../assets/ParkEasyLogo.png";
import { Outlet } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function AuthenticationHome() {
    const navigate = useNavigate();

    const handleRedirectHome = () => {
    navigate('/')
  }

  return (
    <>
      {/* Navigation Bar */}
            <div className="HomeNavBar flex justify-between items-center px-6  bg-white shadow-md">
              <div className="w-[100px]">
                <img src={parkEasyLogo} alt="Logo" onClick={handleRedirectHome}/>
              </div>
              <div className="text-lg flex gap-6 text-gray-700">
                <span className="cursor-pointer hover:text-blue-600" onClick={handleRedirectHome}>Home</span>
                <span className="cursor-pointer hover:text-blue-600">About</span>
                <span className="cursor-pointer hover:text-blue-600">Contact</span>
                <span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
                    Login
                  </button>
                </span>
              </div>
            </div>

      {/* Authentication Links Section */}
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome to ParkEasy
        </h1>
        <div className="flex justify-center space-x-8 mb-2">
          <button className="pb-2 border-b-2 border-blue-600 text-blue-600 font-medium">
            Login
          </button>
          <button className="pb-2 text-gray-500 hover:text-blue-600 transition">
            Register
          </button>
        </div>
        <hr className="border-t border-gray-300 w-3/4 mx-auto mt-2" />
      </div>
      <Outlet />
    </>
  );
}

export default AuthenticationHome;


// Need to add Conditional classes with state-based logic (isActive). Hook this up with routing next for seamless navigation
