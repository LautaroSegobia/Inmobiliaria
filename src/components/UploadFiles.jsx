
import { useState } from "react";
import axios from "axios";

const UploadFiles = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    setPreview(
      selectedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video") ? "video" : "image",
      }))
    );

    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      setLoading(true);
      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUploadSuccess && onUploadSuccess(res.data.archivos);
    } catch (err) {
      console.error("Error subiendo archivos", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <label className="upload-input-label">
        Selecciona imágenes o videos
        <input type="file" multiple onChange={handleChange} />
      </label>

      <div className="preview-list">
        {preview.map((media, i) => (
          <div key={i} className="preview-item">
            {media.type === "image" ? (
              <img src={media.url} alt="preview" />
            ) : (
              <video src={media.url} controls></video>
            )}
          </div>
        ))}
      </div>

      <button
        className="upload-btn"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Subiendo..." : "Subir Archivos"}
      </button>
    </div>
  );
};

export default UploadFiles;
