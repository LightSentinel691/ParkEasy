import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const statusStyles = {
  Confirmed: "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

function MyBookings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [loggedInUserName, setLoggedInUserName] = useState(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setUserBookings([]);
      }
    });

    const fetchuser = async () => {
      try {
        const user = auth.currentUser;

        if (!user) return;
        const userDoc = await getDoc(doc(db, "applications", user.uid));
        const name = userDoc.data().name;

        const myNameArray = name.split(" ");

        const nameStr = `${myNameArray[0]}+${myNameArray[1]}`;
        setLoggedInUserName(nameStr);
      } catch (error) {
        console.log("Error Message" + error);
      }
    };

    fetchuser();
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setUserBookings(bookings);
    });

    return () => unsub();
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    await deleteDoc(doc(db, "bookings", id)); // :contentReference[oaicite:1]{index=1}
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateDoc(doc(db, "bookings", id), { status: newStatus }); // :contentReference[oaicite:2]{index=2}
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to view your bookings.</p>
      </div>
    );
  }

  const handleRedirectHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      {/* Header */}
      <header className="flex justify-between items-center mb-10 bg-yellow-100 p-5">
        <h1 className="text-3xl font-semibold">ParkEasy</h1>
        <div className="flex items-center gap-4">
          <a onClick={handleRedirectHome} className="text-xl hover:underline ">
            Home
          </a>
          <a className="hover:underline pr-4 text-xl">About Us</a>
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            {/* Placeholder for profile picture */}
             <img
                src={`https://ui-avatars.com/api/?name=${loggedInUserName}&background=0D8ABC&color=fff&rounded=true`}
                alt="Profile"
              />
          </div>
        </div>
      </header>

      {/* Booking Table */}
      <div className="p-10">
        <h2 className="text-3xl font-bold mb-6">My Bookings</h2>
        {userBookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-4 text-left font-semibold">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Date</th>
                  <th className="px-6 py-4 text-left font-semibold">Time</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userBookings.map((b) => (
                  <tr key={b.id} className="border-b">
                    <td className="px-6 py-4">{b.location}</td>
                    <td className="px-6 py-4">{b.date}</td>
                    <td className="px-6 py-4">{b.time}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${
                          statusStyles[b.status] || "bg-gray-100 text-black"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      {b.status !== "Cancelled" && (
                        <button
                          onClick={() => handleStatusChange(b.id, "Cancelled")}
                          className="text-red-600 hover:underline"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="text-gray-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
