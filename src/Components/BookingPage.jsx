import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import parkingSlots from "../Data/db.json";

import { useBooking } from "./hooks/useBooking";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const parkingSpots = parkingSlots;

export default function BookingPage() {
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
  const [loggedInUserName, setLoggedInUserName] = useState(null);


  useEffect(() => {
     const fetchuser = async () => {
      try {
        const user = auth.currentUser;
       

        if (!user) return
        const userDoc = await getDoc(doc(db, "applications", user.uid));
        const name = userDoc.data().name;

        const myNameArray = name.split(" ");

        const nameStr = `${myNameArray[0]}+${myNameArray[1]}`;
        setLoggedInUserName(nameStr);
      } catch (error) {
        console.log("Error Message" + error)
      }
    };

    fetchuser();
  }, [])

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
    const bookingObj = { location: bookingObject.id, ...formData };
    await submitBooking(bookingObj);
  };

  if (!state) return <p>Missing booking data</p>;

  const handleShowBookings = () => {
    navigate("/Bookings");
  };
  const handleHomeRedirection = () => {
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div onClick={handleHomeRedirection} className="text-3xl font-semibold flex items-center gap-1">
          <span className="w-2 h-2  bg-black rounded-full inline-block"></span>
          ParkEasy
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <a onClick={handleHomeRedirection} className="text-xl hover:underline">
            Home
          </a>
          <a className="text-xl hover:underline">
            About
          </a>
          <a onClick={handleShowBookings} className=" text-xl hover:underline">
            Bookings
          </a>
          
          <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden mr-7 mt-1">
            {/* Placeholder for profile picture */}
             <img
                src={`https://ui-avatars.com/api/?name=${loggedInUserName}&background=0D8ABC&color=fff&rounded=true`}
                alt="Profile"
              />
          </div>
        </nav>
      </header>

      {/* Booking Form */}
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Booking Confirmation</h1>

        {/* Booking Details */}
        <section className="mb-2">
          <h2 className="text-md font-semibold mb-2">Booking Details</h2>

          <p className="w-full bg-gray-100 p-3 rounded mb-1">
            {bookingObject.title}
          </p>
        </section>
      </div>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-3">
        <section className="mb-6">
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
            type="number"
            name="duration"
            placeholder="Duration in hrs"
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
// within an hour to the appointed time, deduct one parking slot from the specified lot.
