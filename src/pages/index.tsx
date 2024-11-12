import { useEffect, useState } from "react";
import Link from "next/link";
import { FaRegCalendarAlt, FaHotel, FaCar, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
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
  const [profiles, setProfiles] = useState<
    Record<string, HotelProfile | CarOwnerProfile | EventOwnerProfile>
  >({});

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const operatorData = await getHotels();

        setOperators(operatorData);

        // Fetch profiles for each operator
        const profileData: Record<
          string,
          HotelProfile | CarOwnerProfile | EventOwnerProfile
        > = {};
        for (const operator of operatorData) {
          let profile = null;

          if (operator.type === "hotel") {
            const hotelResponse = await fetchHotelOwnerProfiles(operator._id);
            if (hotelResponse?.data?.hotelProfile) {
              profile = hotelResponse.data.hotelProfile;
            }
          } else if (operator.type === "car") {
            const carResponse = await fetchCarOwnerProfile(operator._id);
            if (carResponse) {
              profile = carResponse; // Directly assign as CarOwnerProfile has no data wrapping
            }
          } else if (operator.type === "event") {
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
      } finally {
        setLoading(false);
      }
    };

    fetchOperators();
  }, []);

  const renderCards = (type: "hotel" | "event" | "car") => {
    if (!operators || operators.length === 0) {
      return <div className="text-white">No operators available</div>;
    }

    const filteredOperators = operators.filter(
      (operator) => operator.type === type
    );

    return filteredOperators.map((operator, index) => {
      const profile = profiles[operator._id];
      return (
        <motion.div
          key={operator._id}
          className="w-[320px] md:w-[350px] bg-[#ff914d] bg-opacity-5 rounded-3xl shadow-lg flex-shrink-0 flex flex-col overflow-hidden"
          whileHover={{ scale: 1.05, rotate: 1 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2, duration: 1.5 }}
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
              className="w-full h-[230px] object-cover rounded-t-3xl"
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
        </motion.div>
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
    <motion.div
      className="bg-[#ffffff] min-h-screen text-[#fccc52] overflow-hidden relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <Header />

      {/* Animated Background Elements with Icons */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        {Array.from({ length: 20 }).map((_, index) => {
          const size = Math.floor(Math.random() * 60) + 30; // Reduce size for a cleaner look
          const positionTop = Math.floor(Math.random() * 100);
          const positionLeft = Math.floor(Math.random() * 100);
          const duration = Math.random() * 10 + 5;
          const delay = Math.random() * 5;

          const iconType =
            index % 3 === 0 ? "car" : index % 3 === 1 ? "event" : "hotel";
          const IconComponent =
            iconType === "car"
              ? FaCar
              : iconType === "event"
              ? FaRegCalendarAlt
              : FaHotel;

          return (
            <motion.div
              key={index}
              className="absolute"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${positionTop}%`,
                left: `${positionLeft}%`,
              }}
              animate={{
                y: [0, -15, 0],
                x: [0, -5, 0],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay,
              }}
            >
              <IconComponent
                className="text-[#ff914d] opacity-20"
                style={{
                  fontSize: `${size}px`,
                }}
              />
            </motion.div>
          );
        })}
      </div>

      <main className="pt-28 py-8 relative">
        <motion.div
          className="w-full max-w-6xl mx-auto mb-8 flex flex-wrap gap-4 justify-around lg:flex-nowrap"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 1.5, staggerChildren: 0.3 },
            },
          }}
        >
          {/* Hotels Card */}
          <motion.div
            className="bg-gray-100 text-center p-6 text-gray-600 hover:text-white hover:shadow-[0_10px_25px_rgba(255,145,77,0.5)] hover:scale-105 hover:bg-gradient-to-r hover:from-[#ff914d] hover:to-[#fccc52] rounded-3xl shadow-2xl w-full sm:w-1/3 mx-2"
            whileHover={{ scale: 1.05 }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <h2 className="text-4xl font-bold mb-4 drop-shadow-md">Hotels</h2>
            <p className="mb-4 drop-shadow-md">
              Experience unparalleled luxury and comfort in our top-rated
              hotels, where every stay is a memorable escape.
            </p>
            <div className="flex justify-center mb-4">
              <span className="px-3 py-2 bg-[#ff914d] bg-opacity-20 shadow-lg font-bold rounded-lg mx-2 flex items-center gap-2">
                4 <FaStar className="text-yellow-400" />
              </span>
              <span className="px-3 py-2 bg-[#ff914d] bg-opacity-20 shadow-lg font-bold rounded-lg mx-2">
                Luxury
              </span>
              <span className="px-3 py-2 bg-[#ff914d] bg-opacity-20 shadow-lg font-bold rounded-lg mx-2">
                2024
              </span>
            </div>
            <Link href="/hotels">
              <motion.button
                className="bg-gradient-to-r from-[#fccc52] to-[#ff914d] text-[#323232] font-md drop-shadow-md px-6 py-2 mt-4 rounded-lg shadow-lg"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                Reserve Now
              </motion.button>
            </Link>
          </motion.div>

          {/* Car Rental Card */}
          <motion.div
            className="bg-gray-100 text-center p-6 text-gray-600 hover:text-white hover:shadow-[0_10px_25px_rgba(255,145,77,0.5)] hover:scale-105 hover:bg-gradient-to-r hover:from-[#ff914d] hover:to-[#fccc52] rounded-3xl shadow-2xl w-full sm:w-1/3 mx-2"
            whileHover={{ scale: 1.05 }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <h2 className="text-4xl font-bold mb-4 drop-shadow-md">
              Car Rental
            </h2>
            <p className="mb-4 drop-shadow-md">
              Discover the comfort and convenience of our premium vehicles,
              designed to make your journey unforgettable.
            </p>
            <div className="flex justify-center mb-4">
              <span className="px-2 sm:px-1 py-2 bg-[#ff914d] bg-opacity-20 shadow-lg font-bold rounded-lg mx-2">
                Luxury
              </span>
              <span className="px-3 py-2 bg-[#ff914d] bg-opacity-20 shadow-lg font-bold rounded-lg mx-2">
                Sedan
              </span>
              <span className="px-2 sm:px-1 py-2 bg-[#ff914d] bg-opacity-20 shadow-lg font-bold rounded-lg mx-2">
                2023
              </span>
            </div>
            <Link href="/cars">
              <motion.button
                className="bg-gradient-to-r from-[#fccc52] to-[#ff914d] text-[#323232] font-md px-6 py-2 mt-4 rounded-lg drop-shadow-md shadow-lg"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                Reserve Now
              </motion.button>
            </Link>
          </motion.div>

          {/* Events Card */}
          <motion.div
            className="bg-gray-100 text-center p-6 text-gray-600 hover:text-white hover:shadow-[0_10px_25px_rgba(255,145,77,0.5)] hover:scale-105 hover:bg-gradient-to-r hover:from-[#ff914d] hover:to-[#fccc52] rounded-3xl shadow-2xl w-full sm:w-1/3 mx-2"
            whileHover={{ scale: 1.05 }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <h2 className="text-4xl font-bold mb-4 drop-shadow-md">Events</h2>
            <p className="mb-4 drop-shadow-md">
              Join us for exclusive events that bring unforgettable experiences
              and lasting memories.
            </p>
            <div className="flex justify-center mb-4">
              <span className="px-3 py-2 bg-[#ff914d] bg-opacity-20 shadow-lg font-bold rounded-lg mx-2">
                All Year
              </span>
              <span className="px-3 py-2 bg-[#ff914d] bg-opacity-20 shadow-lg font-bold rounded-lg mx-2">
                VIP Access
              </span>
              <span className="px-3 py-2 bg-[#ff914d] bg-opacity-20 shadow-lg font-bold rounded-lg mx-2">
                2024
              </span>
            </div>
            <Link href="/events">
              <motion.button
                className="bg-gradient-to-r from-[#fccc52] to-[#ff914d] text-[#323232] font-md drop-shadow-md px-6 py-2 mt-4 rounded-lg shadow-lg"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                Reserve Now
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Hotels Overview */}
        <section id="hotels" className="max-w-6xl mx-auto px-4 py-6 rounded-lg">
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5 }}
          >
            <h2 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#fccc52] to-[#ff914d] drop-shadow-lg">
              Hotels Overview
            </h2>
          </motion.div>
          <motion.div
            className="flex space-x-4 overflow-x-auto scrollbar-hide rounded-lg p-2"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.3,
                },
              },
            }}
          >
            {renderCards("hotel")}
          </motion.div>
        </section>
        {/* Car Rentals Overview */}
        <section
          id="rentals"
          className="max-w-6xl mx-auto px-4 py-6 rounded-lg"
        >
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5 }}
          >
            <h2 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#fccc52] to-[#ff914d] drop-shadow-lg">
              Car Rentals Overview
            </h2>
          </motion.div>
          <motion.div
            className="flex space-x-4 overflow-x-auto scrollbar-hide rounded-lg p-2"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.3,
                },
              },
            }}
          >
            {renderCards("car")}
          </motion.div>
        </section>

        {/* Events Overview */}
        <section id="events" className="max-w-6xl mx-auto px-4 py-6 rounded-lg">
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5 }}
          >
            <h2 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#fccc52] to-[#ff914d] drop-shadow-lg">
              Events Overview
            </h2>
          </motion.div>
          <motion.div
            className="flex space-x-4 overflow-x-auto scrollbar-hide rounded-lg p-2"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.3,
                },
              },
            }}
          >
            {renderCards("event")}
          </motion.div>
        </section>
      </main>
      <Footer />
    </motion.div>
  );
}
