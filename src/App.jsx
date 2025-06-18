import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthenticationHome from "./Components/Authentication/AuthenticationHome";
import LoginPage from "./Components/Authentication/LoginPage";
import Homepage from "./Components/Homepage";
import RegisterPage from "./Components/Authentication/Registration";
import BookingConfirmation from "./Components/BookingConfirmation";
import { useState } from "react";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/Authentication" element={<AuthenticationHome setIsAuthenticated={setIsAuthenticated}/>}>
            <Route index element={<LoginPage />} />
            <Route path="Register" element={<RegisterPage />} />
          </Route>
          <Route
            path="/confirm"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <BookingConfirmation />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
