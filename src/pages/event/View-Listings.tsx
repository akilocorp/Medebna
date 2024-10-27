// pages/operator/ViewListingsPage.tsx

import React, { useEffect, useState } from 'react';
import OperatorLayout from '@/components/operator/operatorLayout';
import { getAllEvents, deleteEvent, updateEvent } from '@/stores/operator/ApiCallerOperatorEvent';
import { showToast } from '@/components/popup';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { CldUploadWidget } from 'next-cloudinary';
import { RiUploadCloudFill } from 'react-icons/ri';

interface EventPrice {
  _id: string;
  type: string;
  ticketAvailable: number;
  price: number;
  status: string;
}

interface EventDetails {
  details: string;
  ticketInfo: string;
  additionalInfo: string;
  foodAndDrink: string;
}

interface EventData {
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  image: string;
  description: string;
}

interface Event {
  _id: string;
  events: EventData;
  eventPrices: EventPrice[];
  eventDetails: EventDetails;
}

const ViewListingsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getAllEvents();
      setEvents(data.map((event: any) => ({
        _id: event._id,
        events: {
          location: event.events?.location || 'N/A',
          date: event.events?.date || 'N/A',
          startTime: event.events?.startTime || 'N/A',
          endTime: event.events?.endTime || 'N/A',
          image: event.events?.image || 'N/A',
          description: event.events?.description || 'N/A',
        },
        eventPrices: event.eventPrices || [],
        eventDetails: event.eventDetails || {},
      })));
    } catch (error) {
      showToast('Error fetching events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleImageUpload = (result: any) => {
    if (result.event === 'success' && selectedEvent) {
      const imageUrl = result.info.secure_url;
      setSelectedEvent({
        ...selectedEvent,
        events: {
          ...selectedEvent.events,
          image: imageUrl,
        },
      });
    }
  };

  const RenderImageUpload = ({ image }: { image: string }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(image);

    return (
      <div className="relative mb-4">
        <CldUploadWidget uploadPreset="u06vgrf1" onSuccess={handleImageUpload}>
          {({ open }) => (
            <button
              type="button"
              className="flex items-center justify-center w-full p-2 py-2 rounded-full border text-gray-300 border-[#fccc52] cursor-pointer bg-white shadow-md hover:bg-[#fccc52] hover:text-white transition-colors duration-300"
              onClick={() => open()}
            >
              <RiUploadCloudFill className="mr-2 text-lg text-[#ff914d]" />
              {imageUrl ? 'Change Image' : 'Upload Image'}
            </button>
          )}
        </CldUploadWidget>
        {imageUrl && (
          <div className="mt-4">
            <img src={imageUrl} alt="Event Preview" className="w-32 h-32 rounded-lg shadow-md object-cover" />
          </div>
        )}
      </div>
    );
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event? This action cannot be undone.");
    if (confirmDelete) {
      try {
        await deleteEvent(id);
        setEvents(events.filter(event => event._id !== id));
        showToast('Event deleted successfully', 'success');
      } catch (error) {
        showToast('Error deleting event', 'error');
      }
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (selectedEvent) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("Token not found");
        }

        const updatedEvent = await updateEvent(selectedEvent, selectedEvent._id, token);
        
        setEvents(events.map(event => event._id === updatedEvent._id ? updatedEvent : event));
        showToast("Event updated successfully", "success");
        await fetchEvents(); 
        setIsModalOpen(false);
      } catch (error) {
        showToast("Error updating event", "error");
      }
    }
  };

  const handleModalClose = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="flex justify-center mb-4">
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
          <p className="text-[#fccc52] text-lg font-semibold">Loading, please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <OperatorLayout>
      <h1 className="text-3xl font-bold mb-6 text-[#ff914d]">View Events</h1>
      
      {/* Vertical Stack of Horizontally Oriented Cards */}
      <div className="space-y-6">
        {Array.isArray(events) && events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
              {/* Event Image */}
              <div className="md:w-1/3">
                <img
                  src={event.events.image}
                  alt={event.events.location}
                  className="w-full h-48 object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                />
                {/* Event Details Toggle */}
                <details className="mt-4 p-2">
                  <summary className="cursor-pointer text-[#ff914d] font-semibold">View Details</summary>
                  <div className="mt-2 text-gray-700">
                    <p><strong>Details:</strong> {event.eventDetails.details}</p>
                    <p><strong>Ticket Info:</strong> {event.eventDetails.ticketInfo}</p>
                    <p><strong>Additional Info:</strong> {event.eventDetails.additionalInfo}</p>
                    <p><strong>Food and Drink:</strong> {event.eventDetails.foodAndDrink}</p>
                  </div>
                </details>
              </div>
              
              {/* Event Details */}
              <div className="p-4 md:w-2/3 flex flex-col justify-between">
                {/* Header with Event Info and Action Buttons */}
                <div className="flex justify-between items-start">
                  {/* Event Information */}
                  <div className="flex-1 pr-4">
                    <h2 className="text-2xl font-bold text-[#ff914d] mb-2">{event.events.location}</h2>
                    <p className="text-gray-600 mb-1"><strong>Date:</strong> {formatDate(event.events.date)}</p>
                    <p className="text-gray-600 mb-1"><strong>Time:</strong> {event.events.startTime} - {event.events.endTime}</p>
                    <p className="text-gray-700 mt-2">{event.events.description}</p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-row justify-between gap-4">
                    <button
                      onClick={() => handleEdit(event)}
                      className="flex items-center justify-center bg-[#fccc52] bg-opacity-40 text-[#ff914d] p-3 rounded-full shadow hover:bg-opacity-100 hover:text-white transition-colors duration-300"
                    >
                      <FaEdit /> 
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="flex items-center justify-center bg-red-200 text-red-500 p-3 rounded-full shadow hover:bg-red-300 transition-colors duration-300"
                    >
                      <FaTrash /> 
                    </button>
                  </div>
                </div>
                
                {/* Ticket Prices */}
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-[#ff914d] mb-2">Ticket Prices</h3>
                  {event.eventPrices.map((price) => (
                    <div key={price._id} className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded">
                      <div>
                        <p className="text-gray-800"><strong>Type:</strong> {price.type}</p>
                        <p className="text-gray-800"><strong>Available:</strong> {price.ticketAvailable}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-800"><strong>Price:</strong> ${price.price}</p>
                        <p className={`text-sm ${price.status === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                          {price.status.charAt(0).toUpperCase() + price.status.slice(1)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No events found</p>
        )}
      </div>

      {/* Modal for Editing Events */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-6">Edit Event</h2>
            <div>
              <label className="block mb-2 text-black text-sm font-semibold">Location</label>
              <input
                type="text"
                value={selectedEvent.events.location}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    events: {
                      ...selectedEvent.events,
                      location: e.target.value,
                    },
                  })
                }
                className="border border-gray-300 bg-white text-black p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
              />
              
              <label className="block mb-2 mt-4 text-black text-sm font-semibold">Date</label>
              <input
                type="date"
                value={selectedEvent.events.date.split('T')[0]}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    events: {
                      ...selectedEvent.events,
                      date: e.target.value,
                    },
                  })
                }
                className="border border-gray-300 bg-white text-black p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
              />
              
              <label className="block mb-2 mt-4 text-black text-sm font-semibold">Start Time</label>
              <input
                type="time"
                value={selectedEvent.events.startTime}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    events: {
                      ...selectedEvent.events,
                      startTime: e.target.value,
                    },
                  })
                }
                className="border border-gray-300 bg-white text-black p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
              />
              
              <label className="block mb-2 mt-4 text-black text-sm font-semibold">End Time</label>
              <input
                type="time"
                value={selectedEvent.events.endTime}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    events: {
                      ...selectedEvent.events,
                      endTime: e.target.value,
                    },
                  })
                }
                className="border border-gray-300 bg-white text-black p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
              />
              
              <label className="block mb-2 mt-4 text-black text-sm font-semibold">Event Image</label>
              <RenderImageUpload image={selectedEvent.events.image} />
              
              <label className="block mb-2 mt-4 text-black text-sm font-semibold">Description</label>
              <textarea
                value={selectedEvent.events.description}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    events: {
                      ...selectedEvent.events,
                      description: e.target.value,
                    },
                  })
                }
                className="border border-gray-300 bg-white text-black p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
              />

              {/* Event Prices Editing */}
              <h3 className="text-lg font-bold text-[#ff914d] mt-6 mb-4">Event Prices</h3>
              {selectedEvent.eventPrices.map((price, index) => (
                <div key={price._id} className="mb-4">
                  <label className="block mb-2 text-black text-sm font-semibold">Ticket Type</label>
                  <input
                    type="text"
                    value={price.type}
                    onChange={(e) => {
                      const updatedPrices = [...selectedEvent.eventPrices];
                      updatedPrices[index].type = e.target.value;
                      setSelectedEvent({
                        ...selectedEvent,
                        eventPrices: updatedPrices,
                      });
                    }}
                    className="border border-gray-300 bg-white text-black p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
                  />
                  
                  <label className="block mb-2 mt-4 text-black text-sm font-semibold">Tickets Available</label>
                  <input
                    type="number"
                    value={price.ticketAvailable}
                    onChange={(e) => {
                      const updatedPrices = [...selectedEvent.eventPrices];
                      updatedPrices[index].ticketAvailable = Number(e.target.value);
                      setSelectedEvent({
                        ...selectedEvent,
                        eventPrices: updatedPrices,
                      });
                    }}
                    className="border border-gray-300 bg-white text-black p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
                  />
                  
                  <label className="block mb-2 mt-4 text-black text-sm font-semibold">Price</label>
                  <input
                    type="number"
                    value={price.price}
                    onChange={(e) => {
                      const updatedPrices = [...selectedEvent.eventPrices];
                      updatedPrices[index].price = Number(e.target.value);
                      setSelectedEvent({
                        ...selectedEvent,
                        eventPrices: updatedPrices,
                      });
                    }}
                    className="border border-gray-300 bg-white text-black p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
                  />
                  
                  <label className="block mb-2 mt-4 text-black text-sm font-semibold">Status</label>
                  <select
                    value={price.status}
                    onChange={(e) =>{
                      const updatedPrices = [...selectedEvent.eventPrices];
                      updatedPrices[index].status  = e.target.value;
                      setSelectedEvent({
                        ...selectedEvent,
                        eventPrices: updatedPrices,
                      });
                    }}
                    className="border border-gray-300 bg-white text-black p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                  </select>
                </div>
              ))}

              {/* Event Details Editing */}
              <h3 className="text-lg font-bold text-[#ff914d] mt-6 mb-4">Event Details</h3>
              <label className="block mb-2 text-black text-sm font-semibold">Details</label>
              <textarea
                value={selectedEvent.eventDetails.details}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    eventDetails: {
                      ...selectedEvent.eventDetails,
                      details: e.target.value,
                    },
                  })
                }
                className="border border-gray-300 bg-white text-black p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
              />
              
              <label className="block mb-2 mt-4 text-black text-sm font-semibold">Ticket Info</label>
              <textarea
                value={selectedEvent.eventDetails.ticketInfo}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    eventDetails: {
                      ...selectedEvent.eventDetails,
                      ticketInfo: e.target.value,
                    },
                  })
                }
                className="border border-gray-300 bg-white text-black p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
              />
              
              <label className="block mb-2 mt-4 text-black text-sm font-semibold">Additional Info</label>
              <textarea
                value={selectedEvent.eventDetails.additionalInfo}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    eventDetails: {
                      ...selectedEvent.eventDetails,
                      additionalInfo: e.target.value,
                    },
                  })
                }
                className="border border-gray-300 bg-white text-black p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
              />
              
              <label className="block mb-2 mt-4 text-black text-sm font-semibold">Food and Drink</label>
              <textarea
                value={selectedEvent.eventDetails.foodAndDrink}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    eventDetails: {
                      ...selectedEvent.eventDetails,
                      foodAndDrink: e.target.value,
                    },
                  })
                }
                className="border border-gray-300 bg-white text-black p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
              />

              {/* Action Buttons */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleUpdate}
                  className="bg-[#fccc52] text-[#323232] font-semibold px-6 py-3 rounded-full hover:bg-[#ff914d] transition-colors duration-300"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleModalClose}
                  className="bg-gray-500 text-white font-semibold px-6 py-3 rounded-full ml-4 hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </OperatorLayout>
  );
};

export default ViewListingsPage;
