import { v4 as uuidv4 } from 'uuid';

// Function to get or generate a session ID
export const getSessionId = (): string => {
  if (typeof window !== 'undefined') {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = uuidv4(); // Generate a new session ID
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }
  return '';
};
export const addEventToCart = async (
  eventId: string,
  productType: string,
  eventTypeId: string,
  numberOfTickets: number
) => {
  const sessionId = getSessionId(); // Retrieve session ID from localStorage

  const dataToSend = {
    id: eventId, // Use the selected event's ID
    productType, // Event type
    roomId: "", // For event, roomId is empty
    eventTypeId, // Event type ID
    numberOfTickets, // Number of tickets selected
    sessionId, // Pass the session ID
  };
  console.log('Event Data:', dataToSend);

  try {
    const response = await fetch('https://api.medebna.com/cart/add-cart', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Add event to cart error:', error);
    throw error;
  }
};
export const addToCart = async (hotelId: string, productType: string, roomId: string) => {
  const sessionId = getSessionId(); // Retrieve session ID from localStorage

  const dataToSend = {
    id: hotelId, // Use the selected hotel's ID
    productType,
    roomId, // Pass the selected room's ID
    sessionId, // Pass the session ID
  };
  console.log(dataToSend);

  try {
    const response = await fetch('https://api.medebna.com/cart/add-cart', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Add to cart error:', error);
    throw error;
  }
};


export const getCartCount = async (sessionId: string) => {
  try {
    const response = await fetch(`https://api.medebna.com/cart/get-all-items/${sessionId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch cart count');
    }
    const data = await response.json();
    return data.length; // Assuming the response is an array of cart items
  } catch (error) {
    console.error('Error fetching cart count:', error);
    return 0; // Return 0 if there's an error
  }
};

export const getCartItems = async (sessionId: string) => {
  console.log('Getting Cart', sessionId);
  try {
    const response = await fetch(`https://api.medebna.com/cart/get-all-items/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.error(`Cart items not found for sessionId: ${sessionId}`);
        return []; // Return an empty array if no items are found
      }
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.items || []; // Ensure it returns an array
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};
// Function to delete an item from the cart
export const deleteCartItem = async (
  sessionId: string,
  productId: string,
  roomId: string = '',
  carTypeId: string = '',
  carColorId: string = '',
  eventTypeId: string = ''
) => {
  try {
    const bodyData = {
      roomId,
      carTypeId,
      carColorId,
      eventTypeId,
    };

    // Log the details before making the request
    console.log('Delete Request:', {
      sessionId,
      productId,
      roomId,
      carTypeId,
      eventTypeId,
    });

    const response = await fetch(`https://api.medebna.com/cart/delete-cart/${sessionId}/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData), // Ensure the correct body is sent
    });

    const responseText = await response.text();
    console.log('Response Status:', response.status);
    console.log('Response Body:', responseText);

    if (!response.ok) {
      console.error('Delete cart item response error:', responseText);
      throw new Error(responseText);
    }

    const data = JSON.parse(responseText); // Parse the response if successful
    return data;
  } catch (error) {
    console.error('Error deleting cart item:', error);
    throw error;
  }
};






export const addToCartcar = async (
  id: string, // This should be the car type's `_id` (car._id)
  productType: string,
  roomId: string,
  carTypeId: string, // This should refer to the car type (cars array's _id)
  carColorId: string, // This should refer to the color (carSpecificity's _id)
  numberOfTickets: number
) => {
  const sessionId = getSessionId(); // Retrieve session ID from localStorage

  const dataToSend = {
    id, // Car type ID
    productType,
    roomId, // RoomId could be optional for car rental
    eventTypeId: '', // Optional for cars
    numberOfTickets,
    sessionId,
    carTypeId,
    carColorId,
  };

  console.log('Sending data to add to cart:', dataToSend);

  try {
    const response = await fetch('https://api.medebna.com/cart/add-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};
