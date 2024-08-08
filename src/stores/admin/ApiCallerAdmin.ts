export type RegisterFormData = {
  companyName: string;
  email: string;
  phone: string;
  role: string;
};

export const addOperator = async (formData: RegisterFormData) => {
  try {
    const response = await fetch("http://localhost:5001/admin/add-operator", {
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
    console.error("Add operator error:", error);
    throw error;
  }
};

export const getOperators = async () => {
  try {
    const response = await fetch("http://localhost:5001/admin/view-operators", {
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
    console.error("Get operators error:", error);
    throw error;
  }
};

export const deleteOperator = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:5001/admin/delete-operator/${id}`, {
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
    console.error("Delete operator error:", error);
    throw error;
  }
};
