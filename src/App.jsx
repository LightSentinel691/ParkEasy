import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthenticationHome from "./Components/Authentication/AuthenticationHome";
import LoginPage from "./Components/Authentication/LoginPage";
import Homepage from "./Components/Homepage";
import RegisterPage from "./Components/Authentication/Registration";
import BookingConfirmation from "./Components/BookingPage";
import { useState } from "react";
import ProtectedRoute from "./Components/ProtectedRoute";
import UserBookings from "./Components/MyBookings";
import Dashboard from "./Components/Admin/Dashboard";
import AddVehicle from "./Components/Admin/AddVehicle";
import Vehicles from "./Components/Admin/Vehicles";
import ViewBookings from "./Components/Admin/ViewBookings";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage  setIsAuthenticated={setIsAuthenticated}/>} />
          
          <Route
            path="/Authentication"
            element={
              <AuthenticationHome setIsAuthenticated={setIsAuthenticated} />
            }>
            <Route index element={<LoginPage />} />
            <Route path="Register" element={<RegisterPage />} />
          </Route>
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/confirm" element={<BookingConfirmation />} />
            <Route path="/add-vehicle" element={<AddVehicle />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/view-bookings" element={<ViewBookings />} />
            <Route path="/Bookings" element={<UserBookings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;



// Work on images of the parking slots
