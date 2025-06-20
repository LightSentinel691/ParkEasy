import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [userSlot, setUserSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "applications", user.uid));
          const slotId = userDoc.data().slot;
          const slot = slotId;
          setUserSlot(slot);

          const q = query(
            collection(db, "vehicles"),
            where("slot", "==", slot)
          );
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setVehicles(data);
            setLoading(false);
          });

          return () => unsubscribe();
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    });

    return () => unsubAuth();
  }, []);

  return { vehicles, loading };
};

export default useVehicles;

