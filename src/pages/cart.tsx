import React, { useEffect, useState } from 'react';
import { getCartItems, deleteCartItem } from '@/stores/cart/carapicaller';
import { FaTrashAlt } from 'react-icons/fa'; // Importing delete icon

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

  // Handle delete action with confirmation
  const handleDelete = async (productId: string, roomId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this item?'); // Confirmation prompt
    if (!confirmed) return;

    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      console.error('No sessionId found in localStorage');
      return;
    }

    try {
      await deleteCartItem(sessionId, productId, roomId);

      // Remove the deleted item from the state to update the UI
      setCartItems((prevItems) =>
        prevItems.filter((item) => !(item.productId === productId && item.roomId === roomId))
      );

      console.log(`Deleted item with productId: ${productId} and roomId: ${roomId}`);
    } catch (error) {
      console.error('Failed to delete cart item:', error);
    }
  };

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
        {cartItems.map((item, index) => (
          <CartItem
            key={index}
            item={item}
            onDelete={() => handleDelete(item.productId, item.roomId)}
          />
        ))}
      </ul>
    </div>
  );
};

const CartItem = ({ item, onDelete }: { item: any; onDelete: () => void }) => {
  const expirationTime = new Date(item.expiresAt).getTime();
  const currentTime = Date.now();
  const initialTimeLeft = Math.floor((expirationTime - currentTime) / 1000);

  const [timeLeft, setTimeLeft] = useState(initialTimeLeft > 0 ? initialTimeLeft : 0);

  useEffect(() => {
    if (timeLeft <= 0) return; // Stop the interval if time has already run out.

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(timer); // Stop the interval when time reaches 0.
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup the interval when the component unmounts.
  }, [timeLeft]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const renderProductDetails = () => {
    if (item.productType === 'event') {
      const eventDetails = item.productDetails.events;
      const eventType = item.productDetails.eventPrices.find(
        (price: any) => price._id === item.eventTypeId
      );

      const totalEventPrice = eventType?.price * item.numberOfTickets;

      return (
        <>
          <p className="text-lg font-bold text-gray-600 drop-shadow-md">Event: {eventDetails.description}</p>
          <p className="text-lg text-gray-600 drop-shadow-md">
            Date: {new Date(eventDetails.date).toLocaleDateString()} {eventDetails.startTime} - {eventDetails.endTime}
          </p>
          <p className="text-lg text-gray-600 drop-shadow-md">Location: {eventDetails.location}</p>
          <p className="text-md text-gray-600 drop-shadow-md">Ticket Type: {eventType?.type}</p>
          <p className="text-md text-gray-600 drop-shadow-md">Number of Tickets: {item.numberOfTickets}</p>
          <p className="text-md text-gray-600 drop-shadow-md">Price per Ticket: ${eventType?.price}</p>
          <p className="text-md font-bold text-gray-600 drop-shadow-md">Total Price: ${totalEventPrice}</p>
        </>
      );
    }

    if (item.productType === 'car') {
      const carDetails = item.productDetails.cars[0];
      const carSpecificity = carDetails.carSpecificity.find(
        (specificity: any) => specificity._id === item.carSpecificityId
      );

      const totalCarPrice = carDetails.price * 1; // Assuming 1 car per reservation, adjust as needed

      return (
        <>
          <p className="text-lg font-bold text-gray-600 drop-shadow-md">Car: {carDetails.type}</p>
          <p className="text-lg text-gray-600 drop-shadow-md">Color: {carSpecificity?.color}</p>
          <p className="text-md text-gray-600 drop-shadow-md">Price per Car: ${carDetails.price}</p>
          <p className="text-md font-bold text-gray-600 drop-shadow-md">Total Price: ${totalCarPrice}</p>
        </>
      );
    }

    if (item.productType === 'hotel') {
      const roomType = item.productDetails.roomTypes.find((type: any) =>
        type.rooms.some((room: any) => room._id === item.roomId)
      );
      const room = roomType?.rooms.find((room: any) => room._id === item.roomId);

      return (
        <>
          <p className="text-lg font-bold text-gray-600 drop-shadow-md">Hotel: {item.hotelOwner}</p>
          <p className="text-md text-gray-600 drop-shadow-md">Room Type: {roomType?.type}</p>
          <p className="text-md text-gray-600 drop-shadow-md">Room Number: {room?.roomNumber}</p>
          <p className="text-md text-gray-600 drop-shadow-md">Price: ${roomType?.price}</p>
        </>
      );
    }
  };

  return (
    <li className="bg-[#fccc52] bg-opacity-80 rounded-xl shadow-lg p-6 flex justify-between items-center space-x-6">
      <div>
        <p className="text-lg font-bold text-gray-600 drop-shadow-md">Product Type: {item.productType}</p>
        {renderProductDetails()}
        {timeLeft > 0 ? (
          <p className="text-md text-red-600 font-semibold mt-2">Expires in: {formatTime(timeLeft)}</p>
        ) : (
          <p className="text-md text-red-600 font-semibold mt-2">Expired</p>
        )}
      </div>
      <div className="flex items-center">
        <FaTrashAlt
          className="text-[#ff914d] hover:text-red-600 cursor-pointer text-2xl"
          onClick={onDelete}
          title="Delete Item"
        />
      </div>
    </li>
  );
};

export default CartPage;

