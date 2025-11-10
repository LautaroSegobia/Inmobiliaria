
// src/services/authService.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ✅ Registro de usuario
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE}/api/users/register`, userData);

    // Guardar token y usuario si el backend lo devuelve
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Login de usuario
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE}/api/users/login`, credentials);

    // Guardar token y usuario
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Cerrar sesión
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
