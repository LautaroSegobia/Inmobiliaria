
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

//  Agregar Propiedad
export const addProperty = async (propertyData) => {
  try {
    console.log("🟢 ENVIANDO AL BACKEND:", propertyData);

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
      error.response?.data?.message ||
        "No se pudo agregar la propiedad"
    );
  }
};
