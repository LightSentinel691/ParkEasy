import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const useUserRole = (trigger = true) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  
  

  useEffect(() => {
    if (!trigger) return (
        setLoading(false)
    )

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userRole = userDoc.exists() ? userDoc.data().role : 'client';
          setRole(userRole);

          
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      } else {
        setRole(null); 
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [trigger]);

  return { role, loading };
};

export default useUserRole;