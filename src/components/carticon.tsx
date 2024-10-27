// components/CartIcon.tsx

import React, { useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { getCartItems } from '@/stores/cart/carapicaller'; // Ensure correct import path
import CartModal from './cartmodal'; // Ensure correct import path

const CartIcon = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to fetch the cart count
  const fetchCartCount = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        const cartData = await getCartItems(sessionId);
        const itemCount = cartData.length;
        setCartCount(itemCount);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
      setCartCount(0);
    }
  };

  // Fetch cart count on component mount
  useEffect(() => {
    fetchCartCount();
  }, []);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    console.log('Closing modal'); // Debugging log
    setIsModalOpen(false);
  };

  // Function to refresh the cart count
  const refreshCart = () => {
    fetchCartCount();
  };

  return (
    <>
      <div className="relative cursor-pointer" onClick={openModal}>
        <FaShoppingCart className="text-2xl text-[#ff914d] hover:text-[#fccc52]" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2 py-1 text-xs">
            {cartCount}
          </span>
        )}
      </div>
      <CartModal isOpen={isModalOpen} closeModal={closeModal} refreshCart={refreshCart} />
    </>
  );
};

export default CartIcon;
