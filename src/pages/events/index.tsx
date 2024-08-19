import CartIcon from '@/components/carticon';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import { FaCalendarAlt, FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';

interface EventCompany {
  id: number;
  name: string;
  description: string;
  image: string;
  icon: ReactElement;
  rating: number;
}

export default function ChooseEventCompany() {
  const [selectedEventCompany, setSelectedEventCompany] = useState<EventCompany | null>(null);
  const router = useRouter();

  const eventCompanies: EventCompany[] = [
    { id: 1, name: 'Eventify', description: 'Creating unforgettable experiences.', image: '/assets/event.png', icon: <FaCalendarAlt />, rating: 5 },
    { id: 2, name: 'Eventura', description: 'Bringing your events to life.', image: '/assets/event.png', icon: <FaCalendarAlt />, rating: 4 },
    { id: 3, name: 'Gala Gatherings', description: 'Elegance and grandeur for your events.', image: '/assets/event.png', icon: <FaCalendarAlt />, rating: 3 },
    { id: 4, name: 'Fiesta Planners', description: 'Making every event a celebration.', image: '/assets/event.png', icon: <FaCalendarAlt />, rating: 4.5 },
    { id: 5, name: 'Celebration Experts', description: 'Your event, our expertise.', image: '/assets/event.png', icon: <FaCalendarAlt />, rating: 2 },
    { id: 6, name: 'Epic Events', description: 'Creating epic moments.', image: '/assets/event.png', icon: <FaCalendarAlt />, rating: 4.5 }
  ];

  const handleEventCompanyClick = (eventCompany: EventCompany) => {
    setSelectedEventCompany(eventCompany);
    router.push({
      pathname: '/events/details',
      query: { eventCompanyId: eventCompany.id, eventCompanyName: eventCompany.name, eventCompanyDescription: eventCompany.description, eventCompanyImage: eventCompany.image }
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
    <div className="bg-[#1a1a1a] min-h-screen text-[#ffffff]">
      <Head>
        <title>Event Booking System</title>
      </Head>
      <div className="p-4">
        <Link href="/" legacyBehavior>
          <a className="inline-flex items-center text-[#fccc52] mb-8 px-4 py-2 bg-[#323232] rounded-lg hover:bg-[#fccc52] hover:text-[#323232] transition-colors duration-300">
            <IoChevronBack className="mr-2 text-2xl" />
            <span className="font-bold text-lg"></span>
          </a>
        </Link>
      </div>
      {/* Cart Icon positioned at the top right */}
      <div className="absolute top-4 right-4">
        <CartIcon />
      </div>
        <div className="w-full max-w-7xl p-4 mx-auto">
  <div className="relative flex flex-col lg:flex-row justify-between py-4 px-6 bg-gradient-to-r from-[#1a1a1a] to-transparent rounded-lg">
    <div className="flex flex-col w-full lg:w-3/4">
      <h1 className="text-3xl lg:text-4xl font-bold mb-4">Choose Your Event Company</h1>
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
        backgroundImage: "linear-gradient(to bottom right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/assets/eventt.png')",
      }}
    />
  </div>
</div>
     
      <main className="bg-[#3d3c3f] bg-opacity-100 p-8 flex flex-col">
        <div className="flex justify-center items-center p-8">
          <div className="w-full max-w-7xl">
            <div className="flex flex-wrap justify-between gap-8">
              {eventCompanies.map((eventCompany) => (
                <div
                  key={eventCompany.id}
                  className={`w-full sm:w-[48%] lg:w-[30%] bg-[#323232] text-white rounded-xl shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 ${selectedEventCompany === eventCompany ? 'border-4 border-[#fccc52]' : ''}`}
                  onClick={() => handleEventCompanyClick(eventCompany)}
                >
                  <img src={eventCompany.image} alt={eventCompany.name} className="rounded-lg mb-4" />
                  <div className="px-4 flex justify-between w-full items-center">
                    <div>
                      <h3 className="text-lg font-bold text-gray-200 text-left">{eventCompany.name}</h3>
                      <p className="text-left mb-2 text-sm text-gray-300">{eventCompany.description}</p>
                      <div className="flex">
                        {renderStars(eventCompany.rating)}
                      </div>
                    </div>
                    <div className="text-2xl text-[#fccc52] mb-2">
                      {eventCompany.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {selectedEventCompany && (
              <div className="mt-8 text-center">
                <h2 className="text-3xl font-bold mb-4 text-[#fccc52]">{selectedEventCompany.name}</h2>
                <p className="mb-4">{selectedEventCompany.description}</p>
                <button className="bg-[#fccc52] text-[#323232] px-6 py-2 mt-4 rounded-lg">Book Now</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
