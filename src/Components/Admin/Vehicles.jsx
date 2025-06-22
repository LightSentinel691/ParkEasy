import { useState } from "react";
import useVehicles from "../hooks/useVehicles";
import Modal from "./Modal";
import {
  doc,
  updateDoc,
  getDoc,
  getDocs,
  collection,
  where,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import { auth } from "../../firebase";
import Sidebar from "./Sidebar";
import Toast from "../Toast";

export default function Vehicles() {
  const { vehicles, loading } = useVehicles();
  const [search, setSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [checkoutError, setCheckoutError] = useState(null);

  const filteredVehicles = vehicles.filter((v) =>
    v.ownerName.toLowerCase().includes(search.toLowerCase())
  );

  const checkedIn = filteredVehicles.filter((v) => v.status === "Ongoing");
  const checkedOut = filteredVehicles.filter((v) => v.status === "Completed");

  const calculateFee = (timeIn, timeOut) => {
    const inTime = new Date(timeIn);
    const outTime = new Date(timeOut);
    const hours = Math.ceil((outTime - inTime) / (1000 * 60 * 60));
    return hours * 3;
  };
  const updateParkingSpaces = async () => {
    try {
      const user = auth.currentUser;

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
        slotsAvailable: available + 1,
      });

      console.log("Updated successfully!");
    } catch (error) {
      console.error("Dashboard error:", error.message);
    }
  };

  const handleCheckOut = async (vehicle) => {
    const now = new Date();
    const formattedTimeOut = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const clockedOut = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
    const charges = calculateFee(vehicle.clockIn, clockedOut);

    try {
      const ref = doc(db, "vehicles", vehicle.id);
      await updateDoc(ref, {
        timeOut: formattedTimeOut,
        clockOut: clockedOut,
        status: "Completed",
        amountPaid: charges,
      });

      setSelectedVehicle(null); // close modal
      setToastMessage("Successfully checked out vehicle");
      updateParkingSpaces();
    } catch (err) {
      setCheckoutError("Error checking out vehicle: " + err.message);
      setToastMessage("Error Checking out vehicle");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <div className="p-8 bg-white min-h-screen">
          <h1 className="text-3xl font-bold mb-6">Vehicles</h1>

          <input
            type="text"
            placeholder="Search by Owner Name..."
            className="mb-6 px-4 py-2 border rounded w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {loading && <p>Loading...</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Checked In */}
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Vehicles Checked In
              </h2>
              <div className="overflow-y-auto max-h-[300px] border rounded">
                <table className="w-full table-auto text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3">Plate Number</th>
                      <th className="p-3">Owner Name</th>
                      <th className="p-3">Time In</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkedIn.map((v) => (
                      <tr
                        key={v.id}
                        onClick={() => setSelectedVehicle({ ...v, type: "in" })}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <td className="p-3">{v.vehiclePlate}</td>
                        <td className="p-3">{v.ownerName}</td>
                        <td className="p-3">{v.timeIn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Checked Out */}
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Vehicles Checked Out
              </h2>
              <div className="border rounded">
                <table className="w-full table-auto text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3">Plate Number</th>
                      <th className="p-3">Owner Name</th>
                      <th className="p-3">Time In</th>
                      <th className="p-3">Time Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkedOut.map((v) => (
                      <tr
                        key={v.id}
                        onClick={() =>
                          setSelectedVehicle({ ...v, type: "out" })
                        }
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <td className="p-3">{v.vehiclePlate}</td>
                        <td className="p-3">{v.ownerName}</td>
                        <td className="p-3">{v.timeIn}</td>
                        <td className="p-3">{v.timeOut}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Modal */}
          {selectedVehicle && (
            <Modal onClose={() => setSelectedVehicle(null)}>
              {selectedVehicle.type === "out" ? (
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Checked Out Details
                  </h2>
                  <p>
                    <strong>Plate:</strong> {selectedVehicle.vehiclePlate}
                  </p>
                  <p>
                    <strong>Time In:</strong> {selectedVehicle.timeIn}
                  </p>
                  <p>
                    <strong>Time Out:</strong> {selectedVehicle.timeOut}
                  </p>
                  <p className="mt-2">
                    <strong>Amount Paid:</strong> $
                    {calculateFee(
                      selectedVehicle.clockIn,
                      selectedVehicle.clockOut
                    )}
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Checked In Details
                  </h2>
                  <p>
                    <strong>Plate:</strong> {selectedVehicle.vehiclePlate}
                  </p>
                  <p>
                    <strong>Time In:</strong> {selectedVehicle.timeIn}
                  </p>
                  <p>
                    <strong>Current Time:</strong>{" "}
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="mt-2">
                    <strong>Estimated Fee:</strong> $
                    {calculateFee(
                      selectedVehicle.clockIn,
                      `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
                    )}
                  </p>

                  <button
                    onClick={() => handleCheckOut(selectedVehicle)}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Check Out
                  </button>
                </div>
              )}
            </Modal>
          )}
        </div>
      </div>
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage("")}
          type={checkoutError ? false : "success"}
        />
      )}
    </div>
  );
}
