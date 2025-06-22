import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { db, auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submitBooking = async (formData) => {
    setLoading(true);
    setError(null);

    const locationValue = `spot-${formData.location}`;

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const booking = {
        userId: user.uid,
        location: locationValue,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        paymentDetails: {
          name: formData.name,
          phone: formData.phone,
          cardNumber: formData.cardNumber,
          expiry: formData.expiry,
          cvv: formData.cvv
        },
        status: "Pending",
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "bookings"), booking);
      navigate("/Bookings");
    } catch (err) {
      console.error("Booking submission error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { submitBooking, loading, error };
};
