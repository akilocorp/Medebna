import Header from "@/components/header";
import Head from "next/head";
import { useEffect, useState } from "react";
import Footer from "@/components/footer";
import Link from "next/link";
import { FaRegCalendarAlt, FaHotel, FaCar, FaStar } from "react-icons/fa";
import { getHotels } from "@/stores/admin/ApiCallerAdmin";
import { fetchHotelOwnerProfiles } from "@/stores/operator/hotelprofileapicaller";
import { fetchCarOwnerProfile } from "@/stores/operator/carprofileapicaller";
import { fetchEventOwnerProfile } from "@/stores/operator/eventprofileapicaller";

interface Operator {
  _id: string;
  name: string;
  type: string;
}

interface HotelProfile {
  _id: string;
  address: string;
  city: string;
  companyImage: string;
  description: string;
  rating: number;
}

interface CarOwnerProfile {
  _id: string;
  address: string;
  city: string;
  companyImage: string;
  description: string;
  rating: number;
  rentalRules: {
    rentalDuration: string;
    cancellationPolicy: string;
    prepayment: boolean;
    noAgeRestriction: boolean;
    additionalInfo: string;
    acceptedPaymentMethods: string;
  };
}

interface EventOwnerProfile {
  _id: string;
  address: string;
  city: string;
  companyImage: string;
  description: string;
  rating: number;
  eventRules: {
    checkIn: string;
    checkOut: string;
    cancellationPolicy: string;
    additionalInfo: string;
    acceptedPaymentMethods: string;
  };
}

export default function Home() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Record<string, HotelProfile | CarOwnerProfile | EventOwnerProfile>>({});

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const operatorData = await getHotels();
        console.log("Fetched Operators:", operatorData);
        setOperators(operatorData);
  
        // Fetch profiles for each operator
        const profileData: Record<string, HotelProfile | CarOwnerProfile | EventOwnerProfile> = {};
        for (const operator of operatorData) {
          let profile = null;
  
          if (operator.type === 'hotel') {
            const hotelResponse = await fetchHotelOwnerProfiles(operator._id);
            if (hotelResponse?.data?.hotelProfile) {
              profile = hotelResponse.data.hotelProfile;
            }
          } else if (operator.type === 'car') {
            const carResponse = await fetchCarOwnerProfile(operator._id);
            if (carResponse) {
              profile = carResponse; // Directly assign as CarOwnerProfile has no data wrapping
            }
          } else if (operator.type === 'event') {
            const eventResponse = await fetchEventOwnerProfile(operator._id);
            if (eventResponse) {
              profile = eventResponse; // Directly assign as EventOwnerProfile has no data wrapping
            }
          }
  
          if (profile) {
            profileData[operator._id] = profile;
          }
        }
        setProfiles(profileData);
      } catch (error) {
        console.error("Error fetching operators:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOperators();
  
    const scrollContainers = document.querySelectorAll(".scroll-container");
    const timers: NodeJS.Timeout[] = [];
  
    scrollContainers.forEach((container) => {
      let scrollAmount = 0;
      const containerWidth = container.scrollWidth;
  
      const slide = () => {
        container.scrollLeft += 2;
        scrollAmount += 2;
        if (scrollAmount >= containerWidth - container.clientWidth) {
          container.scrollLeft = 0;
          scrollAmount = 0;
        }
      };
  
      const slideTimer = setInterval(slide, 20);
      timers.push(slideTimer);
    });
  
    return () => {
      timers.forEach((timer) => clearInterval(timer));
    };
  }, []);
  

  const renderCards = (type: "hotel" | "event" | "car") => {
    if (!operators || operators.length === 0) {
      return <div className="text-white">No operators available</div>; // Fallback if operators are undefined or empty
    }

    const filteredOperators = operators.filter(
      (operator) => operator.type === type
    );
    console.log(`Rendering ${type} cards:`, filteredOperators); // Log filtered operators

    return filteredOperators.map((operator) => {
      const profile = profiles[operator._id]; // Get the profile details
      return (
        <div
          key={operator._id}
          className="w-[320px] md:w-[350px] bg-[#ff914d] bg-opacity-5 rounded-3xl shadow-lg flex-shrink-0 transform transition duration-500 hover:scale-105 hover:shadow-2xl flex flex-col overflow-hidden"
        >
          {profile && (
            <img
              src={
                profile.companyImage ||
                (type === "hotel"
                  ? "/assets/planet.png"
                  : type === "event"
                  ? "/assets/event.png"
                  : "/assets/carrental.png")
              }
              alt={`${operator.name} Image`}
              className="w-full h-[230px] object-cover rounded-t-3xl" // Fixed size and object-fit
            />
          )}
          <div className="px-6 py-4 flex justify-between w-full items-center">
            <div>
              <h3 className="text-xl font-extrabold text-gray-800 drop-shadow-md text-left">
                {operator.name}
              </h3>
              <p className="text-left mb-2 text-sm text-gray-600 drop-shadow-md">
                {profile
                  ? profile.description
                  : `Explore more about this ${type}.`}
              </p>
            </div>
            <div className="text-3xl text-[#fccc52]">
              {type === "hotel" ? (
                <FaHotel />
              ) : type === "event" ? (
                <FaRegCalendarAlt />
              ) : (
                <FaCar />
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f9f9f9]">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <svg
              className="animate-spin h-10 w-10 text-[#ff914d]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
          <p className="text-[#fccc52] text-lg font-semibold">
            Loading, please wait...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#ffffff] min-h-screen text-[#fccc52]">
      <Header />

      <main className="pt-28 py-8">
        <div className="w-full max-w-6xl mx-auto mb-8 flex flex-wrap gap-4 justify-around lg:flex-nowrap">
          <div className="bg-gray-100 text-center p-6 rounded-3xl shadow-2xl w-full sm:w-1/3 mx-2">
            <h2 className="text-4xl font-bold mb-4 text-gray-600 drop-shadow-md ">
              Car Rental
            </h2>
            <p className="mb-4 text-gray-800 drop-shadow-md">
              Discover the comfort and convenience of our premium vehicles,
              designed to make your journey unforgettable.
            </p>
            <div className="flex justify-center mb-4">
              <span className="px-2 sm:px-1 py-2 bg-[#ff914d] bg-opacity-20 shadow-lg text-gray-600 font-bold rounded-lg mx-2">
                Luxury
              </span>
              <span className="px-3 py-2 bg-[#ff914d] bg-opacity-20 shadow-lg text-gray-600 font-bold rounded-lg mx-2">
                Sedan
              </span>
              <span className="px-2 sm:px-1 py-2 bg-[#ff914d] bg-opacity-20 shadow-lg text-gray-600 font-bold rounded-lg mx-2">
                2023
              </span>
            </div>
            <Link href="/cars">
              <button className="bg-gradient-to-r from-[#fccc52] to-[#ff914d] text-[#323232] font-md px-6 py-2 mt-4 rounded-lg drop-shadow-md shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out">
                Reserve Now
              </button>
            </Link>
          </div>
          <div className="bg-gray-100 text-center p-6 rounded-3xl shadow-2xl w-full sm:w-1/3 mx-2">
            <h2 className="text-4xl font-bold mb-4 text-gray-600 drop-shadow-md">
              Events
            </h2>
            <p className="mb-4 text-gray-800 drop-shadow-md">
              Join us for exclusive events that bring unforgettable experiences
              and lasting memories.
            </p>
            <div className="flex justify-center mb-4">
              <span className="px-3 py-2 bg-[#ff914d] bg-opacity-20 shadow-lg text-gray-600 font-bold rounded-lg mx-2">
                All Year
              </span>
              <span className="px-3 py-2 bg-[#ff914d] bg-opacity-20 shadow-lg text-gray-600 font-bold rounded-lg mx-2">
                VIP Access
              </span>
              <span className="px-3 py-2 bg-[#ff914d] bg-opacity-20 shadow-lg text-gray-600 font-bold rounded-lg mx-2">
                2024
              </span>
            </div>
            <Link href="/events">
              <button className="bg-gradient-to-r from-[#fccc52] to-[#ff914d] text-[#323232] font-md drop-shadow-md px-6 py-2 mt-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out">
                Reserve Now
              </button>
            </Link>
          </div>

          <div className="bg-gray-100 text-center p-6 rounded-3xl shadow-2xl w-full sm:w-1/3 mx-2">
            <h2 className="text-4xl font-bold mb-4 text-gray-600 drop-shadow-md">
              Hotels
            </h2>
            <p className="mb-4 text-gray-800 drop-shadow-md">
              Experience unparalleled luxury and comfort in our top-rated
              hotels, where every stay is a memorable escape.
            </p>
            <div className="flex justify-center mb-4">
              <span className="px-3 py-2 bg-[#ff914d] bg-opacity-20 shadow-lg text-gray-600 font-bold rounded-lg mx-2 px-2 flex items-center gap-2">
                4 <FaStar className="text-[#ff914d]" />
              </span>
              <span className="px-3 py-2 bg-[#ff914d] bg-opacity-20 shadow-lg text-gray-600 font-bold rounded-lg mx-2">
                Luxury
              </span>
              <span className="px-3 py-2 bg-[#ff914d] bg-opacity-20 shadow-lg text-gray-600 font-bold rounded-lg mx-2">
                2024
              </span>
            </div>
            <Link href="/hotels">
              <button className="bg-gradient-to-r from-[#fccc52] to-[#ff914d] text-[#323232] font-md drop-shadow-md px-6 py-2 mt-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out">
                Reserve Now
              </button>
            </Link>
          </div>
        </div>

        <section
          id="rentals"
          className="max-w-6xl mx-auto px-4 py-6 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#fccc52] to-[#ff914d] drop-shadow-lg transform transition duration-300 hover:scale-105 hover:text-[#ff914d]">
              Car Rentals Overview
            </h2>
          </div>
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide rounded-lg p-2 scroll-container">
            {renderCards("car")}
          </div>
        </section>

        <section id="hotels" className="max-w-6xl mx-auto px-4 py-6 rounded-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#fccc52] to-[#ff914d] drop-shadow-lg transform transition duration-300 hover:scale-105 hover:text-[#ff914d]">
              Hotels Overview
            </h2>
          </div>
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide rounded-lg p-2 scroll-container">
            {renderCards("hotel")}
          </div>
        </section>

        <section id="events" className="max-w-6xl mx-auto px-4 py-6 rounded-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#fccc52] to-[#ff914d] drop-shadow-lg transform transition duration-300 hover:scale-105 hover:text-[#ff914d]">
              Events Overview
            </h2>
          </div>
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide rounded-lg p-2 scroll-container">
            {renderCards("event")}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
