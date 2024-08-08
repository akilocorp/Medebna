import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { signIn, SignInFormData } from '@/stores/auth/ApiCallerauth';
import { setAuth } from '@/stores/auth/authslice';

const Header = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData: SignInFormData = { email, password };
      const user = await signIn(formData);
      dispatch(setAuth(user));
      toast.success('Signed in successfully');
      router.push('/dashboard'); // Redirect to the desired page
    } catch (error) {
      toast.error('Error signing in');
    }
  };

  return (
    <header className="fixed w-full top-0 left-0 bg-[#3d3c3f] bg-opacity-90 text-white py-4 shadow-lg z-10">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex justify-between items-center">
          <div className="flex items-center justify-between">
            <Image src="/assets/illustration.png" alt="Your Logo" height={45} width={45} className="mr-8" />
            <Link href="#rentals" legacyBehavior>
              <a className="text-white mx-4 hover:text-[#fccc52] transition duration-300 drop-shadow-md">Car Rental</a>
            </Link>
            <Link href="#events" legacyBehavior>
              <a className="text-white mx-4 hover:text-[#fccc52] transition duration-300 drop-shadow-md">Events</a>
            </Link>
            <Link href="#hotels" legacyBehavior>
              <a className="text-white mx-4 hover:text-[#fccc52] transition duration-300 drop-shadow-md">Hotels</a>
            </Link>
          </div>
          <div>
            <button onClick={togglePopup} className="text-white hover:text-[#fccc52] transition duration-300 drop-shadow-md">Sign In</button>
          </div>
        </nav>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={closePopup}></div>
      )}
      <div className={`fixed top-16 right-4 bg-[#1a1a1a] p-6 rounded-lg shadow-lg z-30 w-80 transition-transform duration-300 ${isPopupOpen ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'}`}>
        <button onClick={closePopup} className="absolute top-2 right-2 text-white">X</button>
        <h2 className="text-2xl font-bold text-center mb-4 text-[#fccc52]">Sign In</h2>
        <form className="space-y-4" onSubmit={handleSignIn}>
          <div>
            <label className="block text-[#fccc52] mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-full bg-[#323232] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] focus:border-transparent shadow-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[#fccc52] mb-2">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-full bg-[#323232] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] focus:border-transparent shadow-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-center">
            <button type="submit" className="bg-[#fccc52] text-[#323232] px-4 py-2 mt-6 rounded-full font-bold text-lg shadow-md">Sign In</button>
          </div>
        </form>
      </div>
    </header>
  );
};

export default Header;
