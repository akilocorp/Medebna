import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import { FaHotel, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';

interface Hotel {
  id: number;
  name: string;
  description: string;
  image: string;
  icon: ReactElement;
  rating: number;
}

export default function ChooseHotel() {
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const router = useRouter();

  const hotels: Hotel[] = [
    { id: 1, name: 'Planet Hotel', description: 'A luxurious stay in the heart of the city.', image: '/assets/planet.png', icon: <FaHotel />, rating: 5 },
    { id: 2, name: 'Skyline Hotel', description: 'Experience the best view in town.', image: '/assets/planet.png', icon: <FaHotel />, rating: 4 },
    { id: 3, name: 'Grand Palace', description: 'Elegance and comfort combined.', image: '/assets/planet.png', icon: <FaHotel />, rating: 3 },
    { id: 4, name: 'Seaside Resort', description: 'Relax by the beach.', image: '/assets/planet.png', icon: <FaHotel />, rating: 4.5 },
    { id: 5, name: 'Mountain Lodge', description: 'A peaceful retreat in the mountains.', image: '/assets/planet.png', icon: <FaHotel />, rating: 2 },
    { id: 6, name: 'Mountain Lodge', description: 'A peaceful retreat in the mountains.', image: '/assets/planet.png', icon: <FaHotel />, rating: 4.5 }
  ];

  const handleHotelClick = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    router.push({
      pathname: '/hotels/details',
      query: { hotelId: hotel.id, hotelName: hotel.name, hotelDescription: hotel.description, hotelImage: hotel.image }
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

  return (
    <div className="bg-[#1a1a1a]  min-h-screen text-[#ffffff]">
      <Head>
        <title>Booking System</title>
      </Head>
      <div className="p-4">
        <Link href="/" legacyBehavior>
          <a className="inline-flex items-center text-[#fccc52] mb-8 px-4 py-2 bg-[#3d3c3f] bg-opacity-90 rounded-lg hover:bg-[#fccc52] hover:text-[#323232] transition-colors duration-300">
            <IoChevronBack className="mr-2 text-2xl" />
            <span className="font-bold text-lg"></span>
          </a>
        </Link>
      </div>
      <div className="w-full max-w-8xl p-4 mx-auto">
        <div className="relative flex justify-between py-4 px-10 bg-gradient-to-r from-[#1a1a1a] to-transparent">
          <div className="flex flex-col w-3/4">
            <h1 className="text-4xl font-bold mb-8">Choose Your Hotel</h1>
            <div className="flex items-center mb-8">
              <input type="text" placeholder="Search" className="flex w-1/2 px-4 py-2 rounded-lg bg-[#fccc52] bg-opacity-30 text-gray-500" />
              <button className="ml-4 px-4 py-2 rounded-lg bg-[#323232] text-[#fccc52]">Search</button>
            </div>
            <p className="text-lg text-gray-500 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam efficitur.</p>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-cover bg-center rounded-lg"
            style={{
              backgroundImage: "linear-gradient(to bottom right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/assets/sheraton.png')",
            }}
          />
        </div>
      </div>
      <main className="bg-[#3d3c3f] bg-opacity-100 p-8 flex flex-col">
        <div className="flex justify-center items-center p-8">
          <div className="w-full max-w-7xl">
            <div className="flex flex-wrap justify-between gap-8">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className={`w-full sm:w-[48%] lg:w-[30%] bg-[#323232] text-white rounded-xl shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 ${selectedHotel === hotel ? 'border-4 border-[#fccc52]' : ''}`}
                  onClick={() => handleHotelClick(hotel)}
                >
                  <img src={hotel.image} alt={hotel.name} className="rounded-lg mb-4" />
                  <div className="px-4 flex justify-between w-full items-center">
                    <div>
                      <h3 className="text-lg font-bold text-gray-200 text-left">{hotel.name}</h3>
                      <p className="text-left mb-2 text-sm text-gray-300">{hotel.description}</p>
                      <div className="flex mb-2">
                        {renderStars(hotel.rating)}
                      </div>
                    </div>
                    <div className="text-2xl text-[#fccc52] mb-2">
                      {hotel.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
           
          </div>
        </div>
      </main>
    </div>
  );
}
