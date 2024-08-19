import React, { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useRouter } from 'next/router';

const CartIcon = () => {
  const [cartCount, setCartCount] = useState(0);
  const [showCount, setShowCount] = useState(false);
  const router = useRouter();

  const handleCartClick = () => {
    setShowCount(false);
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
