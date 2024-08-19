import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiLogOut, FiUser, FiPlusSquare, FiEdit } from 'react-icons/fi';

const OperatorSidebar = () => {
  const [userType, setUserType] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserType = localStorage.getItem('userType');
      const storedUserName = localStorage.getItem('userName');
      setUserType(storedUserType);
      setUserName(storedUserName);
    }
  }, []);

  if (!userType) {
    return <p>Loading...</p>;
  }

  const getRoleTitle = (userType: string | null) => {
    switch (userType) {
      case 'car':
        return 'Car Rental Admin';
      case 'event':
        return 'Event Booking Admin';
      case 'hotel':
        return 'Hotel Booking Admin';
      case 'admin':
        return 'Admin';
      default:
        return 'Operator';
    }
  };

  const myprofile = `/${userType}/myprofile`;
  const profile = `/${userType}/profile`;
  const addListingPath = `/${userType}/Add-Listing-Form`;
  const viewListingsPath = `/${userType}/View-Listings`;

  return (
    <div className="w-64 h-screen bg-[#ffffff] text-black flex flex-col rounded-r-2xl justify-between shadow-lg">
      <div>
        <h2 className="text-2xl text-center drop-shadow-md font-bold p-4 mb-4 text-[#3f3f3f] rounded-lg">
          Operator Panel
        </h2>
        <div className='p-3'>
          <Link href='/'>
            <div className="flex items-center p-4 bg-gradient-to-r from-[#ff914d] to-[#fccc52] rounded-3xl shadow-lg">
              <div className="p-2 bg-white rounded-full">
                <FiUser className="text-[#ff914d] w-8 h-8" />
              </div>
              <div className="ml-4">
                <p className="text-white drop-shadow-md font-md">{userName || 'Operator'}</p>
                <p className="text-gray-200 drop-shadow-md text-xs">{getRoleTitle(userType)}</p>
              </div>
            </div>
          </Link>
        </div>
        <div className='p-3 flex flex-col items-center gap-4'>
          <Link href={profile} legacyBehavior>
            <a className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:bg-[#fccc52] bg-opacity-90 px-4 py-2 hover:text-gray-700 font-semibold shadow-lg block rounded-lg flex items-center transition-all duration-300 ease-in-out transform hover:scale-105 max-w-xs">
              Add Profile
            </a>
          </Link>
        </div>
        <ul className="p-4">
          <p className="text-black p-4 font-semibold drop-shadow-md">Operator</p>
          <li className="mb-2">
            <Link href={myprofile} legacyBehavior>
              <a className="hover:bg-[#ff914d] hover:text-[#ff914d] hover:bg-opacity-20 p-3 flex drop-shadow-md items-center text-black block rounded-lg transition-colors duration-300">
                <FiUser className="mr-2 flex drop-shadow-md" /> My Profile
              </a>
            </Link>
          </li>
          <li className="mb-2">
            <Link href={addListingPath} legacyBehavior>
              <a className="hover:bg-[#ff914d] hover:text-[#ff914d] hover:bg-opacity-20 p-3 flex drop-shadow-md items-center text-black block rounded-lg transition-colors duration-300">
                <FiPlusSquare className="mr-2 flex drop-shadow-md" /> Add Listing
              </a>
            </Link>
          </li>
          <li>
            <Link href={viewListingsPath} legacyBehavior>
              <a className="hover:bg-[#ff914d] hover:text-[#ff914d] hover:bg-opacity-20 p-3 flex drop-shadow-md items-center text-black block rounded-lg transition-colors duration-300">
                <FiEdit className="mr-2 flex drop-shadow-md" /> View Listings
              </a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="p-4">
        <div className="relative w-full h-44 mb-4">
          <img src="/assets/illustration.png" alt="Illustration" className="w-full drop-shadow-md h-full object-contain" />
        </div>
        <p className="text-center text-black drop-shadow-md font-bold">👋 Welcome, {userName || 'Operator'}</p>
      </div>
      <div className="mt-2 w-full">
        <Link href="/" legacyBehavior>
          <a className="text-black hover:text-[#ff194d] drop-shadow-md font-md px-4 py-2 rounded flex items-center transition-colors duration-300">
            <FiLogOut className="mr-2 drop-shadow-md font-md" /> Logout
          </a>
        </Link>
      </div>
      <div className="mt-2 w-full">
        <Link href="/" legacyBehavior>
          <a className=" text-black hover:text-[#ff194d] drop-shadow-md font-md px-4 py-2 rounded flex items-center transition-colors duration-300">
            <FiLogOut className="mr-2 drop-shadow-md font-md" /> Logout
          </a>
        </Link>
      </div>
    </div>
  );
};

export default OperatorSidebar;
