import Head from 'next/head';
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
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i - 0.5 === rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500" />);
      }
    }
    return stars;
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="bg-[#1a1a1a] min-h-screen text-[#ffffff]">
      <Head>
        <title>Booking System</title>
      </Head>
      <div className="p-4">
        <Link href="/" legacyBehavior>
          <a className="inline-flex items-center text-[#fccc52] mb-8 px-4 py-2 bg-[#323232] rounded-lg hover:bg-[#fccc52] hover:text-[#323232] transition-colors duration-300">
            <IoChevronBack className="mr-2 text-2xl" />
            <span className="font-bold text-lg"></span>
          </a>
        </Link>
      </div>
      <div className="w-full max-w-7xl p-4 mx-auto">
  <div className="relative flex flex-col lg:flex-row justify-between py-4 px-6 bg-gradient-to-r from-[#1a1a1a] to-transparent rounded-lg">
    <div className="flex flex-col w-full lg:w-3/4">
      <h1 className="text-3xl lg:text-4xl font-bold mb-4">Choose Your Car Rental</h1>
      <div className="flex flex-col sm:flex-row items-center mb-4">
        <input
          type="text"
          placeholder="Search"
          className="flex w-full sm:w-1/2 px-4 py-2 rounded-lg bg-[#fccc52] bg-opacity-30 text-gray-500 mb-2 sm:mb-0"
        />
        <button className="sm:ml-4 px-4 py-2 rounded-lg bg-[#323232] text-[#fccc52]">
          Search
        </button>
      </div>
      <p className="text-lg leading-relaxed">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
        efficitur.
      </p>
    </div>
    <div
      className="mt-4 lg:mt-0 lg:absolute lg:top-0 lg:right-0 lg:w-1/2 h-64 lg:h-full bg-cover bg-center rounded-lg"
      style={{
        backgroundImage:
          "linear-gradient(to bottom right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/assets/cars.png')",
      }}
    />
  </div>
</div>
      <main className="bg-[#3d3c3f] bg-opacity-100 p-8 flex flex-col">
        <div className="flex justify-center items-center p-8">
          <div className="w-full max-w-7xl">
            <div className="flex flex-wrap justify-between gap-8">
              {carRentals.map((carRental) => (
                <div
                  key={carRental.id}
                  className={`w-full sm:w-[48%] lg:w-[30%] bg-[#323232] text-white rounded-xl shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 ${selectedCarRental === carRental ? 'border-4 border-[#fccc52]' : ''}`}
                  onClick={() => handleCarRentalClick(carRental)}
                >
                  <img src={carRental.image} alt={carRental.name} className="rounded-lg mb-4" />
                  <div className="px-4 flex justify-between w-full items-center">
                    <div>
                      <h3 className="text-lg font-bold text-gray-200 text-left">{carRental.name}</h3>
                      <p className="text-left mb-2 text-sm text-gray-300">{carRental.description}</p>
                      <div className="flex">
                        {renderStars(carRental.rating)}
                      </div>
                    </div>
                    <div className="text-2xl text-[#fccc52] mb-2">
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
