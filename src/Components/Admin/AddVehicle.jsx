import { useState, useEffect } from "react";
import useAddVehicle from "../hooks/useAddVehicle";
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { auth } from "../../firebase";
import { doc } from "firebase/firestore";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

export default function AddVehicle() {
  const { addVehicle, loading, error } = useAddVehicle();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    plate: "",
    ownerName: "",
    phone: "",
    email: "",
    timeIn: "",
  });

  useEffect(() => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setFormData((prev) => ({ ...prev, timeIn: timeString }));
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const deductParkingSlot = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No auhenticated user");

      //we get the user's parkingSlot
      const userDoc = await getDoc(doc(db, "applications", user.uid));
      const slotId = userDoc.data().slot;

      const slotNumber = parseInt(slotId.split("-")[1]);

      // Get parking spot info
      const spotsSnapshot = await getDocs(
        query(collection(db, "parkingSpots"), where("id", "==", slotNumber))
      );
      const spotDoc = spotsSnapshot.docs[0];
      if (!spotDoc) throw new Error("No matching parking spot found");

      const spotData = spotDoc.data();
      let available = spotData.slotsAvailable;

      // Deduct one and update
      await updateDoc(doc(db, "parkingSpots", spotDoc.id), {
        slotsAvailable: available - 1,
      });

      console.log("Updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Dashboard error:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addVehicle(formData);
      alert("Vehicle added successfully!");
      setFormData({
        plate: "",
        ownerName: "",
        phone: "",
        email: "",
        timeIn: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      //We deduct one parkingslot from the available slots
      deductParkingSlot();
    } catch (err) {
      alert("Failed to add vehicle: " + err);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <div className="min-h-screen bg-white p-8">
          <div className="max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">
              Employee Dashboard
            </h1>
            <form
              onSubmit={handleSubmit}
              className="bg-gray-50 p-6 rounded-lg shadow space-y-4"
            >
              <input
                name="plate"
                value={formData.plate}
                onChange={handleChange}
                type="text"
                placeholder="Enter vehicle number plate"
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                type="text"
                placeholder="Enter owner name"
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                placeholder="Enter owner phone"
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Enter owner email"
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                name="timeIn"
                value={formData.timeIn}
                readOnly
                className="w-full px-4 py-2 border rounded bg-gray-100"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded"
              >
                {loading ? "Adding..." : "Add Vehicle"}
              </button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Go to the specific parking lot and remove one parking spot;
