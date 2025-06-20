import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../firebase";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  const [spotData, setSpotData] = useState(null);
  const [revenueToday, setRevenueToday] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [currentSlotId, setCurrentSlotId] = useState("");

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(db, "applications", user.uid));
      const slotId = userDoc.data().slot;
      setCurrentSlotId(slotId);
    }
  });

  const time = (item) => {
    const date = new Date(item);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const timeFormatted = `${hours}:${minutes}`;
    return timeFormatted;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get parking spot info
        const spotsSnapshot = await getDocs(
          query(
            collection(db, "parkingSpots"),
            where("id", "==", parseInt(currentSlotId.split("-")[1]))
          )
        );
        const spot = spotsSnapshot.docs[0]?.data();
        setSpotData(spot);

        // Get today's date boundaries
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
       

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const vehiclesSnapshot = await getDocs(
          query(
            collection(db, "vehicles"),
            where("slot", "==", currentSlotId),
            where("createdAt", ">=", startOfToday),
            where("createdAt", "<=", endOfToday)
          )
        );

        let revenue = 0;
        const todayVehicles = [];
        vehiclesSnapshot.forEach((doc) => {
          const data = doc.data();
          revenue += data.amountPaid || 0;
          todayVehicles.push({ ...data, id: doc.id });
        });
        setRevenueToday(revenue);

        // 3. Recent 10 activities (based on clockIn or clockOut)
        const recentSnapshot = await getDocs(
          query(
            collection(db, "vehicles"),
            where("slot", "==", currentSlotId),
            orderBy("createdAt", "desc"),
            limit(13)
          )
        );
        const recent = recentSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setRecentActivity(recent);
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    fetchData();
  }, [currentSlotId]);

  return (
    <div className="flex flex-wrap">
      <Sidebar />

      <div className="p-6 space-y-6 flex-1">
        <h2 className="text-2xl font-bold">Dashboard</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            title="Parked Cars"
            value={
              spotData ? spotData.totalSlots - spotData.slotsAvailable : "-"
            }
          />
          <StatCard
            title="Available Slots"
            value={spotData?.slotsAvailable ?? "-"}
          />
          <StatCard title="Revenue Today" value={`KES ${revenueToday}`} />
        </div>

        <div>
          <h3 className="text-xl font-semibold mt-6 mb-2">Recent Activity</h3>
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Plate</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Clock In</th>
                  <th className="p-3">Clock Out</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-4">
                      No activity yet.
                    </td>
                  </tr>
                ) : (
                  recentActivity.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{item.vehiclePlate}</td>
                      <td className="p-3 capitalize">{item.status}</td>
                      <td className="p-3">KES {item.amountPaid || 0}</td>
                      <td className="p-3">
                        {item.clockIn ? time(item.clockIn) : "-"}
                      </td>
                      <td className="p-3">
                        {item.clockOut ? time(item.clockOut) : "-"}
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
};

const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-2xl font-bold">{value}</h3>
  </div>
);

export default Dashboard;
