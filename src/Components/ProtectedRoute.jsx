import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated }) => {
  const location = useLocation();
  const {state} = useLocation();

  if (!isAuthenticated) {
    // Redirect to login and keep current location in state
    return <Navigate to="/Authentication" state={{ from: location, id: state }} replace />;
  }

  return children;
};

export default ProtectedRoute;

//On successful login if from the reserve object, we should take to the Booking Page