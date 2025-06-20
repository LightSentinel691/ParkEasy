import React from "react";
import { useNavigate } from 'react-router-dom';
import useImageLoader from './hooks/useImageLoader';
import parkEasyHero from "../assets/ParkEasyHero.png";
import parkEasyLogo from "../assets/ParkEasyLogo.png";
import parkingSlotsJson from '../Data/db.json';


const parkingSpots = parkingSlotsJson;



function Homepage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/Authentication')
  }

  const handleRedirectHome = () => {
    navigate('/')
  }
  
  const handleUserBooking = (id) => {
    navigate('/Confirm', {state: id});
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
            <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
              Login
            </button>
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-[78vh] bg-gray-100 pt-20">
        {/* Hero Content Container */}
        <div className="absolute top-1/2 left-1/2 w-11/12 md:w-3/5 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-white/90 rounded-xl shadow-lg p-8 flex flex-col items-center text-center">
            {/* Background Image */}
            <img
              src={parkEasyHero}
              alt="Parked Cars"
              className="rounded-lg mb-6 w-full object-cover h-60 sm:h-80 md:h-96"
            />

            {/* Headline */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Find Your Perfect Parking Spot
            </h1>

            {/* Description */}
            <p className="text-gray-700 text-md md:text-lg mb-6 max-w-xl">
              ParkEasy helps you locate and reserve parking spaces quickly and
              easily. Say goodbye to circling the block and hello to stress-free
              parking.
            </p>

            {/* Search Bar */}
            <div className="flex items-center bg-white border rounded-full overflow-hidden w-full max-w-md shadow-sm">
              <input
                type="text"
                placeholder="Enter Your Destination"
                className="flex-grow p-3 px-5 text-gray-800 outline-none"
              />
              <button className="bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition">
                🔍 Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Available Parking Slots Section */}
      <div>
        <ListParkingSpots handleUserBooking={handleUserBooking}/>
      </div>

      {/* Footer Section */}
      <div className="bg-white border-t py-6 text-center text-sm text-gray-600">
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-3">
          <p className="cursor-pointer hover:text-blue-600">Terms of Service</p>
          <p className="cursor-pointer hover:text-blue-600">Privacy Policy</p>
          <p className="cursor-pointer hover:text-blue-600">Contact Us</p>
        </div>
        <p>©2025 ParkEasy. All rights reserved.</p>
      </div>
    </>
  );
}

export default Homepage;

const ListParkingSpots = ({handleUserBooking}) => {
  // Parking Slot List Wrapper 
  //Get the data from Database
  const firstFiveSlots = parkingSpots.slice(0, 6);

  

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-10 bg-gray-50">
      {firstFiveSlots.map((parkingSlot) => (
        <DisplayParkingSpot key={parkingSlot.id} slot={parkingSlot} handleUserBooking={handleUserBooking}/>
      ))}
    </ul>
  );
};




const DisplayParkingSpot = ({ slot, handleUserBooking }) => {
  const { imageLoaded, imageSrc } = useImageLoader(slot.Thumbnail);

  return (
    <li className="bg-white rounded-xl shadow-md overflow-hidden">
      {imageLoaded ? (
        <img
          src={imageSrc}
          alt="Parking slot"
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
          Loading...
        </div>
      )}
      <div className="p-4 space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">{slot.title}</h2>
        <p className="text-gray-600">Slots: {slot.slotsAvailable}</p>
        <p className="text-gray-600">Rate: ${`${slot.charges}`}/hour</p>
        <p className="text-gray-500 text-sm">{slot.location}</p>
        <button onClick={() => {handleUserBooking(slot.id)}} className="mt-2 bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700 transition">
          Reserve
        </button>
      </div>
    </li>
  );
};

//To Do:- 
//Implement the search Function
//Create the Reserve Page and Link to It
// Have the Navbar Links Functionality.
//Hover Feature on Parking Listing.
// On loading the page check if the user is logged in
// Add icon on user logging in
// On logging in the taskbar changes to show the Bookings tab
