import React from "react";
import { useLocation } from "react-router-dom";

export default function BookingConfirmation() {
  const { state } = useLocation();
  

  if (!state) return <p>Missing booking data</p>;

  const { id } = state;

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div className="text-xl font-semibold flex items-center gap-1">
          <span className="w-2 h-2 bg-black rounded-full inline-block"></span>
          ParkEasy
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <a href="#" className="hover:underline">
            Home
          </a>
          <a href="#" className="hover:underline">
            Bookings
          </a>
          <a href="#" className="hover:underline">
            Profile
          </a>
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            {/* Placeholder for profile picture */}
            <img src="https://i.pravatar.cc/32" alt="Profile" />
          </div>
        </nav>
      </header>

      {/* Booking Form */}
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Booking Confirmation</h1>

        {/* Booking Details */}
        <section className="mb-6">
          <h2 className="text-md font-semibold mb-2">Booking Details</h2>

          <p className="w-full bg-gray-100 p-3 rounded mb-3">{id}</p>
          <input type="date" className="w-full bg-gray-100 p-3 rounded mb-3" />
          <input type="time" className="w-full bg-gray-100 p-3 rounded mb-3" />
          <input
            type="text"
            placeholder="Duration in Minutes"
            className="w-full bg-gray-100 p-3 rounded mb-3"
          />
        </section>

        {/* Payment Details */}
        <section className="mb-6">
          <h2 className="text-md font-semibold mb-2">Payment Details</h2>

          <input
            type="text"
            placeholder="Enter your name"
            className="w-full bg-gray-100 p-3 rounded mb-3"
          />
          <input
            type="text"
            placeholder="Enter your phone number"
            className="w-full bg-gray-100 p-3 rounded mb-3"
          />
          <input
            type="text"
            placeholder="Enter card number"
            className="w-full bg-gray-100 p-3 rounded mb-3"
          />
          <div className="flex gap-3 mb-3">
            <input
              type="text"
              placeholder="MM/YY"
              className="w-1/2 bg-gray-100 p-3 rounded"
            />
            <input
              type="text"
              placeholder="Enter CVV"
              className="w-1/2 bg-gray-100 p-3 rounded"
            />
          </div>
        </section>

        {/* Summary */}
        <div className="flex justify-between mb-6">
          <span className="font-semibold">Total</span>
          <span className="text-sm">$10.00</span>
        </div>

        <button className="w-full bg-blue-500 text-white p-3 rounded-full font-semibold hover:bg-blue-600">
          Confirm Booking and Pay
        </button>
      </div>
    </div>
  );
}

// To do: -
//On booking it redirects users to the Bookings page
//On user clicking before loggin in - we should redirect them to login page and then back to homepage
// Total to be calculated after entering the time
// Get the users object to from the localstorage

//Feature addition: -
//We can redirect them to the booking page with the updated data.
