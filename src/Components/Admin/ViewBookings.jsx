import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import Sidebar from "./Sidebar";

const statusStyles = {
  Confirmed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Passed: "bg-gray-200 text-gray-600",
};

function ViewBookings() {
  const [bookings, setBookings] = useState([]);
  const [locationId, setLocationId] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const user = auth.currentUser;
        const userDoc = await getDoc(doc(db, "applications", user.uid));
        setLocationId(userDoc.data().slot);
      } catch (err) {
        console.error("Error fetching location:", err.message);
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!locationId) return;

      try {
        const snapshot = await getDocs(
          query(collection(db, "bookings"), where("location", "==", locationId))
        );

        const now = new Date();
        const filtered = [];

        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          const bookingDate = `${data.date} ${data.time}`;
          const [datePart, timePart] = bookingDate.split(" ");
          const [year, month, day] = datePart.split("-").map(Number);
          const [hour, minute] = timePart.split(":").map(Number);
          const bookingTime = new Date(year, month - 1, day, hour, minute);

          if (bookingTime < now && data.status === "Pending") {
            await updateDoc(doc(db, "bookings", docSnap.id), {
              status: "Cancelled",
            });
            data.status = "Cancelled";
          }

          filtered.push({ id: docSnap.id, ...data });
        }

        setBookings(filtered);
      } catch (error) {
        console.error("Dashboard error:", error.message);
      }
    };

    fetchBookings();
  }, [locationId]);

  const updateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "bookings", id), {
        status: newStatus,
      });

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      console.error("Error updating booking:", err);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold">View Bookings</h2>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr className="text-left">
                  <th className="p-3">Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-gray-500">
                      No bookings found for this location.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{booking.paymentDetails.name}</td>
                      <td className="p-3">{booking.paymentDetails.phone}</td>
                      <td className="p-3">{booking.date}</td>
                      <td className="p-3">{booking.time}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusStyles[booking.status] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => updateStatus(booking.id, "Cancelled")}
                          disabled={booking.status !== "Pending"}
                          className={`px-3 py-1 text-sm text-white rounded ${booking.status !== "Pending" ? 'bg-gray-300':' bg-red-500  hover:bg-red-600'}`}
                        >
                          {console.log()}
                          Cancel
                        </button>
                        <button
                          onClick={() => updateStatus(booking.id, "Confirmed")}
                          disabled={booking.status !== "Pending"}
                          className={`px-3 py-1 text-sm text-white rounded ${booking.status !== "Pending" ? 'bg-gray-300':'bg-green-500  hover:bg-green-600'}`}
                        >
                          Confirm
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewBookings;


"  "