import { CarRental } from './operatorSliceCar';

export const addCarRental = async (formData: CarRental) => {
  try {
    const response = await fetch("http://194.5.159.228:5003/car/add-car", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
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

export const getAllCarRentals = async () => {
  try {
    const response = await fetch("http://194.5.159.228:5003/car/all-cars", {
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
    return data;
  } catch (error) {
    console.error("Get car rentals error:", error);
    throw error;
  }
};

export const deleteCarRental = async (id: string) => {
  try {
    const response = await fetch(`http://194.5.159.228:5003/car/delete-car/${id}`, {
      method: "DELETE",
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
    return data;
  } catch (error) {
    console.error("Delete car rental error:", error);
    throw error;
  }
};
