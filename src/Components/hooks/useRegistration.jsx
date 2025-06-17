import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const registerUser = async ({ name, email, password, phone }, onSuccess) => {
    setLoading(true);
    setError("");

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCred.user.uid;

    //   await setDoc(doc(db, "users", uid), {
    //     uid,
    //     name,
    //     email,
    //     phone,
    //     role: "client",
    //   });

      await setDoc(doc(db, "applications", uid), {
        uid,
        name,
        email,
        phone,
        role: "client",
      });

      onSuccess?.();
    } catch (err) {
      console.error("Registration Error:", err);
      setError("Failed to register user.");
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error };
};

export default useRegister;
