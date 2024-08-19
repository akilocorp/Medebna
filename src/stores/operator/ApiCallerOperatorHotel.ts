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
    console.error("Error decoding token:", error);
    return null;
  }
};


export const addHotel = async (formData: Hotel) => {
  const token = getToken();
  try {
    const response = await fetch("http://194.5.159.228:5003/hotel/add-hotel", {
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
      console.error("Response not OK:", response.status, errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("Response Data:", data);
    return data;
  } catch (error) {
    console.error("Add hotel error:", (error as Error).message);
    throw error;
  }
};


export const getListings = async () => {
  const userId = getUserIdFromToken();
  if (!userId) {
    throw new Error("User ID not found");
  }

  try {
    const response = await fetch(`http://194.5.159.228:5003/hotel/hotel/${userId}`, {
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
    console.error("Get hotel details error:", error);
    throw error;
  }
};
export const getListing = async (id: string) => {
  try {
    const response = await fetch(`http://194.5.159.228:5003/hotel/hotel/${id}`, {
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
    console.log("Full API Response:", data);

    // Aggregate room types from all hotels
    const allRoomTypes = data.data.hotel.reduce((acc: RoomType[], hotel: any) => {
      return acc.concat(hotel.roomTypes);
    }, []);

    if (allRoomTypes.length > 0) {
      return allRoomTypes;
    } else {
      throw new Error("No room types found for this hotel");
    }
  } catch (error) {
    console.error("Get hotel details error:", error);
    throw error;
  }
};







export const updateListing = async (listing: Listing) => {
  const token = getToken();
  try {
    const response = await fetch(`http://194.5.159.228:5003/hotel/update-hotel/${listing._id}`, { // Use _id for backend matching
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
    console.error("Update listing error:", error);
    throw error;
  }
};





export const deleteListing = async (id: string) => {
  const token = getToken();
  try {
    const response = await fetch(`http://194.5.159.228:5003/hotel/delete-hotel/${id}`, {
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
    console.error("Delete hotel error:", error);
    throw error;
  }
};


