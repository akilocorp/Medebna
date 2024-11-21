import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { fetchHotelOwnerProfile, updateHotelOwnerProfile } from '@/stores/operator/hotelprofileapicaller';
import OperatorLayout from '@/components/operator/operatorLayout';
import { FaStar, FaStarHalfAlt, FaRegStar, FaEdit } from 'react-icons/fa';
import { RiUploadCloudFill } from 'react-icons/ri';
import { CldUploadWidget } from 'next-cloudinary';
import jwt from 'jsonwebtoken';
import { fetchAccountData } from '@/stores/operator/ApiCaller';


interface Facilities {
  popularFacilities: string[];
  roomAmenities: string[];
  outdoorFacilities: string[];
  kitchenFacilities: string[];
  mediaTech: string[];
  foodDrink: string[];
  transportFacilities: string[];
  receptionServices: string[];
  cleaningServices: string[];
  businessFacilities: string[];
  safetyFacilities: string[];
  generalFacilities: string[];
  accessibility: string[];
  wellnessFacilities: string[];
  languages: string[];
}

interface CheckInOut {
  time: string;
  description: string;
}

interface HouseRules {
  checkIn: CheckInOut;
  checkOut: CheckInOut;
  cancellationPrepayment: string;
  childrenAndBeds: string;
  cribsAndExtraBedPolicies: string;
  noAgeRestriction: string;
  pets: string;
  acceptedPaymentMethods: string;
}

interface HotelProfileBase {
  address: string;
  zipCode: string;
  city: string;
  companyImage: string;
  description: string;
  rating: number;
  facilities: Facilities;
  houseRules: HouseRules;
  createdBy: string;
}

interface HotelProfile extends HotelProfileBase {
  _id: string;
}

const ViewHotelOwnerProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<HotelProfile>({
    address: '',
    zipCode: '',
    city: '',
    companyImage: '',
    description: '',
    rating: 0,
    facilities: {
      popularFacilities: [],
      roomAmenities: [],
      outdoorFacilities: [],
      kitchenFacilities: [],
      mediaTech: [],
      foodDrink: [],
      transportFacilities: [],
      receptionServices: [],
      cleaningServices: [],
      businessFacilities: [],
      safetyFacilities: [],
      generalFacilities: [],
      accessibility: [],
      wellnessFacilities: [],
      languages: [],
    },
    houseRules: {
      checkIn: { time: '', description: '' },
      checkOut: { time: '', description: '' },
      cancellationPrepayment: '',
      childrenAndBeds: '',
      cribsAndExtraBedPolicies: '',
      noAgeRestriction: '',
      pets: '',
      acceptedPaymentMethods: '',
    },
    createdBy: '',
    _id: ''
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { id: queryId } = router.query;
  const [ownerName, setOwnerName] = useState<string | null>(null);
  const [facilityInputs, setFacilityInputs] = useState<Partial<Record<keyof Facilities, string>>>({});
  const [accountData, setAccountData] = useState<any | null>(null);
  const [accountLoading, setAccountLoading] = useState<boolean>(true);
  const [accountError, setAccountError] = useState<string | null>(null);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded: any = jwt.decode(token);
          const hotelOwnerId = decoded?.id || null;
          setOwnerName(decoded?.name || null);

          if (hotelOwnerId) {
            const response = await fetchHotelOwnerProfile(hotelOwnerId);
            if (response && response.data && response.data.hotelProfile) {
              setProfileData(response.data.hotelProfile);
              try {
                const account = await fetchAccountData(hotelOwnerId);
                setAccountData(account);
              } catch (error: any) {
                setAccountError(error.message || 'Failed to fetch account data');
              } finally {
                setAccountLoading(false);
              }
            } else {
              toast.error('Please first add profile.');
            }
          } else {
          
            toast.error('Invalid token.');
          }
        } else {
          
          toast.error('You must be logged in to view this profile.');
        }
      } catch (error) {
       
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
    setProfileData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFacilityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    facilityType: keyof Facilities
  ) => {
    const { value } = e.target;
    setFacilityInputs(prevState => ({
      ...prevState,
      [facilityType]: value,
    }));
  };

  const handleFacilityBlur = (facilityType: keyof Facilities) => {
    const inputValue = facilityInputs[facilityType];
  
    if (inputValue && typeof inputValue === 'string') {
      setProfileData(prevState => ({
        ...prevState,
        facilities: {
          ...prevState.facilities,
          [facilityType]: inputValue.split(',').map((item: string) => item.trim()),
        },
      }));
    }
  };
  
  const handleHouseRuleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    ruleType: keyof HouseRules
  ) => {
    const { name, value } = e.target;

    setProfileData(prevState => {
      const newHouseRules = { ...prevState.houseRules };

      if (ruleType === 'checkIn' || ruleType === 'checkOut') {
        newHouseRules[ruleType] = {
          ...prevState.houseRules[ruleType],
          [name]: value,
        };
      } else {
        newHouseRules[ruleType] = value;
      }

      return {
        ...prevState,
        houseRules: newHouseRules,
      };
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      Object.keys(facilityInputs).forEach(key => {
        const facilityType = key as keyof Facilities;
        if (facilityInputs[facilityType]) {
          profileData.facilities[facilityType] = facilityInputs[facilityType]!.split(',').map(item => item.trim());
        }
      });

      const updatedProfile = await updateHotelOwnerProfile(profileData._id, profileData);
      setProfileData(updatedProfile);
      toast.success('Profile updated successfully.');
      setIsEditing(false);
    } catch (error) {
      
      toast.error('Error updating profile.');
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

  const handleImageUpload = (result: any) => {
    if (result.event === 'success') {
      const uploadedImageUrl = result.info.secure_url;
      setProfileData(prevState => ({
        ...prevState,
        companyImage: uploadedImageUrl,
      }));
    }
  };

  const RenderImageUpload = ({
    image,
    onImageChange,
  }: {
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

    return (
      <div className="relative mb-4">
        <CldUploadWidget uploadPreset="u06vgrf1" onSuccess={handleUpload}>
          {({ open }) => (
            <button
              type="button"
              className="block w-full p-2 py-2 rounded-full border text-gray-800 border-[#fccc52] cursor-pointer flex items-center justify-center bg-[#ffffff] shadow-md"
              onClick={() => open()}
            >
              <RiUploadCloudFill className="mr-2 text-lg text-[#ff914d]" />
              {imageUrl ? 'Change Image' : 'Upload Image'}
            </button>
          )}
        </CldUploadWidget>
        {imageUrl && (
          <div className="mt-4">
            <img src={imageUrl} alt="Preview" className="w-32 h-32 rounded-lg shadow-md" />
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
      {profileData ? (
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
          <button onClick={handleEditClick} className="absolute top-4 right-4 text-black hover:text-[#ff914d]">
            <FaEdit size={24} />
          </button>

          {isEditing ? (
            <form onSubmit={handleFormSubmit} className="space-y-8">
              {/* Address Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#fccc52]">Address Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-black mb-1">Address</label>
                    <input
                      name="address"
                      type="text"
                      value={profileData.address}
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
                      value={profileData.zipCode}
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
                      value={profileData.city}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                </div>
              </div>

              {/* Company Details Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#fccc52]">Company Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-black mb-1">Company Image</label>
                    <RenderImageUpload
                      image={profileData.companyImage}
                      onImageChange={handleImageUpload}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-black mb-1">Description</label>
                    <input
                      name="description"
                      value={profileData.description}
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
                      value={profileData.rating}
                      onChange={handleInputChange}
                      placeholder="Enter rating"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                </div>
              </div>

              {/* Facilities Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#fccc52]">Facilities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-black mb-1">Popular Facilities</label>
                    <input
                      name="popularFacilities"
                      type="text"
                      value={facilityInputs.popularFacilities || profileData.facilities.popularFacilities.join(', ')}
                      onChange={(e) => handleFacilityInputChange(e, 'popularFacilities')}
                      onBlur={() => handleFacilityBlur('popularFacilities')}
                      placeholder="Enter popular facilities"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Room Amenities</label>
                    <input
                      name="roomAmenities"
                      type="text"
                      value={facilityInputs.roomAmenities || profileData.facilities.roomAmenities.join(', ')}
                      onChange={(e) => handleFacilityInputChange(e, 'roomAmenities')}
                      onBlur={() => handleFacilityBlur('roomAmenities')}
                      placeholder="Enter room amenities"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Outdoor Facilities</label>
                    <input
                      name="outdoorFacilities"
                      type="text"
                      value={facilityInputs.outdoorFacilities || profileData.facilities.outdoorFacilities.join(', ')}
                      onChange={(e) => handleFacilityInputChange(e, 'outdoorFacilities')}
                      onBlur={() => handleFacilityBlur('outdoorFacilities')}
                      placeholder="Enter outdoor facilities"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Kitchen Facilities</label>
                    <input
                      name="kitchenFacilities"
                      type="text"
                      value={facilityInputs.kitchenFacilities || profileData.facilities.kitchenFacilities.join(', ')}
                      onChange={(e) => handleFacilityInputChange(e, 'kitchenFacilities')}
                      onBlur={() => handleFacilityBlur('kitchenFacilities')}
                      placeholder="Enter kitchen facilities"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Media & Tech</label>
                    <input
                      name="mediaTech"
                      type="text"
                      value={facilityInputs.mediaTech || profileData.facilities.mediaTech.join(', ')}
                      onChange={(e) => handleFacilityInputChange(e, 'mediaTech')}
                      onBlur={() => handleFacilityBlur('mediaTech')}
                      placeholder="Enter media & tech"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Food & Drink</label>
                    <input
                      name="foodDrink"
                      type="text"
                      value={facilityInputs.foodDrink || profileData.facilities.foodDrink.join(', ')}
                      onChange={(e) => handleFacilityInputChange(e, 'foodDrink')}
                      onBlur={() => handleFacilityBlur('foodDrink')}
                      placeholder="Enter food & drink"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Transport Facilities</label>
                    <input
                      name="transportFacilities"
                      type="text"
                      value={facilityInputs.transportFacilities || profileData.facilities.transportFacilities.join(', ')}
                      onChange={(e) => handleFacilityInputChange(e, 'transportFacilities')}
                      onBlur={() => handleFacilityBlur('transportFacilities')}
                      placeholder="Enter transport facilities"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Reception Services</label>
                    <input
                      name="receptionServices"
                      type="text"
                      value={facilityInputs.receptionServices || profileData.facilities.receptionServices.join(', ')}
                      onChange={(e) => handleFacilityInputChange(e, 'receptionServices')}
                      onBlur={() => handleFacilityBlur('receptionServices')}
                      placeholder="Enter reception services"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Cleaning Services</label>
                    <input
                      name="cleaningServices"
                      type="text"
                      value={facilityInputs.cleaningServices || profileData.facilities.cleaningServices.join(', ')}
                      onChange={(e) => handleFacilityInputChange(e, 'cleaningServices')}
                      onBlur={() => handleFacilityBlur('cleaningServices')}
                      placeholder="Enter cleaning services"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Business Facilities</label>
                    <input
                      name="businessFacilities"
                      type="text"
                      value={facilityInputs.businessFacilities || profileData.facilities.businessFacilities.join(', ')}
                      onChange={(e) => handleFacilityInputChange(e, 'businessFacilities')}
                      onBlur={() => handleFacilityBlur('businessFacilities')}
                      placeholder="Enter business facilities"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Safety Facilities</label>
                    <input
                      name="safetyFacilities"
                      type="text"
                      value={facilityInputs.safetyFacilities || profileData.facilities.safetyFacilities.join(', ')}
                      onChange={(e) => handleFacilityInputChange(e, 'safetyFacilities')}
                      onBlur={() => handleFacilityBlur('safetyFacilities')}
                      placeholder="Enter safety facilities"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">General Facilities</label>
                    <input
                      name="generalFacilities"
                      type="text"
                      value={facilityInputs.generalFacilities || profileData.facilities.generalFacilities.join(', ')}
                      onChange={(e) => handleFacilityInputChange(e, 'generalFacilities')}
                      onBlur={() => handleFacilityBlur('generalFacilities')}
                      placeholder="Enter general facilities"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Accessibility</label>
                    <input
                      name="accessibility"
                      type="text"
                      value={facilityInputs.accessibility || profileData.facilities.accessibility.join(', ')}
                      onChange={(e) => handleFacilityInputChange(e, 'accessibility')}
                      onBlur={() => handleFacilityBlur('accessibility')}
                      placeholder="Enter accessibility"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Wellness Facilities</label>
                    <input
                      name="wellnessFacilities"
                      type="text"
                      value={facilityInputs.wellnessFacilities || profileData.facilities.wellnessFacilities.join(', ')}
                      onChange={(e) => handleFacilityInputChange(e, 'wellnessFacilities')}
                      onBlur={() => handleFacilityBlur('wellnessFacilities')}
                      placeholder="Enter wellness facilities"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Languages</label>
                    <input
                      name="languages"
                      type="text"
                      value={facilityInputs.languages || profileData.facilities.languages.join(', ')}
                      onChange={(e) => handleFacilityInputChange(e, 'languages')}
                      onBlur={() => handleFacilityBlur('languages')}
                      placeholder="Enter languages"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                </div>
              </div>

              {/* House Rules Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#fccc52]">House Rules</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-black mb-1">Check-In Time</label>
                    <input
                      name="time"
                      type="text"
                      value={profileData.houseRules.checkIn.time}
                      onChange={(e) => handleHouseRuleChange(e, 'checkIn')}
                      placeholder="Enter check-in time"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Check-In Description</label>
                    <input
                      name="description"
                      type="text"
                      value={profileData.houseRules.checkIn.description}
                      onChange={(e) => handleHouseRuleChange(e, 'checkIn')}
                      placeholder="Enter check-in description"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Check-Out Time</label>
                    <input
                      name="time"
                      type="text"
                      value={profileData.houseRules.checkOut.time}
                      onChange={(e) => handleHouseRuleChange(e, 'checkOut')}
                      placeholder="Enter check-out time"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Check-Out Description</label>
                    <input
                      name="description"
                      type="text"
                      value={profileData.houseRules.checkOut.description}
                      onChange={(e) => handleHouseRuleChange(e, 'checkOut')}
                      placeholder="Enter check-out description"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Cancellation/Prepayment</label>
                    <input
                      name="cancellationPrepayment"
                      type="text"
                      value={profileData.houseRules.cancellationPrepayment}
                      onChange={(e) => handleHouseRuleChange(e, 'cancellationPrepayment')}
                      placeholder="Enter cancellation/prepayment policies"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Children and Beds</label>
                    <input
                      name="childrenAndBeds"
                      type="text"
                      value={profileData.houseRules.childrenAndBeds}
                      onChange={(e) => handleHouseRuleChange(e, 'childrenAndBeds')}
                      placeholder="Enter children and beds policies"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Cribs and Extra Bed Policies</label>
                    <input
                      name="cribsAndExtraBedPolicies"
                      type="text"
                      value={profileData.houseRules.cribsAndExtraBedPolicies}
                      onChange={(e) => handleHouseRuleChange(e, 'cribsAndExtraBedPolicies')}
                      placeholder="Enter cribs and extra bed policies"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">No Age Restriction</label>
                    <input
                      name="noAgeRestriction"
                      type="text"
                      value={profileData.houseRules.noAgeRestriction}
                      onChange={(e) => handleHouseRuleChange(e, 'noAgeRestriction')}
                      placeholder="Enter age restriction policies"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Pets</label>
                    <input
                      name="pets"
                      type="text"
                      value={profileData.houseRules.pets}
                      onChange={(e) => handleHouseRuleChange(e, 'pets')}
                      placeholder="Enter pets policies"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1">Accepted Payment Methods</label>
                    <input
                      name="acceptedPaymentMethods"
                      type="text"
                      value={profileData.houseRules.acceptedPaymentMethods}
                      onChange={(e) => handleHouseRuleChange(e, 'acceptedPaymentMethods')}
                      placeholder="Enter accepted payment methods"
                      className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] shadow-md"
                    />
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
                  src={profileData.companyImage}
                  alt="Company"
                  className="w-32 h-32 rounded-full shadow-lg mr-8"
                />
                <div>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-[#ff914d]">{ownerName}</h2>
                  </div>
                  <h2 className="font-bold text-[#ff914d] text-opacity-50 mb-2">{profileData.city}</h2>
                  <p className="text-black">{profileData.address}</p>
                  <p className="text-black">{profileData.zipCode}</p>
                  <div className="flex items-center mt-2">
                    <div className="flex">{renderRatingStars(profileData.rating)}</div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#ff914d] mb-3">Description</h3>
                <p className="text-black">{profileData.description}</p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[#ff914d] mb-3">Facilities</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">Popular Facilities</h4>
                    <p className="text-black">{profileData.facilities.popularFacilities.join(', ') || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">Room Amenities</h4>
                    <p className="text-black">{profileData.facilities.roomAmenities.join(', ') || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">Outdoor Facilities</h4>
                    <p className="text-black">{profileData.facilities.outdoorFacilities.join(', ') || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">Kitchen Facilities</h4>
                    <p className="text-black">{profileData.facilities.kitchenFacilities.join(', ') || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">Media & Tech</h4>
                    <p className="text-black">{profileData.facilities.mediaTech.join(', ') || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">Food & Drink</h4>
                    <p className="text-black">{profileData.facilities.foodDrink.join(', ') || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">Transport Facilities</h4>
                    <p className="text-black">{profileData.facilities.transportFacilities.join(', ') || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">Reception Services</h4>
                    <p className="text-black">{profileData.facilities.receptionServices.join(', ') || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">Cleaning Services</h4>
                    <p className="text-black">{profileData.facilities.cleaningServices.join(', ') || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">Business Facilities</h4>
                    <p className="text-black">{profileData.facilities.businessFacilities.join(', ') || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">Safety Facilities</h4>
                    <p className="text-black">{profileData.facilities.safetyFacilities.join(', ') || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">General Facilities</h4>
                    <p className="text-black">{profileData.facilities.generalFacilities.join(', ') || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">Accessibility</h4>
                    <p className="text-black">{profileData.facilities.accessibility.join(', ') || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">Wellness Facilities</h4>
                    <p className="text-black">{profileData.facilities.wellnessFacilities.join(', ') || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">Languages</h4>
                    <p className="text-black">{profileData.facilities.languages.join(', ') || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#ff914d] mb-3">House Rules</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">Check-In</h4>
                    <p className="text-xs mt-4 text-[#ff914d] text-opacity-50">Check-In Time</p>
                    <p className="text-black">{profileData.houseRules.checkIn.time || 'N/A'}</p>
                    <p className="text-xs text-[#ff914d] text-opacity-50">Check-In Description</p>
                    <p className="text-black">{profileData.houseRules.checkIn.description || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">Check-Out</h4>
                    <p className="text-xs mt-4 text-[#ff914d] text-opacity-50">Check-Out Time</p>
                    <p className="text-black">{profileData.houseRules.checkOut.time || 'N/A'}</p>
                    <p className="text-xs text-[#ff914d] text-opacity-50">Check-Out Description</p>
                    <p className="text-black">{profileData.houseRules.checkOut.description || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">Cancellation/Prepayment</h4>
                    <p className="text-black">{profileData.houseRules.cancellationPrepayment || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">Children and Beds</h4>
                    <p className="text-black">{profileData.houseRules.childrenAndBeds || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">Cribs and Extra Bed Policies</h4>
                    <p className="text-black">{profileData.houseRules.cribsAndExtraBedPolicies || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">No Age Restriction</h4>
                    <p className="text-black">{profileData.houseRules.noAgeRestriction || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">Pets</h4>
                    <p className="text-black">{profileData.houseRules.pets || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#ff914d] text-opacity-50">Accepted Payment Methods</h4>
                    <p className="text-black">{profileData.houseRules.acceptedPaymentMethods || 'N/A'}</p>
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

export default ViewHotelOwnerProfile;
