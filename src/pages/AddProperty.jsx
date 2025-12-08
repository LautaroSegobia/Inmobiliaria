
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { addProperty } from "../services/propertyService";

const AddProperty = () => {
  const { user } = useAuth();

  const API_BASE = import.meta.env.VITE_API_URL;

  // FORMULARIO
  const [form, setForm] = useState({
    titulo: "",
    descripcionCorta: "",
    descripcionLarga: "",
    operacion: "",
    tipo: "",
    m2Cubiertos: "",
    m2Descubiertos: "",
    m2Totales: "",
    precio: "",
    expensas: "",
    monedaPrecio: "USD",
    monedaExpensas: "ARS",
    ambientes: "",
    dormitorios: "",
    banos: "",
    luminosidad: "",
    orientacion: "",
    piso: "",
    antiguedad: "",
    cochera: false,
    balcon: false,
    calle: "",
    numero: "",
    zona: "",
  });

  const [imagenes, setImagenes] = useState([]); // { file, preview, isCover, url, public_id }
  const [error, setError] = useState("");

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // HANDLE FILE SELECT → solo preview
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const newImgs = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isCover: false,
      url: null,
      public_id: null,
    }));

    setImagenes((prev) => [...prev, ...newImgs]);
  };

  const handleRemoveImage = (index) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetCover = (index) => {
    setImagenes((prev) =>
      prev.map((img, i) => ({
        ...img,
        isCover: i === index,
      }))
    );
  };

  // SUBIR CADA IMAGEN AL BACKEND (Cloudinary)
const uploadImage = async (imgFile) => {
  const formData = new FormData();
  formData.append("images", imgFile);

  const token = localStorage.getItem("token");

  const res = await axios.post(`${API_BASE}/api/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  console.log("🟢 RESPUESTA DEL BACKEND AL SUBIR IMG:", res.data);

  if (Array.isArray(res.data) && res.data.length > 0) {
    return {
      url: res.data[0].url,
      public_id: res.data[0].public_id,
      isCover: false
    };
  }

  throw new Error("La respuesta del backend no contiene una imagen válida");
};

  // SUBMIT FINAL
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (!form.titulo) {
        alert("El título es obligatorio");
        return;
      }

      if (imagenes.length === 0) {
        alert("Debes subir al menos una imagen");
        return;
      }

      // SUBIR TODAS LAS IMÁGENES AL BACKEND
      const uploadedImages = [];

      for (const img of imagenes) {
        const uploaded = await uploadImage(img.file);
        uploadedImages.push({
          url: uploaded.url,
          public_id: uploaded.public_id,
          isCover: img.isCover || false,
        });
      }

      const mainImage =
        uploadedImages.find((i) => i.isCover) || uploadedImages[0];

      // ARMAR OBJETO EXACTO PARA EL BACKEND
      const data = {
        titulo: form.titulo,
        descripcionCorta: form.descripcionCorta,
        descripcionLarga: form.descripcionLarga,
        operacion: form.operacion,
        tipo: form.tipo,

        m2Cubiertos: Number(form.m2Cubiertos) || 0,
        m2Descubiertos: Number(form.m2Descubiertos) || 0,
        m2Totales: Number(form.m2Totales) || 0,

        precio: {
          valor: Number(form.precio) || 0,
          moneda: form.monedaPrecio,
        },

        expensas: {
          valor: Number(form.expensas) || 0,
          moneda: form.monedaExpensas,
        },

        ambientes: Number(form.ambientes) || 0,
        dormitorios: Number(form.dormitorios) || 0,
        banos: Number(form.banos) || 0,

        luminosidad: form.luminosidad,
        orientacion: form.orientacion,
        piso: form.piso,
        antiguedad: form.antiguedad,

        cochera: !!form.cochera,
        balcon: !!form.balcon,

        calle: form.calle,
        numero: form.numero,
        zona: form.zona,

        mainImage,
        multimedia: uploadedImages,
        creadoPor: user?._id || user?.id || null,
      };

      console.log("🟢 ENVIANDO AL BACKEND:", data);

      const response = await addProperty(data);

      console.log("✅ RESPUESTA BACKEND:", response);
      alert("Propiedad agregada correctamente!");

      // Reset form
      setForm({
        titulo: "",
        descripcionCorta: "",
        descripcionLarga: "",
        operacion: "",
        tipo: "",
        m2Cubiertos: "",
        m2Descubiertos: "",
        m2Totales: "",
        precio: "",
        expensas: "",
        monedaPrecio: "USD",
        monedaExpensas: "ARS",
        ambientes: "",
        dormitorios: "",
        banos: "",
        luminosidad: "",
        orientacion: "",
        piso: "",
        antiguedad: "",
        cochera: false,
        balcon: false,
        calle: "",
        numero: "",
        zona: "",
      });

      setImagenes([]);
    } catch (err) {
      console.error("❌ ERROR AL AGREGAR PROPIEDAD:", err);
      setError("No se pudo agregar la propiedad.");
    }
  };

  // RENDER
  return (
    <div className="add-property">
      <h1 className="add-property__title">Agregar Propiedad</h1>

      <form className="add-property__form" onSubmit={handleSubmit}>
        {/* Mantengo todos tus inputs EXACTAMENTE IGUALES */}
        
        <div className="add-property__group">
          <label>Título</label>
          <input
            type="text"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="add-property__group">
          <label>Descripción corta</label>
          <input
            type="text"
            name="descripcionCorta"
            value={form.descripcionCorta}
            onChange={handleChange}
          />
        </div>

        <div className="add-property__group">
          <label>Descripción larga</label>
          <textarea
            name="descripcionLarga"
            rows="4"
            value={form.descripcionLarga}
            onChange={handleChange}
          />
        </div>

        {/* Operación + Tipo */}
        <div className="add-property__group">
          <div>
            <label>Operación</label>
            <select
              name="operacion"
              value={form.operacion}
              onChange={handleChange}
            >
              <option value="">Seleccionar...</option>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
            </select>
          </div>

          <div>
            <label>Tipo</label>
            <select name="tipo" value={form.tipo} onChange={handleChange}>
              <option value="">Seleccionar...</option>
              <option value="departamento">Departamento</option>
              <option value="casa">Casa</option>
              <option value="oficina">Oficina</option>
              <option value="local">Local</option>
              <option value="ph">PH</option>
              <option value="terreno">Terreno</option>
            </select>
          </div>
        </div>

        {/* SUPERFICIES */}
        <div className="add-property__group">
          <div>
            <label>m² Cubiertos</label>
            <input
              type="number"
              name="m2Cubiertos"
              value={form.m2Cubiertos}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>m² Descubiertos</label>
            <input
              type="number"
              name="m2Descubiertos"
              value={form.m2Descubiertos}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>m² Totales</label>
            <input
              type="number"
              name="m2Totales"
              value={form.m2Totales}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* PRECIO / EXPENSAS */}
        <div className="add-property__group">
          <div>
            <label>Precio</label>
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Moneda</label>
            <select
              name="monedaPrecio"
              value={form.monedaPrecio}
              onChange={handleChange}
            >
              <option value="USD">USD</option>
              <option value="ARS">ARS</option>
            </select>
          </div>

          <div>
            <label>Expensas</label>
            <input
              type="number"
              name="expensas"
              value={form.expensas}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Moneda</label>
            <select
              name="monedaExpensas"
              value={form.monedaExpensas}
              onChange={handleChange}
            >
              <option value="ARS">ARS</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        {/* AMBIENTES */}
        <div className="add-property__group">
          <div>
            <label>Ambientes</label>
            <input
              type="number"
              name="ambientes"
              value={form.ambientes}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Dormitorios</label>
            <input
              type="number"
              name="dormitorios"
              value={form.dormitorios}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Baños</label>
            <input
              type="number"
              name="banos"
              value={form.banos}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* LUMINOSIDAD / ORIENTACIÓN */}
        <div className="add-property__group">
          <div>
            <label>Luminosidad</label>
            <select
              name="luminosidad"
              value={form.luminosidad}
              onChange={handleChange}
            >
              <option value="">Seleccionar...</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>

          <div>
            <label>Orientación</label>
            <select
              name="orientacion"
              value={form.orientacion}
              onChange={handleChange}
            >
              <option value="">Seleccionar...</option>
              <option value="norte">Norte</option>
              <option value="sur">Sur</option>
              <option value="este">Este</option>
              <option value="oeste">Oeste</option>
            </select>
          </div>
        </div>

        {/* PISO / ANTIGÜEDAD */}
        <div className="add-property__group">
          <div>
            <label>Piso</label>
            <input
              type="number"
              name="piso"
              value={form.piso}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Antigüedad (años)</label>
            <input
              type="number"
              name="antiguedad"
              value={form.antiguedad}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* CHECKBOXES */}
        <div className="add-property__checkboxes">
          <label>
            <input
              type="checkbox"
              name="cochera"
              checked={form.cochera}
              onChange={handleChange}
            />
            Cochera
          </label>

          <label>
            <input
              type="checkbox"
              name="balcon"
              checked={form.balcon}
              onChange={handleChange}
            />
            Balcón
          </label>
        </div>

        {/* DIRECCIÓN */}
        <div className="add-property__group">
          <div>
            <label>Calle</label>
            <input
              type="text"
              name="calle"
              value={form.calle}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Número</label>
            <input
              type="text"
              name="numero"
              value={form.numero}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Zona</label>
            <input
              type="text"
              name="zona"
              value={form.zona}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ARCHIVOS */}
        <div className="add-property__upload">
          <label className="add-property__upload__label">
            Cargar archivos multimedia
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />

          <div className="add-property__preview">
            {imagenes.map((img, index) => (
              <div
                key={index}
                className={`add-property__thumb ${
                  img.isCover ? "is-cover" : ""
                }`}
              >
                <img src={img.preview} alt={`preview-${index}`} />

                <div className="add-property__thumb-actions">
                  <button
                    type="button"
                    className="btn-cover"
                    onClick={() => handleSetCover(index)}
                  >
                    Portada
                  </button>

                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => handleRemoveImage(index)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="add-property__error">{error}</p>}

        <button type="submit" className="add-property__submit">
          Agregar Propiedad
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
