import { useState } from "react";
import useRegister from "../hooks/useRegistration";
import Toast from "../Toast";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [toastMessage, setToastMessage] = useState("");
  const { registerUser, loading, error } = useRegister();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, phone, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setToastMessage("Passwords do not match");
      return;
    }

    await registerUser({ name, phone, email, password }, () => {
      setToastMessage("Account created! You can now log in.");
      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[65vh] px-6 bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Create a ParkEasy Account
          </h2>

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>

        {toastMessage && (
          <Toast
            message={toastMessage}
            onClose={() => setToastMessage("")}
            type={toastMessage.includes("match") ? "error" : "success"}
          />
        )}
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

export default RegisterPage;


//To Do: - 
// Redirect to HomePage after registering the user