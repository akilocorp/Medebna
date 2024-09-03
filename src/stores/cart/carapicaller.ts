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

// Function to add an item to the cart
export const addToCart = async (productId: string, productType: string, roomId: string) => {
  const sessionId = getSessionId();
  const dataToSend = {
    id: productId, // The hotelId
    productType,
    roomId, // The room _id
    sessionId, // Include the session ID
  };

  try {
    const response = await fetch('http://194.5.159.228:5003/cart/add-cart', {
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
    const response = await fetch(`http://194.5.159.228:5003/cart/get-all-items/${sessionId}`);
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
  try {
    const response = await fetch(`http://194.5.159.228:5003/cart/get-all-items/${sessionId}`, {
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



