import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { signIn, SignInFormData } from '@/stores/auth/ApiCallerauth';
import { setAuth } from '@/stores/auth/authslice';
import CartIcon from './carticon';

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
     
      const response = await signIn(formData);
     
  
      const user = response.user;
      const token = response.token;
      const userType = response.type;
      const userName = response.name; 
      
      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
      localStorage.setItem('userName', userName);
      
      dispatch(setAuth({ user, userType }));
      toast.success('Signed in successfully');
      
      if (userType === 'admin') {
        router.push('/admin/add-operator');
      } else if (userType === 'car' || userType === 'event' || userType === 'hotel') {
        router.push(`/${userType}/myprofile`);
      } else {
        router.push('/');
      }
    } catch (error) {
     
      toast.error('Error signing in');
    }
  };
  
  

  return (
    <header className="fixed w-full top-0 left-0 bg-white bg-opacity-90 text-gray-700 shadow-lg z-10">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/assets/illustration.png" alt="Your Logo" height={80} width={80} className="mr-4 drop-shadow-md" />
            <div className="hidden md:flex">
              <Link href="#rentals" legacyBehavior>
                <a className="text-gray-600 font-bold mx-2 hover:text-[#ff914d] hover:border-b-2 hover:border-b-[#ff914d] p-3 transition duration-300">Car Rental</a>
              </Link>
              <Link href="#events" legacyBehavior>
                <a className="text-gray-600 font-bold mx-2 hover:text-[#ff914d]  hover:border-b-2 hover:border-b-[#ff914d] p-3 transition duration-300">Events</a>
              </Link>
              <Link href="#hotels" legacyBehavior>
                <a className="text-gray-600 font-bold mx-2 hover:text-[#ff914d]  hover:border-b-2 hover:border-b-[#ff914d] p-3 transition duration-300">Hotels</a>
              </Link>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <button onClick={togglePopup} className="ext-gray-600 font-bold hover:text-[#ff914d] hover:border-b-2 hover:border-b-[#ff914d] p-3 transition duration-300 md:hidden">Signin</button>
            <button onClick={togglePopup} className="ext-gray-600 font-bold hover:text-[#ff914d] hover:border-b-2 hover:border-b-[#ff914d] p-3 transition duration-300 hidden md:block">Sign In</button>
            <CartIcon />
          </div>
        </nav>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={closePopup}></div>
      )}
      <div className={`fixed top-16 right-4 bg-gray-200  p-6 rounded-lg shadow-2xl z-30 w-80 transition-transform duration-300 ${isPopupOpen ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'}`}>
        <button onClick={closePopup} className="absolute top-2 right-4 text-gray-600 font-bold">X</button>
        <h2 className="text-2xl font-bold text-center mb-4 text-[#ff914d]">Sign In</h2>
        <form className="space-y-4" onSubmit={handleSignIn}>
          <div>
            <label className="block ext-gray-600 font-bold mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full p-3 rounded-full bg-gray-200 border border-[#fccc52] text-gray-600 font-bold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] focus:border-transparent shadow-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block ext-gray-600 font-bold mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full p-3 rounded-full bg-gray-200 border border-[#fccc52] text-gray-600 font-bold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] focus:border-transparent shadow-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex  justify-center">
         
            <button type="submit" className="bg-gradient-to-r from-[#fccc52] to-[#ff914d] font-bold drop-shadow-md text-[#323232] px-6 py-2 mt-4 rounded-2xl">Sign In</button>
          </div>
        </form>
      </div>
    </header>
  );
};

export default Header;