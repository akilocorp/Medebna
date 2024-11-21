import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import {
  fetchCarOwnerProfile,
  updateCarOwnerProfile,
} from "@/stores/operator/carprofileapicaller";
import OperatorLayout from "@/components/operator/operatorLayout";
import { FaStar, FaStarHalfAlt, FaRegStar, FaEdit } from "react-icons/fa";
import { RiUploadCloudFill } from "react-icons/ri";
import { CldUploadWidget } from "next-cloudinary";
import jwt from "jsonwebtoken";
import { fetchAccountData } from '@/stores/operator/ApiCaller';

interface RentalRules {
  rentalDuration: string;
  cancellationPolicy: string;
  prepayment: boolean;
  noAgeRestriction: boolean;
  additionalInfo: string;
  acceptedPaymentMethods: string;
}

interface CarOwnerProfile {
  _id: string;
  address: string;
  zipCode: string;
  city: string;
  companyImage: string;
  description: string;
  rating: number;
  rentalRules: RentalRules;
}

const CarOwnerProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<CarOwnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [accountData, setAccountData] = useState<any | null>(null);
  const [accountLoading, setAccountLoading] = useState<boolean>(true);
  const [accountError, setAccountError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You must be logged in to view this profile.");
          return;
        }

        const decoded: any = jwt.decode(token);
        const carOwnerId = decoded?.id || null;
        setUserName(decoded?.name || null);

        if (!carOwnerId) {
          toast.error("Invalid token.");
          return;
        }

        const fetchedProfile = await fetchCarOwnerProfile(carOwnerId);
        if (fetchedProfile) {
          setProfile(fetchedProfile);
          try {
            const account = await fetchAccountData(carOwnerId);
            setAccountData(account);
          } catch (error: any) {
            setAccountError(error.message || 'Failed to fetch account data');
          } finally {
            setAccountLoading(false);
          }
        } else {
          toast.error("Profile not found.");
        }
      } catch (error) {
     
        toast.error("Error fetching profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevState) =>
      prevState ? { ...prevState, [name]: value } : null
    );
  };

  const handleRentalRulesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setProfile((prevState) =>
      prevState
        ? {
            ...prevState,
            rentalRules: {
              ...prevState.rentalRules,
              [name]: newValue,
            },
          }
        : null
    );
  };

  const handleImageUpload = (result: any) => {
    if (result.event === "success" && profile) {
      const imageUrl = result.info.secure_url;
      setProfile((prevState) =>
        prevState
          ? {
              ...prevState,
              companyImage: imageUrl,
            }
          : null
      );
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      try {
        // Update the profile
        const updatedProfile = await updateCarOwnerProfile(profile._id, profile);
  
        // Show success toast notification
        toast.success("Profile updated successfully.");
  
        // Refresh the profile data
        const refreshedProfile = await fetchCarOwnerProfile(profile._id);
        if (refreshedProfile) {
          setProfile(refreshedProfile);
        } else {
          toast.error("Error refreshing profile data.");
        }
  
        // Exit editing mode
        setIsEditing(false);
      } catch (error) {
       
        toast.error("Error updating profile.");
      }
    }
  };
  
  

  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-[#ff914d]" />);
      } else if (i - rating < 1 && i - rating > 0) {
        stars.push(<FaStarHalfAlt key={i} className="text-[#ff914d]" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-[#ff914d]" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f9f9f9]">
        <div className="text-center">
          <p className="text-[#fccc52] text-lg font-semibold">
            Loading, please wait...
          </p>
        </div>
      </div>
    );
  }

  return (
    <OperatorLayout>
      {profile ? (
        <div className="relative max-w-4xl mx-auto max-h-[45rem] overflow-y-scroll p-8 bg-[#ffffff] shadow-lg rounded-lg">
             {accountLoading ? (
        <p>Loading account data...</p>
      ) : accountError ? (
        <p>Error: {accountError}</p>
      ) : accountData ? (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-[#ff914d] mb-3">Account Information</h3>
          <p className="text-black">Account Name: {accountData.accountName}</p>
          <p className="text-black">Account Number: {accountData.accountNumber}</p>
        </div>
      ) : (
        <p>No account data available.</p>
      )}
          <button
            onClick={handleEditClick}
            className="absolute top-4 right-4 text-black hover:text-[#ff914d]"
          >
            <FaEdit size={24} />
          </button>

          {isEditing ? (
            <form onSubmit={handleFormSubmit} className="space-y-8">
              {/* Address Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#fccc52]">
                  Address Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-black mb-1">Address</label>
                    <input
                      name="address"
                      type="text"
                      value={profile.address}
                      onChange={handleInputChange}
                      placeholder="Enter address"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Zip Code</label>
                    <input
                      name="zipCode"
                      type="text"
                      value={profile.zipCode}
                      onChange={handleInputChange}
                      placeholder="Enter zip code"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-black mb-1">City</label>
                    <input
                      name="city"
                      type="text"
                      value={profile.city}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                </div>
              </div>

              {/* Company Details Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#fccc52]">
                  Company Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-black mb-1">
                      Company Image
                    </label>
                    <CldUploadWidget
                      uploadPreset="u06vgrf1"
                      onSuccess={handleImageUpload}
                    >
                      {({ open }) => (
                        <button
                          type="button"
                          className="block w-full p-2 py-2 rounded-full border text-gray-800 border-[#fccc52] cursor-pointer flex items-center justify-center bg-[#ffffff] shadow-md"
                          onClick={() => open()}
                        >
                          <RiUploadCloudFill className="mr-2 text-lg text-[#ff914d]" />
                          {profile.companyImage
                            ? "Change Image"
                            : "Upload Image"}
                        </button>
                      )}
                    </CldUploadWidget>
                    {profile.companyImage && (
                      <div className="mt-4">
                        <img
                          src={profile.companyImage}
                          alt="Company"
                          className="w-32 h-32 rounded-lg shadow-md"
                        />
                      </div>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-black mb-1">Description</label>
                    <input
                      name="description"
                      type="text"
                      value={profile.description}
                      onChange={handleInputChange}
                      placeholder="Enter description"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Rating</label>
                    <input
                      name="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={profile.rating}
                      onChange={handleInputChange}
                      placeholder="Enter rating"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                    <div className="flex items-center space-x-1 mt-2">
                      {renderRatingStars(profile.rating)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rental Rules Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#fccc52]">
                  Rental Rules
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-black mb-1">
                      Rental Duration
                    </label>
                    <input
                      name="rentalDuration"
                      type="text"
                      value={profile.rentalRules.rentalDuration}
                      onChange={handleRentalRulesChange}
                      placeholder="Enter rental duration"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">
                      Cancellation Policy
                    </label>
                    <input
                      name="cancellationPolicy"
                      type="text"
                      value={profile.rentalRules.cancellationPolicy}
                      onChange={handleRentalRulesChange}
                      placeholder="Enter cancellation policy"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-black mb-1">Prepayment</label>
                    <input
                      name="prepayment"
                      type="checkbox"
                      checked={profile.rentalRules.prepayment}
                      onChange={handleRentalRulesChange}
                      className="mr-2 leading-tight"
                    />
                    <span className="text-sm text-gray-600">
                      {profile.rentalRules.prepayment ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-black mb-1">
                      Additional Info
                    </label>
                    <input
                      name="additionalInfo"
                      type="text"
                      value={profile.rentalRules.additionalInfo}
                      onChange={handleRentalRulesChange}
                      placeholder="Enter additional info"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-black mb-1">
                      Accepted Payment Methods
                    </label>
                    <input
                      name="acceptedPaymentMethods"
                      type="text"
                      value={profile.rentalRules.acceptedPaymentMethods}
                      onChange={handleRentalRulesChange}
                      placeholder="Enter accepted payment methods"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-black mb-1">
                      No Age Restriction
                    </label>
                    <input
                      name="noAgeRestriction"
                      type="checkbox"
                      checked={profile.rentalRules.noAgeRestriction}
                      onChange={handleRentalRulesChange}
                      className="mr-2 leading-tight"
                    />
                    <span className="text-sm text-gray-600">
                      {profile.rentalRules.noAgeRestriction ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  type="submit"
                  className="bg-[#ff914d] text-white py-2 px-6 rounded-full shadow-md hover:bg-[#fccc52] focus:outline-none focus:ring-2 focus:ring-[#fccc52]"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white py-2 px-6 rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex items-center mb-8">
                <img
                  src={profile.companyImage}
                  alt="Company"
                  className="w-32 h-32 rounded-full shadow-lg mr-8"
                />
                <div>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-[#ff914d]">
                      {userName}
                    </h2>
                  </div>
                  <h2 className="font-bold text-[#ff914d] text-opacity-50 mb-2">
                    {profile.city}
                  </h2>
                  <p className="text-black">{profile.address}</p>
                  <p className="text-black">{profile.zipCode}</p>
                  <div className="flex items-center mt-2">
                    <div className="flex">
                      {renderRatingStars(profile.rating)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#ff914d] mb-3">
                  Description
                </h3>
                <p className="text-black">{profile.description}</p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#ff914d] mb-3">
                  Rental Rules
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">
                      Rental Duration
                    </h4>
                    <p className="text-black">
                      {profile.rentalRules.rentalDuration || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">
                      Cancellation Policy
                    </h4>
                    <p className="text-black">
                      {profile.rentalRules.cancellationPolicy || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">
                      Prepayment
                    </h4>
                    <p className="text-black">
                      {profile.rentalRules.prepayment ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">
                      No Age Restriction
                    </h4>
                    <p className="text-black">
                      {profile.rentalRules.noAgeRestriction ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">
                      Additional Info
                    </h4>
                    <p className="text-black">
                      {profile.rentalRules.additionalInfo || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">
                      Accepted Payment Methods
                    </h4>
                    <p className="text-black">
                      {profile.rentalRules.acceptedPaymentMethods || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-black">No profile data available.</p>
      )}
    </OperatorLayout>
  );
};

export default CarOwnerProfilePage;
