import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import parkingSlots from "../Data/db.json";

import { useBooking } from "./hooks/useBooking";

const parkingSpots = parkingSlots;

export default function BookingConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    duration: "",
    name: "",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const { submitBooking, loading, error } = useBooking();

  const id = state;
  const bookingArr = parkingSpots.filter(
    (parkingSpot) => parkingSpot.id === id
  );
  const bookingObject = bookingArr[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bookingObj = { location: bookingObject.title, ...formData };
    await submitBooking(bookingObj);
  };

  if (!state) return <p>Missing booking data</p>;

  const handleShowBookings = () => {
    navigate("/Bookings");
  };

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
          <a onClick={handleShowBookings} className="hover:underline">
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

          <p className="w-full bg-gray-100 p-3 rounded mb-3">
            {bookingObject.title}
          </p>
        </section>
      </div>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-10">
        <section className="mb-6">
          <h2 className="text-md font-semibold mb-2">Booking Details</h2>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full bg-gray-100 p-3 rounded mb-3"
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full bg-gray-100 p-3 rounded mb-3"
          />
          <input
            type="text"
            name="duration"
            placeholder="Duration in Minutes"
            value={formData.duration}
            onChange={handleChange}
            className="w-full bg-gray-100 p-3 rounded mb-3"
          />
        </section>

        <section className="mb-6">
          <h2 className="text-md font-semibold mb-2">Payment Details</h2>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-gray-100 p-3 rounded mb-3"
          />
          <input
            type="text"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-gray-100 p-3 rounded mb-3"
          />
          <input
            type="text"
            name="cardNumber"
            placeholder="Enter card number"
            value={formData.cardNumber}
            onChange={handleChange}
            className="w-full bg-gray-100 p-3 rounded mb-3"
          />
          <div className="flex gap-3 mb-3">
            <input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              value={formData.expiry}
              onChange={handleChange}
              className="w-1/2 bg-gray-100 p-3 rounded"
            />
            <input
              type="text"
              name="cvv"
              placeholder="Enter CVV"
              value={formData.cvv}
              onChange={handleChange}
              className="w-1/2 bg-gray-100 p-3 rounded"
            />
          </div>
        </section>

        {error && <p className="text-red-500 mb-3">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Booking"}
        </button>
      </form>
    </div>
  );
}

// To do: -
// Total to be calculated after entering the time
// Navigation Links on the top bar
