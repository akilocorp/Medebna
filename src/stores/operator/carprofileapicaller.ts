import jwt from 'jsonwebtoken';

export interface CarOwnerProfileCreate {
  address: string;
  rating: number;
  zipCode: string;
  city: string;
  companyImage: string;
  description: string;
  rentalRules: {
    rentalDuration: string;
    cancellationPolicy: string;
    prepayment: boolean;
    noAgeRestriction: boolean;
    additionalInfo: string;
    acceptedPaymentMethods: string;
  };
}

export interface CarOwnerProfile {
  _id: string;
  address: string;
  rating: number;
  zipCode: string;
  city: string;
  companyImage: string;
  description: string;
  rentalRules: {
    rentalDuration: string;
    cancellationPolicy: string;
    prepayment: boolean;
    noAgeRestriction: boolean;
    additionalInfo: string;
    acceptedPaymentMethods: string;
  };
}

interface ApiResponse {
  status: string;
  data: {
    carOwnerProfile: CarOwnerProfile;
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

export const addCarOwnerProfile = async (profileData: CarOwnerProfileCreate) => {
  const token = getToken();

  try {
    const response = await fetch("https://api.medebna.com/car-owner/add-car-owner-profile", {
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
   
    throw error;
  }
};

export const fetchCarOwnerProfile = async (id: string): Promise<CarOwnerProfile | null> => {
  const token = getToken();
  try {
    const response = await fetch(`https://api.medebna.com/car-owner/car-owner-detail/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : "",
      },
    });

    if (response.status === 404) {
      
      return null;
    }

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data: ApiResponse = await response.json();
    return data.data.carOwnerProfile;
  } catch (error) {
   
    throw error;
  }
};

export const updateCarOwnerProfile = async (id: string, profileData: CarOwnerProfile): Promise<CarOwnerProfile> => {
  const token = getToken();
  try {
    const response = await fetch(`https://api.medebna.com/car-owner/update-car-owner-profile/${id}`, {
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
    return data.carOwnerProfile;
  } catch (error) {
    
    throw error;
  }
};
export const fetchCarOwnerProfileWithoutToken = async (id: string): Promise<CarOwnerProfile | null> => {
  try {
    const response = await fetch(`https://api.medebna.com/car-owner/car-owner-detail/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (response.status === 404) {
     
      return null;
    }

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data: ApiResponse = await response.json();
    return data.data.carOwnerProfile;
  } catch (error) {
   
    throw error;
  }
};

