import jwt from 'jsonwebtoken';

export interface EventOwnerProfileCreate {
  address: string;
  rating: number;
  zipCode: string;
  city: string;
  companyImage: string;
  description: string;
  eventRules: {
    checkIn: string;
    checkOut: string;
    cancellationPolicy: string;
    prepayment: boolean;
    noAgeRestriction: boolean;
    pets: boolean;
    additionalInfo: string;
    acceptedPaymentMethods: string;
  };
}

export interface EventOwnerProfile {
  _id: string;
  address: string;
  rating: number;
  zipCode: string;
  city: string;
  companyImage: string;
  description: string;
  eventRules: {
    checkIn: string;
    checkOut: string;
    cancellationPolicy: string;
    additionalInfo: string;
    acceptedPaymentMethods: string;
  };
}

interface ApiResponse {
  status: string;
  data: {
    eventProfile: EventOwnerProfile;  // Update to match the API response
  };
}

const getToken = () => {
  if (typeof window !== "undefined") {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      return storedToken;
    }
  }
  return null;
};

export const addEventOwnerProfile = async (profileData: EventOwnerProfileCreate) => {
  const token = getToken();

  try {
    const response = await fetch("https://api.medebna.com/event-owner/add-event-owner-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding event owner profile:", error);
    throw error;
  }
};

export const fetchEventOwnerProfile = async (id: string): Promise<EventOwnerProfile | null> => {
  const token = getToken();
  try {
    const response = await fetch(`https://api.medebna.com/event-owner/event-owner-detail/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : "",
      },
    });

    if (response.status === 404) {
      console.warn('No event owner profile found with the given ID.');
      return null;
    }

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data: ApiResponse = await response.json();
    return data.data.eventProfile;  // Update to correctly access the profile
  } catch (error) {
    console.error('Fetch event profile error:', error);
    throw error;
  }
};
export const fetchEventOwnerProfiles = async (id: string) => {
  try {
    const response = await fetch(`https://api.medebna.com/event-profile/${id}`);
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;  // Ensure you're returning the full response object
  } catch (error) {
    console.error('Error fetching event owner profile:', error);
    throw error;
  }
};


export const updateEventOwnerProfile = async (id: string, profileData: EventOwnerProfile): Promise<EventOwnerProfile> => {
  const token = getToken();
  try {
    const response = await fetch(`https://api.medebna.com/event-owner/update-event-owner-profile/${id}`, {
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
    return data.eventProfile;  // Update to correctly access the profile
  } catch (error) {
    console.error('Update event profile error:', error);
    throw error;
  }
};
