import CartIcon from '@/components/carticon';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, useState, useEffect } from 'react';
import { FaCar, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';

interface CarRental {
  id: number;
  name: string;
  description: string;
  image: string;
  icon: ReactElement;
  rating: number;
}

export default function ChooseCarRental() {
  const [selectedCarRental, setSelectedCarRental] = useState<CarRental | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const carRentals: CarRental[] = [
    { id: 1, name: 'Avis Car Rental', description: 'Reliable cars for your journey.', image: '/assets/carrental.png', icon: <FaCar />, rating: 5 },
    { id: 2, name: 'Hertz Car Rental', description: 'Experience the best cars in town.', image: '/assets/carrental.png', icon: <FaCar />, rating: 4 },
    { id: 3, name: 'Enterprise', description: 'Elegance and comfort combined.', image: '/assets/carrental.png', icon: <FaCar />, rating: 3 },
    { id: 4, name: 'Budget Car Rental', description: 'Affordable and reliable.', image: '/assets/carrental.png', icon: <FaCar />, rating: 4.5 },
    { id: 5, name: 'National Car Rental', description: 'A peaceful retreat in the mountains.', image: '/assets/carrental.png', icon: <FaCar />, rating: 2 },
    { id: 6, name: 'Alamo Rent A Car', description: 'Great cars at great prices.', image: '/assets/carrental.png', icon: <FaCar />, rating: 4.5 }
  ];

  const handleCarRentalClick = (carRental: CarRental) => {
    setSelectedCarRental(carRental);
    router.push({
      pathname: '/cars/details',
      query: { carRentalId: carRental.id, carRentalName: carRental.name, carRentalDescription: carRental.description, carRentalImage: carRental.image }
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

  if (!isMounted) {
    return null;
  }

  return (
    <div className="bg-[#ffffff] min-h-screen text-[#323232] relative">
      
      <div className="p-4">
        <Link href="/" legacyBehavior>
          <a className="inline-flex items-center bg-gradient-to-r from-[#fccc52] to-[#ff914d] text-[#323232] mb-8 px-4 py-2 bg-opacity-90 rounded-lg hover:bg-[#fccc52] hover:text-[#ffffff] transition-colors duration-300">
            <IoChevronBack className="mr-2 text-2xl" />
          </a>
        </Link>
      </div>

      {/* Cart Icon positioned at the top right */}
      <div className="absolute top-4 right-4">
        <CartIcon />
      </div>

      <div className="w-full max-w-6xl p-4 mx-auto">
        <div className="relative flex flex-col lg:flex-row justify-between py-4 px-6 rounded-lg">
          <div className="flex flex-col w-full lg:w-3/4">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#fccc52] to-[#ff914d] drop-shadow-md">Choose Your Car Rental</h1>
            <div className="flex flex-col sm:flex-row items-center mb-4">
              <input
                type="text"
                placeholder="Search"
                className="flex w-full sm:w-1/2 px-4 py-2 rounded-full bg-gray-100 border-2 border-[#fccc52] shadow-lg text-[#323232] mb-2 sm:mb-0 focus:outline-none focus:border-[#ff914d] hover:border-[#ff914d]"
              />
              <button className="sm:ml-4 px-4 py-2 bg-gradient-to-r from-[#fccc52] to-[#ff914d] font-md drop-shadow-md text-[#323232] rounded-lg transition-colors duration-300">
                Search
              </button>
            </div>
            <p className="text-lg leading-relaxed text-[#323232] drop-shadow-md">
              Find the perfect car rental for your next journey.
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center justify-end lg:absolute lg:top-0 lg:right-0 lg:w-1/2 h-64 lg:h-full rounded-lg overflow-hidden">
            <img
              src="/assets/cars.png"
              alt="Car Rental"
              className="w-1/2 h-full object-cover transform translate-x-4 scale-110"
            />
          </div>
        </div>
      </div>

      <main className="bg-[#ffffff] p-8 flex flex-col">
        <div className="flex justify-center items-center p-8">
          <div className="w-full max-w-6xl flex flex-col items-center p-4 mx-auto">
            <div className="flex flex-wrap justify-between gap-8">
              {carRentals.map((carRental) => (
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
                        {carRental.description}
                      </p>
                      <div className="flex mb-2">{renderStars(carRental.rating)}</div>
                    </div>
                    <div className="text-3xl text-[#fccc52]">
                      {carRental.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {selectedCarRental && (
              <div className="mt-8 text-center">
                <h2 className="text-3xl font-bold mb-4 text-[#fccc52]">{selectedCarRental.name}</h2>
                <p className="mb-4">{selectedCarRental.description}</p>
                <button className="bg-[#fccc52] text-[#323232] px-6 py-2 mt-4 rounded-lg">Book Now</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
