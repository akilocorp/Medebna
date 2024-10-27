// components/CartModal.tsx

import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FaTrashAlt } from 'react-icons/fa';
import { getCartItems, deleteCartItem } from '@/stores/cart/carapicaller';
import { showToast } from '@/components/popup';

interface CartModalProps {
  isOpen: boolean;
  closeModal: () => void;
  refreshCart: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, closeModal, refreshCart }) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch cart items
  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        const items = await getCartItems(sessionId);
        setCartItems(items);
      } else {
        console.error('No sessionId found in localStorage');
        showToast('Session expired. Please log in again.', 'error');
        setCartItems([]);
      }
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
      showToast('Failed to fetch cart items.', 'error');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart items when the modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCartItems();
    }
  }, [isOpen]);

  // Handle delete action
  const handleDelete = async (
    productId: string,
    productType: string,
    roomId: string = '',
    carTypeId: string = '',
    eventTypeId: string = ''
  ) => {
    const confirmed = window.confirm('Are you sure you want to delete this item?');
    if (!confirmed) return;
  
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      console.error('No sessionId found in localStorage');
      showToast('Session expired. Please log in again.', 'error');
      return;
    }
  
    try {
      // Determine which ID to pass based on product type
      let idToUse = '';
      switch (productType) {
        case 'hotel':
          idToUse = roomId;
          break;
        case 'car':
          idToUse = carTypeId;
          break;
        case 'event':
          idToUse = eventTypeId;
          break;
        default:
          console.error('Unknown product type');
          return;
      }
  
      await deleteCartItem(sessionId, productId, roomId, carTypeId, '', eventTypeId);
      showToast('Item deleted successfully', 'success');
      
      // Refresh cart items after deletion
      fetchCartItems();
      
      // Notify CartIcon to refresh cart count
      refreshCart();
    } catch (error) {
      console.error('Failed to delete cart item:', error);
      showToast('Failed to delete item. Please try again.', 'error');
    }
  };
  
  

  // Format expiration time
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  // Render product details based on product type
  const renderProductDetails = (item: any) => {
    switch (item.productType) {
      case 'event':
        const eventDetails = item.productDetails.events;
        const eventType = item.productDetails.eventPrices.find(
          (price: any) => price._id === item.eventTypeId
        );
        const totalEventPrice = eventType?.price * item.numberOfTickets;

        return (
          <>
            <p className="text-lg font-bold text-gray-600">Event: {eventDetails.description}</p>
            <p className="text-gray-600">Date: {new Date(eventDetails.date).toLocaleDateString()} {eventDetails.startTime} - {eventDetails.endTime}</p>
            <p className="text-gray-600">Location: {eventDetails.location}</p>
            <p className="text-gray-600">Ticket Type: {eventType?.type}</p>
            <p className="text-gray-600">Number of Tickets: {item.numberOfTickets}</p>
            <p className="text-gray-600">Price per Ticket: ${eventType?.price}</p>
            <p className="text-gray-800 font-bold">Total Price: ${totalEventPrice}</p>
          </>
        );
      case 'car':
        const carDetails = item.productDetails.cars[0];
        const carSpecificity = carDetails.carSpecificity.find(
          (specificity: any) => specificity._id === item.carSpecificityId
        );
        const totalCarPrice = carDetails.price * 1; // Adjust if multiple cars can be reserved

        return (
          <>
            <p className="text-lg font-bold text-gray-600">Car: {carDetails.type}</p>
            <p className="text-gray-600">Color: {carSpecificity?.color}</p>
            <p className="text-gray-600">Price per Car: ${carDetails.price}</p>
            <p className="text-gray-800 font-bold">Total Price: ${totalCarPrice}</p>
          </>
        );
      case 'hotel':
        const roomType = item.productDetails.roomTypes.find((type: any) =>
          type.rooms.some((room: any) => room._id === item.roomId)
        );
        const room = roomType?.rooms.find((room: any) => room._id === item.roomId);
        return (
          <>
            <p className="text-lg font-bold text-gray-600">Hotel: {item.hotelOwner}</p>
            <p className="text-gray-600">Room Type: {roomType?.type}</p>
            <p className="text-gray-600">Room Number: {room?.roomNumber}</p>
            <p className="text-gray-600">Price: ${roomType?.price}</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeModal}>
        <div className="min-h-screen px-4 text-center bg-black bg-opacity-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title as="h3" className="text-2xl font-bold text-[#ff914d] mb-4">
                Your Cart
              </Dialog.Title>

              {loading ? (
                <div className="flex items-center justify-center min-h-40">
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
                </div>
              ) : cartItems.length === 0 ? (
                <p className="text-center text-gray-600">Your cart is empty.</p>
              ) : (
                <ul className="space-y-4 max-h-80 overflow-y-auto">
                  {cartItems.map((item, index) => (
                    <CartItem
                    key={index}
                    item={item}
                    onDelete={() => handleDelete(item.productId, item.productType, item.roomId, item.carTypeId, item.eventTypeId)}
                  />
                  
                  ))}
                </ul>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-[#ff914d] border border-transparent rounded-md hover:bg-[#fccc52] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#fccc52]"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

// Separate CartItem Component
interface CartItemProps {
  item: any;
  onDelete: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onDelete }) => {
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
    switch (item.productType) {
      case 'event':
        const eventDetails = item.productDetails.events;
        const eventType = item.productDetails.eventPrices.find(
          (price: any) => price._id === item.eventTypeId
        );
        const totalEventPrice = eventType?.price * item.numberOfTickets;

        return (
          <>
            <p className="text-lg font-bold text-gray-600">Event: {eventDetails.description}</p>
            <p className="text-gray-600">Date: {new Date(eventDetails.date).toLocaleDateString()} {eventDetails.startTime} - {eventDetails.endTime}</p>
            <p className="text-gray-600">Location: {eventDetails.location}</p>
            <p className="text-gray-600">Ticket Type: {eventType?.type}</p>
            <p className="text-gray-600">Number of Tickets: {item.numberOfTickets}</p>
            <p className="text-gray-600">Price per Ticket: ${eventType?.price}</p>
            <p className="text-gray-800 font-bold">Total Price: ${totalEventPrice}</p>
          </>
        );
      case 'car':
        const carDetails = item.productDetails.cars[0];
        const carSpecificity = carDetails.carSpecificity.find(
          (specificity: any) => specificity._id === item.carSpecificityId
        );
        const totalCarPrice = carDetails.price * 1; // Adjust if multiple cars can be reserved

        return (
          <>
            <p className="text-lg font-bold text-gray-600">Car: {carDetails.type}</p>
            <p className="text-gray-600">Color: {carSpecificity?.color}</p>
            <p className="text-gray-600">Price per Car: ${carDetails.price}</p>
            <p className="text-gray-800 font-bold">Total Price: ${totalCarPrice}</p>
          </>
        );
      case 'hotel':
        const roomType = item.productDetails.roomTypes.find((type: any) =>
          type.rooms.some((room: any) => room._id === item.roomId)
        );
        const room = roomType?.rooms.find((room: any) => room._id === item.roomId);
        return (
          <>
            <p className="text-lg font-bold text-gray-600">Hotel: {item.hotelOwner}</p>
            <p className="text-gray-600">Room Type: {roomType?.type}</p>
            <p className="text-gray-600">Room Number: {room?.roomNumber}</p>
            <p className="text-gray-600">Price: ${roomType?.price}</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <li className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow">
      <div>
        <p className="text-lg font-bold text-gray-600">Product Type: {item.productType}</p>
        {renderProductDetails()}
        {item.expiresAt && (
          <p className={`mt-2 font-semibold ${timeLeft > 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {timeLeft > 0 ? `Expires in: ${formatTime(timeLeft)}` : 'Expired'}
          </p>
        )}
      </div>
      <button onClick={onDelete} className="text-red-500 hover:text-red-700">
        <FaTrashAlt size={20} />
      </button>
    </li>
  );
};

export default CartModal;
