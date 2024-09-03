import React, { useEffect, useState } from 'react';
import { getCartItems } from '@/stores/cart/carapicaller';

const CartPage = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
          const items = await getCartItems(sessionId);
          setCartItems(items);
        } else {
          console.error('No sessionId found in localStorage');
        }
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#ffffff]">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-[#ff914d]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p className="mt-4 text-[#fccc52] font-semibold">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#ffffff]">
        <p className="text-xl text-[#ff914d] font-bold">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffffff] p-8">
      <h1 className="text-3xl font-extrabold text-[#ff914d] text-center mb-8">Your Cart</h1>
      <ul className="max-w-3xl mx-auto space-y-6">
        {cartItems.map((item, index) => {
          const roomType = item.productDetails.roomTypes.find((type: any) =>
            type.rooms.some((room: any) => room._id === item.roomId)
          );

          const room = roomType?.rooms.find((room: any) => room._id === item.roomId);

          return (
            <li
              key={index}
              className="bg-[#fccc52] bg-opacity-80 rounded-xl shadow-lg p-6 flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-bold text-gray-600 drop-shadow-md">Product Type: {item.productType}</p>
                <p className="text-md text-gray-600 drop-shadow-md">Room Type: {roomType?.type}</p>
                <p className="text-md text-gray-600 drop-shadow-md">Room Number: {room?.roomNumber}</p>
                <p className="text-md text-gray-600 drop-shadow-md">Price: ${roomType?.price}</p>
              </div>
              <div className="text-3xl text-[#ff914d]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-10 h-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h18M9 13h6m-6 4h6M9 9h6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CartPage;
