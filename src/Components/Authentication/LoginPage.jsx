import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import useUserRole from "../hooks/useUserRole";
import Toast from "../Toast";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  const [triggered, setTriggered] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { setIsAutheticated } = useOutletContext();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useOutletContext();

  // Only load role logic after login
  const { role, loading } = useUserRole(triggered, setIsAutheticated);

  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const parkingSlotId = location.state?.id;

  // Redirect based on role
  if (role === "admin") navigate("/admin-dashboard");
  else if (role === "manager") navigate("/manager-portal");
  else if (role === "client") {
    if (from === "/") {
      setIsAuthenticated(true);
      navigate("/");
    } else {
      setIsAuthenticated(true);
      navigate("/confirm", { state: parkingSlotId });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setTriggered(true);
      setToastMessage("Login successful! Redirecting...");
    } catch (err) {
      setAuthError("Invalid credentials. Please try again.");
      console.error("Login Error:", err.message);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[65vh] px-6 bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Log In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {authError && (
              <p className="text-sm text-red-500 text-center">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
            {toastMessage && (
              <Toast
                message={toastMessage}
                onClose={() => setToastMessage("")}
              />
            )}
          </form>
        </div>
      </div>
      {/* Footer Section */}
      <div className="bg-white border-t py-6 text-center text-sm text-gray-600">
        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-3 mb-3">
          <p className="cursor-pointer hover:text-blue-600">Terms of Service</p>
          <p className="cursor-pointer hover:text-blue-600">Privacy Policy</p>
          <p className="cursor-pointer hover:text-blue-600">Contact Us</p>
        </div>
        <p>©2025 ParkEasy. All rights reserved.</p>
      </div>
    </>
  );
};

export default LoginPage;
