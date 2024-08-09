// src/stores/auth/ApiCallerAuth.ts
export type SignInFormData = {
  email: string;
  password: string;
};

export const signIn = async (formData: SignInFormData) => {
  try {
      const response = await fetch("http://localhost:8000/login", {
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
      console.error("Sign in error:", error);
      throw error;
  }
};
