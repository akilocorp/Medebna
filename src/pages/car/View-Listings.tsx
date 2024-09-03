import { useEffect, useState } from 'react';
import OperatorLayout from '@/components/operator/operatorLayout';
import { getCarListings, deleteCarListing, updateCarListing } from '@/stores/operator/ApiCallerOperatorCar';
import { showToast } from '@/components/popup';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { updateCarRental } from '@/stores/operator/operatorSliceCar';
import { CldUploadWidget } from 'next-cloudinary';
import { RiUploadCloudFill } from 'react-icons/ri';

interface Car {
  _id: string;
  type: string;
  price: number;
  image: string;
  description: string;
  status: string;
  numberOfCars: number;
}

interface CarDetails {
  details: string;
  rentalInfo: string;
  additionalInfo: string;
}

interface CarListing {
  _id: string;
  cars: Car[];
  carDetails: CarDetails;
  numberOfCars: number;
}

const ViewCarListingsPage = () => {
  const [carListings, setCarListings] = useState<CarListing[]>([]);
  const [selectedCar, setSelectedCar] = useState<CarListing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Fetch car listings
  const fetchCarListings = async () => {
    setLoading(true);
    try {
      const data = await getCarListings();
      setCarListings(data);
    } catch (error) {
      showToast("Error fetching car listings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarListings(); // Call fetchCarListings on component mount
  }, []);

  const handleDelete = async (carId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this car? This action cannot be undone.");
    if (confirmDelete) {
      try {
        await deleteCarListing(carId);
        setCarListings((prevListings) =>
          prevListings.filter(carListing => carListing._id !== carId)
        );
        showToast("Car deleted successfully", "success");
      } catch (error) {
        showToast("Error deleting car", "error");
      }
    }
  };

  const handleEdit = (carListing: CarListing) => {
    setSelectedCar(carListing);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (selectedCar) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("Token not found");
        }

        const updatedCar = await updateCarListing(selectedCar, selectedCar._id as string, token);
        dispatch(updateCarRental({ id: selectedCar._id as string, carRental: updatedCar }));
        showToast("Car updated successfully", "success");
        
        // Re-fetch the car listings to refresh the page
        await fetchCarListings();
        
        setIsModalOpen(false);
      } catch (error) {
        showToast("Error updating car", "error");
      }
    }
  };

  const handleModalClose = () => {
    setSelectedCar(null);
    setIsModalOpen(false);
  };

  const handleImageUpload = (result: any) => {
    if (result.event === 'success' && selectedCar) {
      const imageUrl = result.info.secure_url;
      setSelectedCar({
        ...selectedCar,
        cars: [
          {
            ...selectedCar.cars[0],
            image: imageUrl,
          },
        ],
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
            <img src={imageUrl} alt="Car Preview" className="w-32 h-32 rounded-lg shadow-md" />
          </div>
        )}
      </div>
    );
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
      <h1 className="text-2xl font-bold mb-6">View Car Listings</h1>
      <div className="overflow-x-auto max-h-[42rem] rounded-lg overflow-y-scroll">
        <table className="min-w-full bg-white text-black rounded-lg shadow-md">
          <thead>
            <tr className="bg-gradient-to-r from-[#ff914d] to-[#fccc52] bg-opacity-10 rounded-lg text-white">
              <th className="py-2 px-4 text-left">Image</th>
              <th className="py-2 px-4 text-left">Car Type</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {carListings.map((listing) =>
              listing.cars.map((car, index) => (
                <>
                  <tr key={`${listing._id}-${index}`} className="border-t border-gray-300 drop-shadow-md">
                    <td className="py-2 px-4">
                      <img src={car.image} alt={car.type} className="w-14 h-14 object-cover rounded-lg shadow-md" />
                    </td>
                    <td className="py-2 px-4">{car.type}</td>
                    <td className="py-2 px-4">${car.price}</td>
                    <td className="py-2 px-4">{car.description}</td>
                    <td className="py-2 px-4">{car.status}</td>
                    <td className="py-2 px-4 flex justify-center space-x-4">
                      <button onClick={() => handleEdit(listing)} className="bg-[#fccc52] bg-opacity-20 text-center p-2 text-[#fccc52] rounded-full hover:text-[#ff914d]">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(car._id)} className="text-red-500 bg-red-500 bg-opacity-20 text-center p-2 rounded-full hover:text-red-600">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                  <tr key={`${listing._id}-details-${index}`} className="border-t border-gray-300 drop-shadow-md">
                    <td colSpan={6} className="py-2 px-4">
                      <h3 className="text-lg font-bold text-[#ff914d]">Car Details</h3>
                      <p><strong>Details:</strong> {listing.carDetails.details}</p>
                      <p><strong>Rental Info:</strong> {listing.carDetails.rentalInfo}</p>
                      <p><strong>Additional Info:</strong> {listing.carDetails.additionalInfo}</p>
                    </td>
                  </tr>
                </>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-black mb-6">Edit Car Listing</h2>
            <div>
              <label className="block mb-2 text-black text-sm font-semibold">Car Type</label>
              <input
                type="text"
                value={selectedCar.cars[0].type}
                onChange={(e) =>
                  setSelectedCar({
                    ...selectedCar,
                    cars: [
                      {
                        ...selectedCar.cars[0],
                        type: e.target.value,
                      },
                    ],
                  })
                }
                className="border border-gray-300 bg-white text-black p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
              />
              <label className="block mb-2 mt-4 text-black text-sm font-semibold">Price</label>
              <input
                type="number"
                value={selectedCar.cars[0].price}
                onChange={(e) =>
                  setSelectedCar({
                    ...selectedCar,
                    cars: [
                      {
                        ...selectedCar.cars[0],
                        price: Number(e.target.value),
                      },
                    ],
                  })
                }
                className="border border-gray-300 bg-white text-black p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
              />
              <label className="block mb-2 mt-4 text-black text-sm font-semibold">Car Image</label>
              <RenderImageUpload image={selectedCar.cars[0].image} />
              <label className="block mb-2 mt-4 text-black text-sm font-semibold">Description</label>
              <textarea
                value={selectedCar.cars[0].description}
                onChange={(e) =>
                  setSelectedCar({
                    ...selectedCar,
                    cars: [
                      {
                        ...selectedCar.cars[0],
                        description: e.target.value,
                      },
                    ],
                  })
                }
                className="border border-gray-300 bg-white text-black p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
              />
              <label className="block mb-2 mt-4 text-black text-sm font-semibold">Status</label>
              <select
                value={selectedCar.cars[0].status}
                onChange={(e) =>
                  setSelectedCar({
                    ...selectedCar,
                    cars: [
                      {
                        ...selectedCar.cars[0],
                        status: e.target.value,
                      },
                    ],
                  })
                }
                className="border border-gray-300 bg-white text-black p-3 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
              >
                <option value="available">Available</option>
                <option value="booked">Booked</option>
              </select>

              {/* Car Details Editing */}
              <h3 className="text-lg font-bold text-[#ff914d] mt-6 mb-4">Car Details</h3>
              <label className="block mb-2 text-black text-sm font-semibold">Details</label>
              <textarea
                value={selectedCar.carDetails.details}
                onChange={(e) =>
                  setSelectedCar({
                    ...selectedCar,
                    carDetails: {
                      ...selectedCar.carDetails,
                      details: e.target.value,
                    },
                  })
                }
                className="border border-gray-300 bg-white text-black p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
              />
              <label className="block mb-2 mt-4 text-black text-sm font-semibold">Rental Info</label>
              <textarea
                value={selectedCar.carDetails.rentalInfo}
                onChange={(e) =>
                  setSelectedCar({
                    ...selectedCar,
                    carDetails: {
                      ...selectedCar.carDetails,
                      rentalInfo: e.target.value,
                    },
                  })
                }
                className="border border-gray-300 bg-white text-black p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
              />
              <label className="block mb-2 mt-4 text-black text-sm font-semibold">Additional Info</label>
              <textarea
                value={selectedCar.carDetails.additionalInfo}
                onChange={(e) =>
                  setSelectedCar({
                    ...selectedCar,
                    carDetails: {
                      ...selectedCar.carDetails,
                      additionalInfo: e.target.value,
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

export default ViewCarListingsPage;
