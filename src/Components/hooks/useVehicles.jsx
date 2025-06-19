import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [userSlot, setUserSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const slot = localStorage.getItem("userSlot") || "spot-1"; 
        setUserSlot(slot);

        const q = query(collection(db, "vehicles"), where("slot", "==", slot));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setVehicles(data);
          setLoading(false);
        });

        return () => unsubscribe();
      }
    });

    return () => unsubAuth();
  }, []);

  return { vehicles, loading };
};

export default useVehicles;



//Remove the automatically placed slot 1 to filter vehicles
