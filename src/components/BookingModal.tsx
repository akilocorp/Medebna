import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { bookProduct } from '@/stores/book/apiCaller';
import { showToast } from '@/components/popup';

interface BookingModalProps {
  isOpen: boolean;
  closeModal: () => void;
  productId: string;
  productType: string;
  sessionId: string | null;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  closeModal,
  productId,
  productType,
  sessionId,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    paymentMethod: 'chapa', // Default to "chapa"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (!sessionId) {
        showToast('Session expired. Please log in again.', 'error');
        return;
      }

      const payload = {
        ...formData,
        productType,
        sessionId,
        productId,
      };

      const response = await bookProduct(payload);

      showToast('Booking successful!', 'success');
      closeModal();
   if (response && response.paymentLink) {
        // Navigate to the payment link
        window.location.href = response.paymentLink;
      } else {
        showToast('Payment link not found.', 'error');
      }
    } catch (error) {
      showToast('Failed to book product. Please try again.', 'error');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={closeModal}
      >
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
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-2xl font-bold text-[#ff914d] mb-4 text-center"
              >
                Booking Details
              </Dialog.Title>
              <form className="space-y-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="w-full p-2 border rounded-xl text-black bg-white border-[#ff914d] rounded focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="w-full p-2 bg-white rounded-xl text-black border border-[#ff914d] rounded focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full p-2 border rounded-xl text-black bg-white border-[#ff914d] rounded focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className="w-full p-2 border rounded-xl text-black bg-white border-[#ff914d] rounded focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
                />
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-xl text-black border-[#ff914d] rounded bg-white focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
                >
                  <option value="chapa">Chapa</option>
                  <option value="stripe">Stripe</option>
                </select>
               <div className='flex gap-4 items-center justify-between'>
               <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-1/2 py-2 rounded-2xl bg-[#ff914d] text-white font-semibold rounded hover:bg-[#fccc52] transition-colors"
                >
                  Submit
                </button>
                <button
                type="button"
                onClick={closeModal}
                className="w-1/2 py-2 rounded-2xl bg-[#ff914d] text-white font-semibold rounded hover:bg-[#fccc52] transition-colors"
              >
                Cancel
              </button>
               </div>
               
              </form>
              
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BookingModal;
