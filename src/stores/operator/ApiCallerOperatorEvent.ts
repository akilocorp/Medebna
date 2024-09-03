import { Event } from './operatorSliceEvent';
import jwt from "jsonwebtoken";

// Helper functions to retrieve and decode the token
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

// Function to add an event
export const addEvent = async (formData: Event, token: string) => {
  try {
    const response = await fetch("http://194.5.159.228:5003/event/add-event", {
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
    console.error("Add event error:", error);
    throw error;
  }
};


export const getAllEvents = async () => {
  const operatorId = getUserIdFromToken();
  if (!operatorId) {
    throw new Error("Operator ID not found");
  }

  try {
    const response = await fetch(`http://194.5.159.228:5003/event/event/${operatorId}`, {
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
    return data.data.event; // Adjust this line to access the 'event' array
  } catch (error) {
    console.error("Get events error:", error);
    throw error;
  }
};

export const updateEvent = async (event: Event, id: string, token: string) => {
  try {
    const response = await fetch(`http://194.5.159.228:5003/event/update-event/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Update event error:", error);
    throw error;
  }
};
// Function to delete an event
export const deleteEvent = async (id: string) => {
  const token = getToken();
  try {
    const response = await fetch(`http://194.5.159.228:5003/event/delete-event/${id}`, {
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
    console.error("Delete event error:", error);
    throw error;
  }
};
export const getAllEvent = async (id: string) => {
  try {
    const response = await fetch(`http://194.5.159.228:5003/event/event/${id}`, {
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
    return data.data.event; // Adjust this line to access the 'event' array
  } catch (error) {
    console.error("Get events error:", error);
    throw error;
  }
};
