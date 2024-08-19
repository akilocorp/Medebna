import { Event } from './operatorSliceEvent';

export const addEvent = async (formData: Event) => {
  try {
    const response = await fetch("http://194.5.159.228:5003/event/add-event", {
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
    console.error("Add event error:", error);
    throw error;
  }
};

export const getAllEvents = async () => {
  try {
    const response = await fetch("http://194.5.159.228:5003/event/all-events", {
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
    console.error("Get events error:", error);
    throw error;
  }
};

export const deleteEvent = async (id: string) => {
  try {
    const response = await fetch(`http://194.5.159.228:5003/event/delete-event/${id}`, {
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
    console.error("Delete event error:", error);
    throw error;
  }
};
