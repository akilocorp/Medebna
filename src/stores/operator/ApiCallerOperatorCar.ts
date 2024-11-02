import { CarRental } from './operatorSliceCar';
import jwt from "jsonwebtoken";

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

export const addCarRental = async (formData: CarRental, token: string) => {
  try {
    const response = await fetch("https://api.medebna.com/car/add-car", {
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
    console.error("Add car rental error:", error);
    throw error;
  }
};
export const getCarListings = async () => {
  const operatorId = getUserIdFromToken();
  if (!operatorId) {
    throw new Error("Operator ID not found");
  }

  try {
    const response = await fetch(`https://api.medebna.com/car/car/${operatorId}`, {
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
    return data.data.car; // This will return the array of car listings
  } catch (error) {
    console.error("Get car details error:", error);
    throw error;
  }
};
export const getCarListing = async (id: string) => {
  try {
    const response = await fetch(`https://api.medebna.com/car/car/${id}`, {
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

    // Check if the data contains cars
    if (data && data.data && Array.isArray(data.data.car)) {
      const carListings = data.data.car;

      // Map the car data properly
      const allCarTypes = carListings.map((carListing: any) => ({
        _id: carListing._id,
        createdBy: carListing.createdBy,
        cars: carListing.cars.map((car: any) => ({
          _id: car._id,
          type: car.type || "Unknown Car Type",
          price: car.price || 0,
          description: car.description || "No description available.",
          carSpecificity: (car.carSpecificity || []).map((specificity: any) => ({
            _id: specificity._id,
            color: specificity.color || "Unknown Color",
            image: specificity.image || "/assets/default-car.png",
            numberOfCars: specificity.numberOfCars || 0,
            status: specificity.status || "Unknown Status",
          })),
        })),
        carDetails: {
          details: carListing.carDetails?.details || "No details available.",
          rentalInfo: carListing.carDetails?.rentalInfo || "No rental info available.",
          additionalInfo: carListing.carDetails?.additionalInfo || "No additional info available.",
        },
      }));

      if (allCarTypes.length > 0) {
        return allCarTypes;
      } else {
        console.error("No car types found for this listing");
        return [];
      }
    } else {
      throw new Error("Invalid API response structure");
    }
  } catch (error) {
    console.error("Get car listing details error:", error);
    throw error;
  }
};


export const updateCarListing = async (carRental: CarRental, id: string, token: string) => {
  try {
    const response = await fetch(`https://api.medebna.com/car/update-car/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(carRental),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Update car rental error:", error);
    throw error;
  }
};

export const deleteCarListing = async (id: string) => {
  const token = getToken();
  try {
    const response = await fetch(`https://api.medebna.com/car/delete-car/${id}`, {
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
    console.error("Delete car error:", error);
    throw error;
  }
};
