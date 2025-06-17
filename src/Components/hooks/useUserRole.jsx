import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';

const useUserRole = (trigger = true) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

          // Redirect based on role
          if (userRole === 'admin') navigate('/admin-dashboard');
          else if (userRole === 'manager') navigate('/manager-portal');
          else navigate('/');
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      } else {
        setRole(null); 
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, trigger]);

  return { role, loading };
};

export default useUserRole;


// Observe routing behaviour here, or extrapolate it to Login Page and redirect there 