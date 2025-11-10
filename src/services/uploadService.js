
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const uploadFiles = async (formData, token) => {
  return axios.post(
    `${API_URL}/api/upload`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const deleteFile = async (public_id, token) => {
  return axios.delete(
    `${API_URL}/api/upload/${public_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
