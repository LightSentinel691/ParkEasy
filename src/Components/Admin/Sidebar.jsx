import { Link } from "react-router-dom";
import { LayoutDashboard, Car,  FileText, PlusCircle, House, NotebookPen } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white shadow-lg p-4 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-6">ParkEasy</h1>
        <nav className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-medium">
            <LayoutDashboard size={24} /> Dashboard
          </Link>
          <Link to="/add-vehicle" className="flex items-center gap-2 text-lg font-medium">
            <PlusCircle size={24} /> Add Vehicle
          </Link>
          <Link to="/vehicles" className="flex items-center gap-2 text-lg font-medium"><Car size={24} /> Vehicles</Link>
          <a className="flex items-center gap-2 text-lg font-medium"><NotebookPen size={24} /> Booking</a>
          <a className="flex items-center gap-2 text-lg font-medium"><House size={24} /> Home</a>
          <a className="flex items-center gap-2 text-lg font-medium"><FileText size={24} /> Reports</a>
        </nav>
      </div>
      <div>
        <a className="text-sm text-gray-600 flex items-center gap-2">
          <span className="material-icons">settings</span> Settings
        </a>
      </div>
    </div>
  );
}

//Home links to the Page Welcome homepage
