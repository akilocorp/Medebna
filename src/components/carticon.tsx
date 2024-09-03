import React, { useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { getCartCount } from '@/stores/cart/carapicaller'; // Import the function to get the cart count

const CartIcon = () => {
  const [cartCount, setCartCount] = useState(0);
  const [showCount, setShowCount] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
          const count = await getCartCount(sessionId);
          setCartCount(count);
          setShowCount(count > 0);
        }
      } catch (error) {
        console.error('Failed to fetch cart count:', error);
      }
    };

    fetchCartCount();
  }, []);

  const handleCartClick = () => {
    router.push('/cart'); // Navigate to the cart page
  };

  return (
    <div className="relative cursor-pointer" onClick={handleCartClick}>
      <FaShoppingCart
        className={`text-2xl ${showCount ? 'text-red-600' : 'text-[#ff914d]'} hover:text-[#fccc52]`}
      />
      {showCount && (
        <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2 py-1 text-xs">
          {cartCount}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
