import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#ff914d] bg-opacity-5 drop-shadow-md text-gray-600 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">About Us</h2>
            <p className="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam efficitur.
            </p>
          </div>
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Quick Links</h2>
            <ul className="text-sm space-y-2">
              <li><Link href="#events">Events</Link></li>
              <li><Link href="#hotels">Hotels</Link></li>
              <li><Link href="#rentals">Car Rental</Link></li>
              
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h2 className="text-2xl font-bold mb-2">Follow Us</h2>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className=" text-[#fccc52] transition duration-300"><FaFacebook size={24} /></a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className=" text-[#fccc52] transition duration-300"><FaTwitter size={24} /></a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className=" text-[#fccc52] transition duration-300"><FaInstagram size={24} /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-sm text-center border-t border-gray-400 shadow-t-lg pt-4">
          &copy; 2024 Medebna. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
