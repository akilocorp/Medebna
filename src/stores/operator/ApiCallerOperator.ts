export type ListingFormData = {
    title: string;
    description: string;
    category: string;
    price: number;
    availability: boolean;
  };
  
  export const addListing = async (formData: ListingFormData) => {
    try {
      const response = await fetch("http://localhost:5001/operator/add-listing", {
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
      console.error("Add listing error:", error);
      throw error;
    }
  };
  
  export const getListings = async () => {
    try {
      const response = await fetch("http://localhost:5001/operator/view-listings", {
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
      console.error("Get listings error:", error);
      throw error;
    }
  };
  
  export const deleteListing = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5001/operator/delete-listing/${id}`, {
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
      console.error("Delete listing error:", error);
      throw error;
    }
  };
  