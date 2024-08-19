import { useEffect, useState } from 'react';
import OperatorLayout from '@/components/operator/operatorLayout';
import { getListings, deleteListing, updateListing } from '@/stores/operator/ApiCallerOperatorHotel';
import { showToast } from '@/components/popup';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { CldUploadWidget } from 'next-cloudinary';
import { RiUploadCloudFill } from 'react-icons/ri';

interface Room {
  _id: string;
  roomNumber: string;
  status: string;
}

interface RoomType {
  _id: string;
  type: string;
  price: number;
  image: string;
  description: string;
  numberOfGuests: number;
  rooms: Room[];
}

interface Listing {
  _id: string;
  roomTypes: RoomType[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const ViewListingsPage = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const data = await getListings();
        setListings(data);
      } catch (error) {
        showToast("Error fetching listings", "error");
      }
      finally {
        setLoading(false); // End loading
      }
    };
    fetchListings();
  }, []);

  const handleDelete = async (listingId: string, roomTypeId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this room type? This action cannot be undone.");
    if (confirmDelete) {
      try {
        const listing = listings.find(listing => listing._id === listingId);
        if (listing) {
          await deleteListing(listingId);
          setListings(listings.filter(l => l._id !== listingId)); // Update the state by filtering out the deleted listing
          showToast("Room type deleted successfully", "success");
        }
      } catch (error) {
        showToast("Error deleting room type", "error");
      }
    }
  };
  

  const handleEdit = (listingId: string, roomTypeId: string) => {
    const listing = listings.find(listing => listing._id === listingId);
    if (listing) {
      const roomType = listing.roomTypes.find(roomType => roomType._id === roomTypeId);
      if (roomType) {
        setSelectedListing({ ...listing, roomTypes: [roomType] });
        setIsModalOpen(true);
      }
    }
  };

  const handleUpdate = async () => {
    if (selectedListing) {
      try {
        const listingToUpdate = listings.find(listing => listing._id === selectedListing._id);
        if (listingToUpdate) {
          listingToUpdate.roomTypes = listingToUpdate.roomTypes.map(rt =>
            rt._id === selectedListing.roomTypes[0]._id ? selectedListing.roomTypes[0] : rt
          );
          await updateListing(listingToUpdate);
          setListings(listings.map(l => l._id === listingToUpdate._id ? listingToUpdate : l));
          showToast("Listing updated successfully", "success");
          handleModalClose();
        }
      } catch (error) {
        showToast("Error updating listing", "error");
      }
    }
  };

  const handleModalClose = () => {
    setSelectedListing(null);
    setIsModalOpen(false);
  };

  const handleRoomInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    roomTypeIndex: number,
    roomIndex: number,
    field: keyof Room
  ) => {
    if (!selectedListing) return;
    const updatedListing = { ...selectedListing };
    if (
      updatedListing.roomTypes &&
      updatedListing.roomTypes[roomTypeIndex] &&
      updatedListing.roomTypes[roomTypeIndex].rooms[roomIndex]
    ) {
      updatedListing.roomTypes[roomTypeIndex].rooms[roomIndex] = {
        ...updatedListing.roomTypes[roomTypeIndex].rooms[roomIndex],
        [field]: e.target.value,
      };
      setSelectedListing(updatedListing);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    roomTypeIndex: number,
    field: keyof RoomType
  ) => {
    if (!selectedListing) return;

    let value: string | number = e.target.value;

    if (field === 'price' || field === 'numberOfGuests') {
      value = Number(value);
      if (isNaN(value) || value < 1) {
        showToast(`${field === 'price' ? 'Price' : 'Number of Guests'} must be at least 1`, "error");
        return;
      }
    }

    const updatedListing = { ...selectedListing };
    if (updatedListing.roomTypes && updatedListing.roomTypes[roomTypeIndex]) {
      updatedListing.roomTypes[roomTypeIndex] = {
        ...updatedListing.roomTypes[roomTypeIndex],
        [field]: value,
      };
      setSelectedListing(updatedListing);
    }
  };

  const handleImageUpload = (result: any, roomTypeIndex: number) => {
    if (result.event === 'success' && selectedListing) {
      const imageUrl = result.info.secure_url;
      const updatedListing = { ...selectedListing };
      updatedListing.roomTypes[roomTypeIndex].image = imageUrl;
      setSelectedListing(updatedListing);
    }
  };

  const RenderImageUpload = ({
    roomTypeIndex,
    image,
    onImageChange,
  }: {
    roomTypeIndex: number;
    image: string;
    onImageChange: (result: any) => void;
  }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(image);

    const handleUpload = (result: any) => {
      if (result.event === 'success') {
        const uploadedImageUrl = result.info.secure_url;
        setImageUrl(uploadedImageUrl);
        onImageChange(result);
      }
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
      <div className="relative mb-4">
        <CldUploadWidget uploadPreset="u06vgrf1" onSuccess={handleUpload}>
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
            <img src={imageUrl} alt="Room Preview" className="w-32 h-32 rounded-lg shadow-md" />
          </div>
        )}
      </div>
    );
  };

  return (
    <OperatorLayout>
      <h1 className="text-3xl drop-shadow-md text-center font-bold mb-8 bg-gradient-to-r from-[#ff914d] to-[#fccc52] bg-clip-text text-transparent">
        View Listings
      </h1>
      <div className="overflow-x-auto max-h-[42rem] rounded-lg overflow-y-scroll">
        <table className="min-w-full bg-white text-black rounded-lg shadow-md">
          <thead>
            <tr className="bg-gradient-to-r from-[#ff914d] to-[#fccc52] bg-opacity-10 rounded-lg text-white">
              <th className="py-2 px-4 text-left">Image</th>
              <th className="py-2 px-4 text-left">Room Type</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-center">Number of Guests</th>
              <th className="py-2 px-4 text-left">Room Number & Status</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) =>
              listing.roomTypes.map((roomType, index) => (
                <tr key={`${listing._id}-${index}`} className="border-t border-gray-300 drop-shadow-md">
                  <td className="py-2 px-4">
                    <img src={roomType.image} alt={roomType.type} className="w-14 h-14 object-cover rounded-lg shadow-md" />
                  </td>
                  <td className="py-2 px-4">{roomType.type}</td>
                  <td className="py-2 px-4">${roomType.price}</td>
                  <td className="py-2 px-4">{roomType.description}</td>
                  <td className="py-2 px-4 text-center">{roomType.numberOfGuests}</td>
                  <td className="py-2 px-4">
                    {roomType.rooms.map((room, roomIndex) => (
                      <div key={room._id} className="mb-1 flex gap-4">
                        <p>{room.roomNumber}</p>
                        <p>{room.status}</p>
                      </div>
                    ))}
                  </td>
                  <td className="py-2 px-4 flex justify-center space-x-4">
                    <button onClick={() => handleEdit(listing._id, roomType._id)} className="bg-[#fccc52] bg-opacity-20 text-center p-2 text-[#fccc52] rounded-full hover:text-[#ff914d]">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(listing._id, roomType._id)} className="text-red-500 bg-red-500 bg-opacity-20 text-center p-2 rounded-full hover:text-red-600">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-6">Edit Listing</h2>
            {selectedListing.roomTypes.map((roomType, roomTypeIndex) => (
              <div key={roomType._id} className="mb-6">
                <label className="block mb-2 text-black text-sm font-semibold">Room Type</label>
                <input
                  type="text"
                  value={roomType.type}
                  onChange={(e) => handleInputChange(e, roomTypeIndex, 'type')}
                  className="border border-gray-300 bg-white text-black p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
                />
                <label className="block mb-2 mt-4 text-black text-sm font-semibold">Price</label>
                <input
                  type="number"
                  value={roomType.price}
                  onChange={(e) => handleInputChange(e, roomTypeIndex, 'price')}
                  className="border border-gray-300 bg-white text-black p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
                />
                <label className="block mb-2 mt-4 text-black text-sm font-semibold">Room Image</label>
                <RenderImageUpload
                  roomTypeIndex={roomTypeIndex}
                  image={roomType.image}
                  onImageChange={(result) => handleImageUpload(result, roomTypeIndex)}
                />

                <label className="block mb-2 mt-4 text-black text-sm font-semibold">Description</label>
                <textarea
                  value={roomType.description}
                  onChange={(e) => handleInputChange(e, roomTypeIndex, 'description')}
                  className="border border-gray-300 bg-white text-black p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
                />
                <label className="block mb-2 mt-4 text-black text-sm font-semibold">Number of Guests</label>
                <input
                  type="number"
                  value={roomType.numberOfGuests}
                  onChange={(e) => handleInputChange(e, roomTypeIndex, 'numberOfGuests')}
                  className="border border-gray-300 bg-white text-black p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
                />

                <h3 className="text-lg font-bold text-black mt-6 mb-4">Rooms</h3>
                {roomType.rooms.map((room, roomIndex) => (
                  <div key={room._id} className="mt-4 bg-gray-100 p-4 rounded-lg">
                    <label className="block mb-2 text-black text-sm font-semibold">Room Number</label>
                    <input
                      type="text"
                      value={room.roomNumber}
                      onChange={(e) => handleRoomInputChange(e, roomTypeIndex, roomIndex, 'roomNumber')}
                      className="border border-gray-300 bg-white text-black p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
                    />
                    <label className="block mb-2 mt-4 text-black text-sm font-semibold">Status</label>
                    <select
                      value={room.status}
                      onChange={(e) => handleRoomInputChange(e, roomTypeIndex, roomIndex, 'status')}
                      className="border border-gray-300 bg-white text-black p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
                    >
                      <option value="available">Available</option>
                      <option value="booked">Booked</option>
                    </select>
                  </div>
                ))}
              </div>
            ))}
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
      )}
    </OperatorLayout>
  );
};

export default ViewListingsPage;
