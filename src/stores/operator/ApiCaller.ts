// ApiCaller.ts
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

export const fetchBankList = async () => {
  const token = getToken();
  try {
    const response = await fetch("https://api.medebna.com/account/fetchBankLists", {
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
    console.log("dvfaibca.ljb", data)
    return data.banks;
  } catch (error) {
    throw error;
  }
};

export const addAccount = async (formData: any) => {
  const token = getToken();
  try {
    const response = await fetch("https://api.medebna.com/account/add-account", {
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
    throw error;
  }
};
