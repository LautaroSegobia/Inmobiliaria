
import axios from "axios";

// AGREGAR PROPIEDAD
export const addProperty = async (propertyData) => {
  try {
    console.log("🟢 ENVIANDO AL BACKEND:", propertyData);

    // El formulario YA envía todo correctamente armado.
    // NO volver a transformarlo.

    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const token = localStorage.getItem("token");

    if (!token) throw new Error("No estás autenticado");

    const response = await axios.post(
      `${API_BASE}/api/properties`,
      propertyData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Error al agregar propiedad:", error);
    console.error("📩 Respuesta backend:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "No se pudo agregar la propiedad"
    );
  }
};
