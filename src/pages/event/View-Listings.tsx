import { useEffect, useState } from 'react';
import OperatorLayout from '@/components/operator/operatorLayout';
import { getAllEvents, deleteEvent, updateEvent } from '@/stores/operator/ApiCallerOperatorEvent';
import { showToast } from '@/components/popup';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { CldUploadWidget } from 'next-cloudinary';
import { RiUploadCloudFill } from 'react-icons/ri';

interface EventPrice {
  _id: string;
  type: string;
  ticketAvailable: number;
  price: number;
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
  status: string;
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
          status: event.events?.status || 'N/A',
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
              className="block w-full p-2 py-2 rounded-full border text-gray-300 border-[#fccc52] cursor-pointer flex items-center justify-center bg-[#ffffff] shadow-md"
              onClick={() => open()}
            >
              <RiUploadCloudFill className="mr-2 text-lg text-[#ff914d]" />
              {imageUrl ? 'Change Image' : 'Upload Image'}
            </button>
          )}
        </CldUploadWidget>
        {imageUrl && (
          <div className="mt-4">
            <img src={imageUrl} alt="Event Preview" className="w-32 h-32 rounded-lg shadow-md" />
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
      <div className="flex items-center justify-center min-h-screen bg-[#f9f9f9]">
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
      <div className="overflow-x-auto max-h-[42rem] rounded-lg overflow-y-scroll">
        <table className="min-w-full bg-[#ffffff] text-[#323232] rounded-lg shadow-md">
          <thead>
            <tr className="bg-gradient-to-r from-[#ff914d] to-[#fccc52] text-[#ffffff]">
              <th className="py-2 px-4">Image</th>
              <th className="py-2 px-4">Location</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Start Time</th>
              <th className="py-2 px-4">End Time</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Ticket Type</th>
              <th className="py-2 px-4">Tickets Available</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(events) && events.length > 0 ? (
              events.map((event) => (
                <>
                  {event.eventPrices.map((price, index) => (
                    <tr key={`${event._id}-${price._id}`} className="border-t border-[#ff914d]">
                      {index === 0 && (
                        <>
                          <td className="py-2 px-4" rowSpan={event.eventPrices.length}>
                            <img src={event.events.image} alt={event.events.location} className="w-14 h-14 object-cover rounded-lg shadow-md" />
                          </td>
                          <td className="py-2 px-4" rowSpan={event.eventPrices.length}>
                            {event.events.location}
                          </td>
                          <td className="py-2 px-4" rowSpan={event.eventPrices.length}>
                            {formatDate(event.events.date)}
                          </td>
                          <td className="py-2 px-4" rowSpan={event.eventPrices.length}>
                            {event.events.startTime}
                          </td>
                          <td className="py-2 px-4" rowSpan={event.eventPrices.length}>
                            {event.events.endTime}
                          </td>
                          <td className="py-2 px-4" rowSpan={event.eventPrices.length}>
                            {event.events.description}
                          </td>
                          <td className="py-2 px-4" rowSpan={event.eventPrices.length}>
                            {event.events.status}
                          </td>
                        </>
                      )}
                      <td className="py-2 px-4">{price.type}</td>
                      <td className="py-2 px-4">{price.ticketAvailable}</td>
                      <td className="py-2 px-4">{price.price}</td>
                      {index === 0 && (
                        <td className="py-2 px-4 flex space-x-2" rowSpan={event.eventPrices.length}>
                          <button onClick={() => handleEdit(event)} className="bg-[#fccc52] bg-opacity-20 text-center p-2 text-[#fccc52] rounded-full hover:text-[#ff914d]">
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDelete(event._id)} className="text-red-500 bg-red-500 bg-opacity-20 text-center p-2 rounded-full hover:text-red-600">
                            <FaTrash />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  <tr className="border-t border-[#ff914d]">
                    <td colSpan={10} className="bg-[#f9f9f9] p-4">
                      <h3 className="text-lg font-bold text-[#ff914d]">Event Details</h3>
                      <p><strong>Details:</strong> {event.eventDetails.details}</p>
                      <p><strong>Ticket Info:</strong> {event.eventDetails.ticketInfo}</p>
                      <p><strong>Additional Info:</strong> {event.eventDetails.additionalInfo}</p>
                      <p><strong>Food and Drink:</strong> {event.eventDetails.foodAndDrink}</p>
                    </td>
                  </tr>
                </>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center py-4">No events found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
              <label className="block mb-2 mt-4 text-black text-sm font-semibold">Status</label>
              <select
                value={selectedEvent.events.status}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    events:{
                      ...selectedEvent.events,
                      status: e.target.value,}
                  })
                }
                className="border border-gray-300 bg-white text-black p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
              >
                <option value="available">Available</option>
                <option value="booked">Booked</option>
              </select>

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
