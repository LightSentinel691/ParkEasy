import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useImageLoader from "./hooks/useImageLoader";
import parkEasyHero from "../assets/ParkEasyHero.png";
import { auth, db } from "../firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import Toast from "./Toast";

function Homepage({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [loggedInUserRole, setLoggedInUserRole] = useState(null);
  const [loggedInUserName, setLoggedInUserName] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [data, setData] = useState([]);
  const [filterQuery, setFilterQuery] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogin = () => {
    navigate("/Authentication");
  };

  const handleRedirectHome = () => {
    navigate("/");
  };

  const handleUserBooking = (id) => {
    navigate("/Confirm", { state: id });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "parkingSpots"));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOriginalData(items);
        setData(items);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    const fetchuser = async () => {
      try {
        const user = auth.currentUser;

        if (!user) return
        const userDoc = await getDoc(doc(db, "applications", user.uid));
        const role = userDoc.data().role;
        const name = userDoc.data().name;

        const myNameArray = name.split(" ");

        const nameStr = `${myNameArray[0]}+${myNameArray[1]}`;
        setLoggedInUserName(nameStr);
        setLoggedInUserRole(role);
      } catch (error) {
        setAuthError("Error", error.message);
        setToastMessage("Error getting user details!");
      }
    };

    fetchData();
    fetchuser();
  }, []);

  const handleParkingSpotFiltering = () => {
    const filteredSpots = originalData.filter((parkingSpot) => {
      const spot = parkingSpot.town || "";
      return spot.toLowerCase().includes(filterQuery.toLowerCase());
    });
    
    setData(filteredSpots);
  };

  const handleViewBookings = () => {
    if (loggedInUserName && loggedInUserRole) {
      
      if (loggedInUserRole === 'admin') {
        navigate("/dashboard")
      } else {
        navigate("/Bookings")
      }
    } else {
      alert("I have been Clicked")
    }
  }

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setIsAuthenticated(false);
        setLoggedInUserName(null);
        setLoggedInUserRole(null);
        setToastMessage("Successfully logged Out!");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <>
      {/* Navigation Bar */}
      <div className="HomeNavBar flex justify-between items-center px-6  bg-white shadow-md py-6">
        <div className="text-3xl font-semibold flex items-center gap-1">
          <span onClick={handleRedirectHome} className="w-2 h-2 bg-black rounded-full inline-block"></span>
          ParkEasy
        </div>
        <div className="text-lg flex gap-6 text-gray-700">
          <span
            className="cursor-pointer mt-1 hover:text-blue-600 text-xl"
            onClick={handleRedirectHome}
          >
            Home
          </span>
          <span className="cursor-pointer mt-1 text-xl hover:text-blue-600 ">About</span>
          <span className="cursor-pointer mt-1 text-xl hover:text-blue-600" onClick={handleViewBookings}>
            {!loggedInUserName && !loggedInUserRole ? 'Contact' : loggedInUserRole === 'admin' ? 'Dashboard' : 'Bookings'}
          </span>
          {loggedInUserRole ? (
            <div className="w-9 h-9 mt-1 rounded-full bg-gray-200 overflow-hidden">
              {/* Placeholder for profile picture */}
              <img
                src={`https://ui-avatars.com/api/?name=${loggedInUserName}&background=0D8ABC&color=fff&rounded=true`}
                alt="Profile"
              />
            </div>
          ) : (
            ""
          )}
          <span>
            <button
              onClick={loggedInUserRole ? handleLogout : handleLogin}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
            >
              {loggedInUserRole ? "Log Out" : "Log In"}
            </button>
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-[78vh] bg-gray-100 pt-20">
        {/* Hero Content Container */}
        <div className="absolute top-1/2 left-1/2 w-11/12 md:w-3/5 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-white/90 rounded-xl shadow-lg p-8 flex flex-col items-center text-center">
            {/* Background Image */}
            <img
              src={parkEasyHero}
              alt="Parked Cars"
              className="rounded-lg mb-6 w-full object-cover h-60 sm:h-80 md:h-96"
            />

            {/* Headline */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Find Your Perfect Parking Spot
            </h1>

            {/* Description */}
            <p className="text-gray-700 text-md md:text-lg mb-6 max-w-xl">
              ParkEasy helps you locate and reserve parking spaces quickly and
              easily. Say goodbye to circling the block and hello to stress-free
              parking.
            </p>

            {/* Search Bar */}
            <div className="flex items-center bg-white border rounded-full overflow-hidden w-full max-w-md shadow-sm">
              <input
                onChange={(e) => setFilterQuery(e.target.value)}
                type="text"
                placeholder="Enter Your Destination"
                className="flex-grow p-3 px-5 text-gray-800 outline-none"
              />
              <button
                className="bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition"
                onClick={handleParkingSpotFiltering}
              >
                🔍 Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Available Parking Slots Section */}
      <div>
        <ListParkingSpots handleUserBooking={handleUserBooking} data={data} loading={isLoading}/>
      </div>

      {/* Footer Section */}
      <div className="bg-white border-t py-6 text-center text-sm text-gray-600">
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-3">
          <p className="cursor-pointer hover:text-blue-600">Terms of Service</p>
          <p className="cursor-pointer hover:text-blue-600">Privacy Policy</p>
          <p className="cursor-pointer hover:text-blue-600">Contact Us</p>
        </div>
        <p>©2025 ParkEasy. All rights reserved.</p>
      </div>
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage("")}
          type={authError ? false : "success"}
        />
      )}
    </>
  );
}

export default Homepage;

const ListParkingSpots = ({ handleUserBooking, data, loading }) => {
  if(data.length == 0) {
    return loading ? <p className="text-center text-2xl mb-5 mt-2">Loading...</p> : <p className="text-center text-2xl mb-5 mt-2">No data for this Location</p>
  }
  // Parking Slot List Wrapper
  const firstFiveSlots = data.slice(0, 6);

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-10 bg-gray-50">
      {firstFiveSlots.map((parkingSlot) => (
        <DisplayParkingSpot
          key={parkingSlot.id}
          slot={parkingSlot}
          handleUserBooking={handleUserBooking}
        />
      ))}
    </ul>
  );
};

const DisplayParkingSpot = ({ slot, handleUserBooking }) => {
  const { imageLoaded, imageSrc } = useImageLoader(slot.Thumbnail);

  return (
    <li className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:shadow-zinc-700">
      {imageLoaded ? (
        <img
          src={imageSrc}
          alt="Parking slot"
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
          Loading...
        </div>
      )}
      <div className="p-4 space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">{slot.title}</h2>
        <p className="text-gray-600">Slots: {slot.slotsAvailable}</p>
        <p className="text-gray-600">Rate: {`Ksh. ${slot.charges}`}/hour</p>
        <p className="text-gray-500 text-sm">{slot.location}</p>
        <button
          onClick={() => {
            handleUserBooking(slot.id);
          }}
          className="mt-2 bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700 transition"
        >
          Reserve
        </button>
      </div>
    </li>
  );
};


