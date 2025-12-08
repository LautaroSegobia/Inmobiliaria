
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

//  Registro de usuario
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE}/api/users/register`,
      userData
    );

    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error.response?.data);
    throw new Error(error.response?.data?.message || "Error al registrar usuario");
  }
};

//  Login de usuario
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE}/api/users/login`,
      credentials
    );

    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error.response?.data);
    throw new Error(error.response?.data?.message || "Error al iniciar sesión");
  }
};

//  Logout
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
