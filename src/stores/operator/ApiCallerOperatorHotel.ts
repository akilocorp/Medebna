import { Hotel } from './operatorSliceHotel';
import jwt from "jsonwebtoken";

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
const getUserIdFromToken = (): string | null => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const decoded: any = jwt.decode(token);
    return decoded?.id || null;
  } catch (error) {
    
    return null;
  }
};


export const addHotel = async (formData: Hotel) => {
  const token = getToken();
  try {
    const response = await fetch("https://api.medebna.com/hotel/add-hotel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
    
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    return data;
  } catch (error) {
   
    throw error;
  }
};


export const getListings = async () => {
  const userId = getUserIdFromToken();
  if (!userId) {
    throw new Error("User ID not found");
  }

  try {
    const response = await fetch(`https://api.medebna.com/hotel/hotel/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json();
   
    return data.data.hotel; // Adjust based on the structure returned by the backend
  } catch (error) {
   
    throw error;
  }
};
export const getListing = async (id: string) => {
  try {
    const response = await fetch(`https://api.medebna.com/hotel/hotel/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json();
   

    const hotels = data.data.hotel; // Get the array of hotels

    // Map through hotels to extract roomTypes and HotelId for each hotel
    const hotelDetails = hotels.map((hotel: any) => ({
      HotelId: hotel._id,
      roomTypes: hotel.roomTypes || [],
    }));

    return hotelDetails; // Return an array of objects with roomTypes and HotelId
  } catch (error) {
   
    throw error;
  }
};








export const updateListing = async (listing: Listing) => {
  const token = getToken();
  try {
    const response = await fetch(`https://api.medebna.com/hotel/update-hotel/${listing._id}`, { // Use _id for backend matching
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ roomTypes: listing.roomTypes }), // Ensure correct payload structure
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data; // Return updated hotel data
  } catch (error) {
   
    throw error;
  }
};





export const deleteListing = async (id: string) => {
  const token = getToken();
  try {
    const response = await fetch(`https://api.medebna.com/hotel/delete-hotel/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    
    throw error;
  }
};


