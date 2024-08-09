import Link from 'next/link';
import { FiLogOut, FiUser, FiPlusSquare, FiEdit } from 'react-icons/fi';

const OperatorSidebar = () => {
  return (
    <div className="w-64 h-screen bg-[#1a1a1a] bg-opacity-80 text-white flex flex-col justify-between">
      <div>
        <h2 className="text-2xl text-center font-bold p-4 mb-4">Operator Panel</h2>
        <div className='p-3'>
          <Link href='/'>
            <div className="flex items-center p-4 bg-[#323232] rounded-3xl shadow-2xl rounded-lg">
              <div className="p-2 bg-[#fccc52] rounded-full">
                <FiUser className="text-[#1a1a1a] w-8 h-8" />
              </div>
              <div className="ml-4">
                <p className="text-white font-semibold">Operator</p>
                <p className="text-gray-400">Listings Manager</p>
              </div>
            </div>
          </Link>
        </div>
        <ul className="p-4 mb-20">
          <p className="text-white p-4 font-semibold">Operator</p>
          <li className="mb-2">
            <Link href="/operator/Add-Listing-Form" legacyBehavior>
              <a className="hover:bg-[#fccc52] hover:bg-opacity-20 p-3 text-gray-400 block rounded-lg flex items-center">
                <FiPlusSquare className="mr-2" /> Add Listing
              </a>
            </Link>
          </li>
          <li>
            <Link href="/operator/View-Listings" legacyBehavior>
              <a className="hover:bg-[#fccc52] hover:bg-opacity-20 p-3 text-gray-400 block rounded-lg flex items-center">
                <FiEdit className="mr-2" /> View Listings
              </a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="p-4">
        <div className="relative w-full h-44 mb-4">
          <img src="/assets/illustration.png" alt="Illustration" className="w-full h-full object-contain" />
        </div>
        <p className="text-center text-gray-400 ">Hi, Operator</p>
      </div>
      <div className="mt-2 w-full">
      <Link href="/" legacyBehavior>
          <a className="hover:text-[#fccc52] hover:text-white text-gray-300 px-4 py-2 rounded flex items-center ">
            <FiLogOut className="mr-2" /> Logout
          </a>
        </Link>
      </div>
    </div>
  );
};

export default OperatorSidebar;
