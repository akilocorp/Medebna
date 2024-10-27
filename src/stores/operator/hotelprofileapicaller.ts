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
  
  interface HotelProfileCreate extends HotelProfileBase {}

  const getToken = () => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        return storedToken;
      }
    }
    return null;
  };
  export const addHotelOwnerProfile = async (profileData: HotelProfileCreate): Promise<HotelProfile> => {
    const token = getToken();
    try {
      const response = await fetch("http://147.79.100.108:5000/hotel-owner/add-hotel-owner-profile", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(profileData),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
  
      const data: HotelProfile = await response.json();
      return data;  // Return the profile data including the _id
    } catch (error) {
      console.error('Add hotel profile error:', error);
      throw error;
    }
  };
  
  
  interface ApiResponse {
    status: string;
    data: {
      hotelProfile: HotelProfile;
    };
  }
  
  export const fetchHotelOwnerProfile = async (id: string): Promise<ApiResponse | null> => {
    const token = getToken();
    try {
      console.log("Fetching profile with ID:", id); // Log the ID being used
    
      const response = await fetch(`http://147.79.100.108:5000/hotel-owner/hotel-owner-detail/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : "",
        },
      });
    
      if (response.status === 404) {
        console.warn('No hotel owner profile found with the given ID.');
        return null; // or handle as appropriate
      }
    
      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Error fetching profile:", errorMessage);
        throw new Error(errorMessage);
      }
    
      const data: ApiResponse = await response.json();
      console.log("Fetched Profile Data:", data); // Log the data received
      return data;
    } catch (error) {
      console.error('Fetch hotel profile error:', error);
      throw error;
    }
  };
  export const fetchHotelOwnerProfiles = async (id: string): Promise<ApiResponse | null> => {
    
    try {
      console.log("Fetching profile with ID:", id); // Log the ID being used
    
      const response = await fetch(`http://147.79.100.108:5000/hotel-owner/hotel-owner-detail/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          
        },
      });
    
      if (response.status === 404) {
        console.warn('No hotel owner profile found with the given ID.');
        return null; // or handle as appropriate
      }
    
      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Error fetching profile:", errorMessage);
        throw new Error(errorMessage);
      }
    
      const data: ApiResponse = await response.json();
      console.log("Fetched Profile Data:", data); // Log the data received
      return data;
    } catch (error) {
      console.error('Fetch hotel profile error:', error);
      throw error;
    }
  };
  
  
  

  
  
  
  export const updateHotelOwnerProfile = async (id: string, profileData: HotelProfile) => {
    const token = getToken();
    try {
      const response = await fetch(`http://147.79.100.108:5000/hotel-owner/update-hotel-owner-profile/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(profileData),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      
      // Return the hotelProfile directly
      return data.hotelProfile; 
    } catch (error) {
      console.error('Update hotel profile error:', error);
      throw error;
    }
  };
  
  