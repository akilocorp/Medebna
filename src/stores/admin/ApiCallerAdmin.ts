import jwt from "jsonwebtoken";

export type RegisterFormData = {
  name: string;       // Updated from companyName to name
  email: string;
  phone: string;
  type: string;       // Updated from role to type
};
export interface Operator {
  id: string;
  name: string;  // updated from companyName to name
  email: string;
  phone: string;
  type: string;  // updated from role to type
}
interface Operators {
  _id: string;
  name: string;
  type: string;
 
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

export const addOperator = async (formData: RegisterFormData) => {
  const token = getToken(); // Ensure this retrieves the correct token
 

  try {
    const response = await fetch("https://api.medebna.com/operator/add-operator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "", // Ensure correct format
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

export const getHotels = async (): Promise<Operators[]> => {
  try {
    const response = await fetch("https://api.medebna.com/operator/get-all-operators", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      
      return [];
    }

    const data = await response.json();
   

    if (!data || !data.operators) {
      
      return [];
    }

    return data.operators; // Assuming data.operators is the correct path
  } catch (error) {
   
    return [];
  }
};



export const getOperators = async (): Promise<Operator[]> => {
  const token = getToken();

  try {
    const response = await fetch("https://api.medebna.com/operator/get-all-operators", {
      method: "GET",
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

    // Map _id to id
    const operators = data.operators.map((operator: any) => ({
      id: operator._id, // Map _id to id
      name: operator.name,
      email: operator.email,
      phone: operator.phone,
      type: operator.type,
    }));

    return operators;
  } catch (error) {
   
    throw error;
  }
};


export const updateOperator = async (operator: Operator) => {
  const token = getToken();
  
  const id = operator.id; // Use the correct id

  if (!id) {
    throw new Error("Operator ID is missing"); // Add a guard clause to check if the ID is missing
  }

  try {
    const response = await fetch(`https://api.medebna.com/operator/update-operator/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        name: operator.name,
        phone: operator.phone,
        email: operator.email,
        type: operator.type
      }),
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





export const deleteOperator = async (id: string) => {
  const token = getToken();
  try {
    const response = await fetch(`https://api.medebna.com/operator/delete-operator/${id}`, {
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

