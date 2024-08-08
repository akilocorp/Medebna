import Header from '@/components/header';
import Head from 'next/head';
import { useEffect } from 'react';
import Footer from '@/components/footer';
import Link from 'next/link';
import { FaRegCalendarAlt, FaHotel, FaCar } from 'react-icons/fa';

export default function Home() {
  useEffect(() => {
    const scrollContainers = document.querySelectorAll('.scroll-container');
    const timers: NodeJS.Timeout[] = [];

    scrollContainers.forEach(container => {
      let scrollAmount = 0;
      const containerWidth = container.scrollWidth;

      const slide = () => {
        container.scrollLeft += 2; // Increase the scroll increment
        scrollAmount += 2;
        if (scrollAmount >= containerWidth - container.clientWidth) {
          container.scrollLeft = 0;
          scrollAmount = 0;
        }
      };

      const slideTimer = setInterval(slide, 20); // Adjust the interval timing as needed
      timers.push(slideTimer);
    });

    return () => {
      timers.forEach(timer => clearInterval(timer));
    };
  }, []);

  const renderCards = (type: 'event' | 'hotel' | 'rental') => {
    const items = [];
    for (let i = 0; i < 7; i++) {
      items.push(
        <div
          key={i}
          className="min-w-[300px] bg-[#323232] text-white rounded-2xl shadow-lg flex-shrink-0 transform transition duration-500 hover:scale-105 hover:shadow-2xl flex flex-col"
        >
          <img
            src={type === 'event' ? '/assets/event.png' : type === 'hotel' ? '/assets/planet.png' : '/assets/carrental.png'}
            alt={`${type.charAt(0).toUpperCase() + type.slice(1)} Image`}
            width={300}
            height={180}
            className="rounded-t-2xl mb-4"
          />
          <div className="px-4 flex justify-between w-full items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-200 text-left">{type === 'event' ? 'Mekelle Special' : type === 'hotel' ? 'Planet Hotel' : 'KK-Mekelle'}</h3>
              <p className="text-left mb-2 text-sm text-gray-300">Description of the {type}.</p>
            </div>
            <div className="text-2xl text-[#fccc52] mb-2">
              {type === 'event' ? <FaRegCalendarAlt /> : type === 'hotel' ? <FaHotel /> : <FaCar />}
            </div>
          </div>
        </div>
      );
    }
    return items;
  };
  

  return (
    <div className="bg-[#1a1a1a] bg-opacity-80 min-h-screen text-[#ffffff]">
      <Head>
        <title>Booking System</title>
      </Head>

      <Header />

      <main className="pt-28 py-8"> {/* Adjusted top padding to account for fixed header */}
        <div className="w-full max-w-6xl mx-auto mb-8 flex gap-4 justify-around">
        <div className="bg-[#323232] text-center p-6 rounded-3xl shadow-2xl w-1/3 mx-2">
            <h2 className="text-4xl font-bold mb-4 text-[#ffffff]">Car Rental</h2>
            <p className="mb-4 text-[#ffffff]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam efficitur.</p>
            <div className="flex justify-center mb-4">
              <span className="px-4 py-2 bg-[#5a5a5a] text-[#ffffff] rounded-lg mx-2">Automatic</span>
              <span className="px-4 py-2 bg-[#5a5a5a] text-[#ffffff] rounded-lg mx-2">SUV</span>
              <span className="px-4 py-2 bg-[#5a5a5a] text-[#ffffff] rounded-lg mx-2">2024</span>
            </div>
            <Link href = '/cars'><button className="bg-[#fccc52] text-[#323232] px-6 py-2 mt-4 rounded-lg">Book</button></Link>
          </div>
          <div className="bg-[#323232] text-center p-6 rounded-3xl shadow-2xl w-1/3 mx-2">
            <h2 className="text-4xl font-bold mb-4 text-[#ffffff]">Events</h2>
            <p className="mb-4 text-[#ffffff]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam efficitur.</p>
            <div className="flex justify-center mb-4">
              <span className="px-4 py-2 bg-[#5a5a5a] text-[#ffffff] rounded-lg mx-2">365</span>
              <span className="px-4 py-2 bg-[#5a5a5a] text-[#ffffff] rounded-lg mx-2">VIP</span>
              <span className="px-4 py-2 bg-[#5a5a5a] text-[#ffffff] rounded-lg mx-2">2024</span>
            </div>
            <Link href = '/events'><button className="bg-[#fccc52] text-[#323232] px-6 py-2 mt-4 rounded-lg">Book</button></Link>
          </div>

          <div className="bg-[#323232] text-center p-6 rounded-3xl shadow-2xl w-1/3 mx-2">
            <h2 className="text-4xl font-bold mb-4 text-[#ffffff]">Hotels</h2>
            <p className="mb-4 text-[#ffffff]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam efficitur.</p>
            <div className="flex justify-center mb-4">
              <span className="px-4 py-2 bg-[#5a5a5a] text-[#ffffff] rounded-lg mx-2">4 Stars</span>
              <span className="px-4 py-2 bg-[#5a5a5a] text-[#ffffff] rounded-lg mx-2">Luxury</span>
              <span className="px-4 py-2 bg-[#5a5a5a] text-[#ffffff] rounded-lg mx-2">2024</span>
            </div>
            <Link href = '/hotels'><button className="bg-[#fccc52] text-[#323232] px-6 py-2 mt-4 rounded-lg">Book</button></Link>
          </div>

          
        </div>
        <section id="rentals" className="max-w-6xl mx-auto px-4 py-6 rounded-lg">
        <div className='flex items-center justify-between'>
          <h2 className="text-3xl font-bold mb-4 drop-shadow-md">Car Rentals</h2>
          <Link href = '/cars'><button className="bg-[#fccc52] text-[#323232] px-6 py-2 mt-4 rounded-lg">Book</button></Link>
        </div>

          <div className="flex space-x-4 overflow-x-auto scrollbar-hide rounded-lg p-2 scroll-container">
            {renderCards('rental')}
          </div>
        </section>

       

        <section id="hotels" className="max-w-6xl mx-auto px-4 py-6 rounded-lg">
          <div className='flex items-center justify-between '>
          <h2 className="text-3xl font-bold mb-4 drop-shadow-md">Hotels</h2>
          <Link href = '/hotels'><button className="bg-[#fccc52] text-[#323232] px-6 py-2 mt-4 rounded-lg">Book</button></Link>
          </div>
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide rounded-lg p-2 scroll-container">
            {renderCards('hotel')}
          </div>
        </section>

        <section id="events" className="max-w-6xl mx-auto px-4 py-6 rounded-lg">
          <div className='flex items-center justify-between'>
          <h2 className="text-3xl font-bold mb-4 drop-shadow-md">Events</h2>
          <Link href = '/event'><button className="bg-[#fccc52] text-[#323232] px-6 py-2 mt-4 rounded-lg">Book</button></Link>
          </div>
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide rounded-lg p-2 scroll-container">
            {renderCards('event')}
          </div>
        </section>
        
      </main>
      <Footer />
    </div>
  );
}
