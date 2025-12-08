
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faGripVertical, faUpload } from "@fortawesome/free-solid-svg-icons";


export default function MediaUploader({
  initialItems = [],
  onChange,
  apiUploadUrl = import.meta.env.VITE_API_UPLOAD || "",
  cloudinaryConfig = {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  },
  accept = "image/*,video/*",
}) {
  const inputRef = useRef(null);
  const [items, setItems] = useState([...initialItems]); // {url, tipo, public_id? , localFile?}
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    onChange?.(items);
  }, [items]);

  // create preview URLs for local files - ensure same size via CSS
  useEffect(() => {
    const revoke = items
      .filter((it) => it.localFile && it.previewUrl)
      .map((it) => it.previewUrl);
    return () => revoke.forEach((u) => URL.revokeObjectURL(u));
    // eslint-disable-next-line
  }, []);

  const handleSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    // convert to items with preview
    const newItems = files.map((f) => {
      const tipo = f.type.startsWith("video") ? "video" : "imagen";
      return {
        localFile: f,
        url: URL.createObjectURL(f),
        tipo,
        uploading: false,
      };
    });
    setItems((prev) => [...prev, ...newItems]);
    // reset input to allow same file re-add
    e.target.value = "";
  };

  const handleRemove = async (index) => {
    const it = items[index];
    // if has public_id and backend has delete route, call it
    if (it?.public_id && apiUploadUrl) {
      try {
        await axios.delete(`${apiUploadUrl}/${it.public_id}`); // backend should map this route
      } catch (err) {
        // ignore errors but log (backend may not implement delete)
        console.warn("Error borrando en backend:", err?.response?.data || err.message || err);
      }
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Drag & drop reorder handlers
  const dragIndexRef = useRef(null);
  const handleDragStart = (e, idx) => {
    dragIndexRef.current = idx;
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDrop = (e, idx) => {
    e.preventDefault();
    const from = dragIndexRef.current;
    const to = idx;
    if (from === null || from === undefined) return;
    setItems((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });
    dragIndexRef.current = null;
  };
  const handleDragOver = (e) => e.preventDefault();

  // upload all local files (in order) - returns final items with url/public_id
  const uploadAll = async () => {
    const toUpload = items.filter((it) => it.localFile && !it.public_id);
    if (!toUpload.length) return items;
    setUploading(true);
    const finalItems = [...items];
    try {
      for (let i = 0; i < finalItems.length; i++) {
        const it = finalItems[i];
        if (!it.localFile || it.public_id) continue;

        // update uploading flag
        finalItems[i] = { ...it, uploading: true };
        setItems([...finalItems]);

        let uploaded;
        // prefer backend upload endpoint if provided
        if (apiUploadUrl) {
          const fd = new FormData();
          fd.append("file", it.localFile);
          // opcional: enviar tipo o nombre
          try {
            const res = await axios.post(apiUploadUrl, fd, {
              headers: { "Content-Type": "multipart/form-data" },
              onUploadProgress: (e) => {
                if (!e.total) return;
                const partProgress = Math.round(((i + e.loaded / e.total) / toUpload.length) * 100);
                setProgress(partProgress);
              },
            });
            // Esperamos { url, public_id, tipo }
            uploaded = res.data;
          } catch (err) {
            console.error("Upload error (backend):", err);
            uploaded = null;
          }
        } else {
          // fallback direct Cloudinary unsigned upload
          const url = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/${
            it.tipo === "video" ? "video" : "image"
          }/upload`;
          const fd = new FormData();
          fd.append("file", it.localFile);
          fd.append("upload_preset", cloudinaryConfig.uploadPreset);
          try {
            const res = await axios.post(url, fd, {
              onUploadProgress: (e) => {
                if (!e.total) return;
                const partProgress = Math.round(((i + e.loaded / e.total) / toUpload.length) * 100);
                setProgress(partProgress);
              },
            });
            uploaded = {
              url: res.data.secure_url,
              public_id: res.data.public_id,
              tipo: it.tipo,
            };
          } catch (err) {
            console.error("Upload error (cloudinary):", err);
            uploaded = null;
          }
        }

        // replace item
        finalItems[i] = {
          ...(uploaded || {}),
          tipo: uploaded?.tipo || it.tipo,
          uploading: false,
        };
        setItems([...finalItems]);
      }

      setProgress(100);
      setTimeout(() => setProgress(0), 600);
      return finalItems;
    } finally {
      setUploading(false);
    }
  };

  // expose helper to parent? parent calls upload via onSubmit -> we provided uploadAll return value
  // We'll attach uploadAll to window for quick testing if needed (optional)
  // window.mediaUploaderUploadAll = uploadAll;

  return (
    <div className="media-uploader">
      <div className="media-uploader__controls">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          id="media-input"
          className="media-uploader__input"
          onChange={handleSelect}
        />
        <label htmlFor="media-input" className="btn media-uploader__select">
          <FontAwesomeIcon icon={faUpload} /> <span>Agregar multimedia</span>
        </label>

        <button
          type="button"
          className="btn media-uploader__upload"
          onClick={uploadAll}
          disabled={uploading || items.every((it) => it.public_id)}
        >
          Subir pendientes
        </button>
      </div>

      {progress > 0 && (
        <div className="media-uploader__progress">
          <div className="media-uploader__progress-inner" style={{ width: `${progress}%` }} />
          <span>{progress}%</span>
        </div>
      )}

      <div className="media-uploader__grid">
        {items.map((it, idx) => (
          <div
            key={idx}
            className={`media-item ${it.uploading ? "is-uploading" : ""}`}
            draggable
            onDragStart={(e) => handleDragStart(e, idx)}
            onDrop={(e) => handleDrop(e, idx)}
            onDragOver={handleDragOver}
          >
            <div className="media-item__preview">
              {it.tipo === "video" ? (
                // small posterless video preview (muted)
                <video src={it.url} muted playsInline preload="metadata" />
              ) : (
                <img src={it.url} alt={`media-${idx}`} />
              )}
            </div>

            <div className="media-item__meta">
              <div className="media-item__drag-handle">
                <FontAwesomeIcon icon={faGripVertical} />
              </div>

              <div className="media-item__actions">
                <button
                  type="button"
                  className="media-item__remove"
                  onClick={() => handleRemove(idx)}
                  title="Eliminar"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>

            {it.uploading && <div className="media-item__spinner">Subiendo...</div>}
            {it.public_id && <div className="media-item__badge">Guardado</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
