export const bookProduct = async (data: any) => {
  
    try {
      const response = await fetch('https://api.medebna.com/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  