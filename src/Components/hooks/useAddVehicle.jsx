import { useState } from "react";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

const useAddVehicle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addVehicle = async ({ plate, ownerName, phone, email, timeIn }) => {
    setLoading(true);
    setError(null);

    const now = new Date();
    // Format time String
    const timeString = now.toLocaleTimeString();

    // Format the date string
    const dateString = now.toLocaleDateString();

    const dateTimeString = `${dateString} ${timeString}`;

    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log(user.uid);
          console.log(user);
          try {
            const userDoc = await getDoc(doc(db, "applications", user.uid));
            const slotId = userDoc.data().slot;
            const docRef = await addDoc(collection(db, "vehicles"), {
              vehiclePlate: plate,
              ownerName,
              ownerPhone: phone,
              ownerEmail: email,
              timeIn,
              clockIn: dateTimeString,
              status: "Ongoing",
              slot: slotId,
              createdBy: user.uid,
              createdAt: serverTimestamp(),
            });
            resolve(docRef);
          } catch (err) {
            setError(err.message);
            reject(err);
          } finally {
            setLoading(false);
          }
        } else {
          setError("User not logged in");
          setLoading(false);
          reject("User not logged in");
        }
      });
    });
  };

  return { addVehicle, loading, error };
};

export default useAddVehicle;
