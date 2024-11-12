import CartIcon from '@/components/carticon';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, ReactElement } from 'react';
import { FaCar, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { fetchCarOwnerProfile } from '@/stores/operator/carprofileapicaller'; 
import { getHotels } from '@/stores/admin/ApiCallerAdmin'; 
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/map'), { ssr: false });

interface CarRental {
  id: string;
  name: string;
  description?: string;
  image?: string;
  icon: ReactElement;
  city: string;
  rating?: number;
  address?: string;
}

export default function ChooseCarRental() {
  const [carRentals, setCarRentals] = useState<CarRental[]>([]);
  const [filteredCarRentals, setFilteredCarRentals] = useState<CarRental[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCarRentals = async () => {
      try {
        const operators = await getHotels();
        const carRentalPromises = operators
          .filter((operator) => operator.type === 'car') 
          .map(async (carOperator) => {
            const profile = await fetchCarOwnerProfile(carOperator._id);
            if (profile) {
              return {
                id: carOperator._id,
                name: carOperator.name,
                description: profile.description || 'No description available.',
                image: profile.companyImage || '/assets/default-car.png',
                icon: <FaCar />,
                rating: profile.rating || 0,
                address: profile.address || 'Address not available',
                city: profile.city || 'City not available',
              };
            }
            return {
              id: carOperator._id,
              name: carOperator.name,
              description: 'No description available.',
              image: '/assets/default-car.png',
              icon: <FaCar />,
              rating: 0,
              address: 'Address not available',
              city: 'City not available',
            };
          });

        const carRentals = await Promise.all(carRentalPromises);
        setCarRentals(carRentals.filter(e => e !== null));
        setFilteredCarRentals(carRentals.filter(e => e !== null));
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };

    fetchCarRentals();
  }, []);

  useEffect(() => {
    const results = carRentals.filter(carRental =>
      carRental.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carRental.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carRental.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCarRentals(results);
  }, [searchTerm, carRentals]);

  const handleCarRentalClick = (carRental: CarRental) => {
    router.push({
      pathname: '/cars/details',
      query: {
        carId: carRental.id,
        rentalName: carRental.name,
      },
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-[#ff914d]" />);
      } else if (i - 0.5 === rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-[#ff914d]" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-[#ff914d]" />);
      }
    }
    return stars;
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
          <p className="text-[#fccc52] text-lg font-semibold">Loading, please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#ffffff] min-h-screen text-[#323232] relative overflow-hidden">
      <div className="p-4">
        <Link href="/" legacyBehavior>
          <a className="inline-flex items-center bg-gradient-to-r from-[#fccc52] to-[#ff914d] text-[#323232] mb-8 px-4 py-2 bg-opacity-90 rounded-lg hover:bg-[#fccc52] hover:text-[#ffffff] transition-colors duration-300">
            <IoChevronBack className="mr-2 text-2xl" />
          </a>
        </Link>
      </div>

      <div className="absolute top-4 right-4">
        <CartIcon />
      </div>

      <div className="w-full max-w-8xl p-4 flex flex-col items-center">
        <div className="flex flex-col items-center text-center py-4 px-2">
          <h1 className="text-3xl mb-8 lg:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#fccc52] to-[#ff914d] drop-shadow-md">
            Choose Your Car Rental
          </h1>
          <div className="flex items-center mb-8 w-full max-w-md">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-4 py-2 rounded-full bg-gray-100 border-2 border-[#fccc52] shadow-lg text-[#323232] focus:outline-none focus:border-[#ff914d] hover:border-[#ff914d]"
            />
            <button className="ml-4 px-4 py-2 bg-gradient-to-r from-[#fccc52] to-[#ff914d] font-md drop-shadow-md text-[#323232] rounded-lg transition-colors duration-300">
              Search
            </button>
          </div>
          <p className="text-lg leading-relaxed text-[#323232] drop-shadow-md">
            Find the perfect car rental for your next journey.
          </p>
        </div>
      </div>

      <main className="bg-[#ffffff] p-8 flex flex-col">
        <div className="flex justify-center items-center p-8">
          <div className="w-full max-w-6xl flex flex-col items-center p-4 mx-auto">
            <div className="flex flex-wrap justify-between gap-8">
              {filteredCarRentals.map((carRental) => (
                <div
                  key={carRental.id}
                  className="w-[320px] md:w-[350px] bg-[#ff914d] bg-opacity-5 rounded-3xl shadow-lg flex-shrink-0 transform transition duration-500 hover:scale-105 hover:shadow-2xl flex flex-col overflow-hidden cursor-pointer"
                  onClick={() => handleCarRentalClick(carRental)}
                >
                  <div className="w-full h-48 bg-gray-300 rounded-t-3xl overflow-hidden mb-4">
                    <img
                      src={carRental.image}
                      alt={carRental.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="px-6 py-4 flex justify-between w-full items-center">
                    <div>
                      <h3 className="text-xl font-extrabold text-gray-800 drop-shadow-md text-left">
                        {carRental.name}
                      </h3>
                      <p className="text-left mb-2 text-sm text-gray-600 drop-shadow-md">
                        {carRental.city}, {carRental.address ?? 'Address not available'}
                      </p>
                      <div className="flex mb-2">{renderStars(carRental.rating ?? 0)}</div>
                    </div>
                    <div className="text-3xl text-[#fccc52]">
                      {carRental.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Car Icons */}
      {Array.from({ length: 10 }).map((_, index) => (
        <motion.div
          key={`calendar-${index}`}
          className="absolute text-6xl opacity-20"
          style={{
            color: "#ff914d", // Lighter color for calendar icons
            top: `${Math.random() * 100}vh`,
            left: `${Math.random() * 100}vw`,
          }}
          animate={{
            y: ["0%", "10%", "0%"],
            x: ["0%", "-10%", "10%", "0%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        >
          <FaCar />
        </motion.div>
      ))}
       {Array.from({ length: 10 }).map((_, index) => (
        <motion.div
          key={`calendar-${index}`}
          className="absolute text-6xl opacity-20"
          style={{
            color: "#ff914d", // Lighter color for calendar icons
            top: `${Math.random() * 100}vh`,
            left: `${Math.random() * 100}vw`,
          }}
          animate={{
            y: ["0%", "10%", "0%"],
            x: ["0%", "-10%", "10%", "0%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        >
          <FaCar />
        </motion.div>
      ))}
    </div>
  );
}