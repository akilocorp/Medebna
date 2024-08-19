import Link from 'next/link';
import { FiEdit, FiLogOut, FiPlusSquare, FiUser } from 'react-icons/fi';

const AdminSidebar = () => {
  return (
    <div className="w-64 h-screen bg-[#ffffff] text-black flex flex-col rounded-r-2xl justify-between shadow-lg">
      <div>
        <h2 className="text-2xl text-center drop-shadow-md font-bold p-4 mb-4  text-[#3f3f3f] rounded-lg">
          Admin Panel
        </h2>
        <div className='p-3'>
          <Link href='/'>
            <div className="flex items-center p-4 bg-gradient-to-r from-[#ff914d] to-[#fccc52] rounded-3xl shadow-lg">
              <div className="p-2 bg-white rounded-full">
                <FiUser className="text-[#ff914d] w-8 h-8" />
              </div>
              <div className="ml-4">
                <p className="text-white drop-shadow-md font-md">Admin</p>
                <p className="text-gray-200 drop-shadow-md">Head</p>
              </div>
            </div>
          </Link>
        </div>
        <ul className="p-4">
          <p className="text-black p-4 font-semibold drop-shadow-md">Admin</p>
          <li className="mb-2">
            <Link href="/admin/add-operator" legacyBehavior>
              <a className="hover:bg-[#ff914d] hover:text-[#ff914d] hover:bg-opacity-20 p-3 flex drop-shadow-md items-center text-black block rounded-lg transition-colors duration-300">
                <FiPlusSquare className="mr-2 flex drop-shadow-md" /> Add Operator
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/view-operators" legacyBehavior>
              <a className="hover:bg-[#ff914d] hover:text-[#ff914d] hover:bg-opacity-20 p-3 flex drop-shadow-md items-center text-black block rounded-lg transition-colors duration-300">
                <FiEdit className="mr-2 flex drop-shadow-md" /> View Operators
              </a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="p-4">
        <div className="relative w-full h-44 mb-4">
          <img src="/assets/illustration.png" alt="Illustration" className="w-full drop-shadow-md h-full object-contain" />
        </div>
        <p className="text-center text-black drop-shadow-md font-bold">👋 Welcome, Admin</p>
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

export default AdminSidebar;
