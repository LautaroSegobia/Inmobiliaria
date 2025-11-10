
// src/services/propertyService.js
import axios from "axios";

const CLOUD_NAME = "dcnd6bmzb";
const UPLOAD_PRESET = "propiedades_unsigned";

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return {
    url: response.data.secure_url,
    public_id: response.data.public_id,
  };
};

export const addProperty = async (propertyData) => {
  try {
    // ✅ Subir imágenes (si hay nuevas)
    const uploadedImages = await Promise.all(
      propertyData.imagenes.map(async (img) => {
        if (img.file) {
          const uploaded = await uploadToCloudinary(img.file);
          return { ...uploaded, isCover: img.isCover || false };
        }
        return img;
      })
    );

    const propertyToSend = { ...propertyData, imagenes: uploadedImages };

    // ✅ URL base del backend
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

    // ✅ Obtener el token del localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ No hay token guardado en localStorage");
      throw new Error("No estás autenticado");
    }

    console.log("📦 Token enviado:", token); // ← comprobá esto en consola

    // 🚀 Enviar al backend con header Authorization
    const response = await axios.post(`${API_BASE}/api/properties`, propertyToSend, {
      headers: {
        Authorization: `Bearer ${token}`, // 🔥 esto es lo que faltaba
      },
    });

    console.log("✅ Propiedad agregada correctamente:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al agregar propiedad:", error);
    console.error("📩 Respuesta del servidor:", error.response?.data);
    throw new Error(error.response?.data?.message || "No se pudo agregar la propiedad");
  }
};
