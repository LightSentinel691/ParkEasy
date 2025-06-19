import { useState, useEffect } from "react";
import useAddVehicle from "../hooks/useAddVehicle";

export default function AddVehicle() {
  const { addVehicle, loading, error } = useAddVehicle();

  const [formData, setFormData] = useState({
    plate: "",
    ownerName: "",
    phone: "",
    email: "",
    timeIn: "",
  });

  useEffect(() => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setFormData((prev) => ({ ...prev, timeIn: timeString }));
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addVehicle(formData);
      alert("Vehicle added successfully!");
      setFormData({
        plate: "",
        ownerName: "",
        phone: "",
        email: "",
        timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } catch (err) {
      alert("Failed to add vehicle: " + err);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Employee Dashboard</h1>
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg shadow space-y-4">
          <input
            name="plate"
            value={formData.plate}
            onChange={handleChange}
            type="text"
            placeholder="Enter vehicle number plate"
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            type="text"
            placeholder="Enter owner name"
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            type="tel"
            placeholder="Enter owner phone"
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Enter owner email"
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            name="timeIn"
            value={formData.timeIn}
            readOnly
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded"
          >
            {loading ? "Adding..." : "Add Vehicle"}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
}


// Go to the specific parking lot and remove one parking spot;