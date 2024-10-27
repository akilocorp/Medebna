// pages/operator/ViewCarListingsPage.tsx

import React, { useEffect, useState } from 'react';
import OperatorLayout from '@/components/operator/operatorLayout';
import { getCarListings, deleteCarListing, updateCarListing } from '@/stores/operator/ApiCallerOperatorCar';
import { showToast } from '@/components/popup';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { updateCarRental } from '@/stores/operator/operatorSliceCar';
import { CldUploadWidget } from 'next-cloudinary';
import { RiUploadCloudFill } from 'react-icons/ri';

interface CarSpecificity {
  numberOfCars: number;
  color: string;
  status: string;
  image: string;
}

interface Car {
  _id: string;
  type: string;
  price: number;
  description: string;
  carSpecificity: CarSpecificity[];
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
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch();

  const fetchCarListings = async () => {
    setLoading(true);
    try {
      const data = await getCarListings();
      setCarListings(data);
    } catch (error) {
      showToast('Error fetching car listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarListings();
  }, []);

  // Handle delete using car listing._id
  const handleDelete = async (carId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this car listing?');
    if (confirmDelete) {
      try {
        await deleteCarListing(carId);
        setCarListings((prevListings) => prevListings.filter((listing) => listing._id !== carId));
        showToast('Car listing deleted successfully', 'success');
      } catch (error) {
        showToast(`Error deleting car listing: ${(error as Error).message}`, 'error');
      }
    }
  };

  const handleEdit = (carListing: CarListing) => {
    setSelectedCar(carListing);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (selectedCar) {
      setSaving(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token not found');

        const carRental = {
          ...selectedCar,
          numberOfCars: selectedCar.cars.length,
        };

        const updatedCar = await updateCarListing(carRental, selectedCar._id as string, token);

        dispatch(updateCarRental({ id: selectedCar._id as string, carRental: updatedCar }));
        showToast('Car listing updated successfully', 'success');
        await fetchCarListings();
        setIsModalOpen(false);
      } catch (error) {
        showToast('Error updating car listing', 'error');
      } finally {
        setSaving(false);
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
        cars: selectedCar.cars.map((car, index) =>
          index === 0
            ? {
                ...car,
                carSpecificity: car.carSpecificity.map((spec, specIndex) =>
                  specIndex === 0
                    ? { ...spec, image: imageUrl }
                    : spec
                ),
              }
            : car
        ),
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
            <img src={imageUrl} alt="Car Preview" className="w-32 h-32 rounded-lg shadow-md object-cover" />
          </div>
        )}
      </div>
    );
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
      <h1 className="text-3xl font-bold mb-8 text-[#ff914d]">Car Listings</h1>
      
      {/* Vertical Stack of Responsive Car Cards */}
      <div className="space-y-6">
        {Array.isArray(carListings) && carListings.length > 0 ? (
          carListings.map((listing) => (
            <div key={listing._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
              {/* Car Image */}
              <div className="md:w-1/3">
                <img
                  src={listing.cars[0].carSpecificity[0].image}
                  alt={listing.cars[0].type}
                  className="w-full h-48 object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                />
                {/* Car Details Toggle */}
                <details className="mt-4 p-2">
                  <summary className="cursor-pointer text-[#ff914d] font-semibold">View Details</summary>
                  <div className="mt-2 text-gray-700">
                    <p><strong>Details:</strong> {listing.carDetails.details}</p>
                    <p><strong>Rental Info:</strong> {listing.carDetails.rentalInfo}</p>
                    <p><strong>Additional Info:</strong> {listing.carDetails.additionalInfo}</p>
                  </div>
                </details>
              </div>
              
              {/* Car Details */}
              <div className="p-4 md:w-2/3 flex flex-col justify-between">
                {/* Header with Car Info and Action Buttons */}
                <div className="flex justify-between items-start">
                  {/* Car Information */}
                  <div className="flex-1 pr-4">
                    <h2 className="text-2xl font-bold text-[#ff914d] mb-2">{listing.cars[0].type}</h2>
                    <p className="text-gray-600 mb-1"><strong>Price:</strong> ${listing.cars[0].price}</p>
                    <p className="text-gray-600 mb-1"><strong>Description:</strong> {listing.cars[0].description}</p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-row justify-between gap-4">
                    <button
                      onClick={() => handleEdit(listing)}
                      className="flex items-center justify-center bg-[#fccc52] bg-opacity-40 text-[#ff914d] p-3 rounded-full shadow hover:bg-opacity-100 hover:text-white transition-colors duration-300"
                    >
                      <FaEdit /> 
                    </button>
                    <button
                      onClick={() => handleDelete(listing._id)}
                      className="flex items-center justify-center bg-red-200 text-red-500 p-3 rounded-full shadow hover:bg-red-300 transition-colors duration-300"
                    >
                      <FaTrash /> 
                    </button>
                  </div>
                </div>
                
                {/* Car Specificity */}
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-[#ff914d] mb-2">Car Specificity</h3>
                  {listing.cars[0].carSpecificity.map((spec, specIndex) => (
                    <div key={specIndex} className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded">
                      <div>
                        <p className="text-gray-800"><strong>Number of Cars:</strong> {spec.numberOfCars}</p>
                        <p className="text-gray-800"><strong>Color:</strong> {spec.color}</p>
                      </div>
                      <div className="flex items-center">
                        <img
                          src={spec.image}
                          alt={spec.color}
                          className="w-10 h-10 rounded-full mr-2 object-cover"
                        />
                        <p className={`text-sm ${spec.status === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                          {spec.status.charAt(0).toUpperCase() + spec.status.slice(1)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No car listings found</p>
        )}
      </div>

      {/* Modal for Editing Car Listings */}
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
              
              <RenderImageUpload image={selectedCar.cars[0].carSpecificity[0].image} />
              
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
                value={selectedCar.cars[0].carSpecificity[0].status}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  setSelectedCar({
                    ...selectedCar,
                    cars: [
                      {
                        ...selectedCar.cars[0],
                        carSpecificity: [
                          {
                            ...selectedCar.cars[0].carSpecificity[0],
                            status: newStatus,
                          },
                        ],
                      },
                    ],
                  });
                }}
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

              {/* Action Buttons */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleUpdate}
                  className={`bg-[#fccc52] text-[#323232] font-semibold px-6 py-3 rounded-full hover:bg-[#ff914d] transition-colors duration-300 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
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
