
import { useState } from "react";
import { addProperty } from "../services/propertyService";
import { useAuth } from "../contexts/AuthContext";

const AddProperty = () => {
  const { user } = useAuth();
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
    monedaExpensas: "USD",
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

  const [imagenes, setImagenes] = useState([]); // { file, preview, isCover }
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Carga de imágenes locales con preview
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isCover: false,
    }));
    setImagenes((prev) => [...prev, ...newImgs]);
  };

  // ✅ Eliminar imagen
  const handleRemoveImage = (index) => {
    const newList = imagenes.filter((_, i) => i !== index);
    setImagenes(newList);
  };

  // ✅ Marcar como portada
  const handleSetCover = (index) => {
    setImagenes((prev) =>
      prev.map((img, i) => ({
        ...img,
        isCover: i === index,
      }))
    );
  };

  // ✅ Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        imagenes,
        createdBy: user?.email || "anon",
      };

      console.log("🟢 Enviando propiedad a backend:", data);
      const response = await addProperty(data);
      console.log("✅ Respuesta del servidor:", response);

      alert("Propiedad agregada correctamente!");
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
        monedaExpensas: "USD",
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
      console.error("❌ Error al agregar propiedad:", err);
      setError("Error al agregar la propiedad. Ver consola para más detalles.");
    }
  };

  return (
    <div className="add-property">
      <h1 className="add-property__title">Agregar Propiedad</h1>

      <form className="add-property__form" onSubmit={handleSubmit}>
        {/* Título */}
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

        {/* Descripción corta */}
        <div className="add-property__group">
          <label>Descripción corta</label>
          <input
            type="text"
            name="descripcionCorta"
            value={form.descripcionCorta}
            onChange={handleChange}
          />
        </div>

        {/* Descripción larga */}
        <div className="add-property__group">
          <label>Descripción larga</label>
          <textarea
            name="descripcionLarga"
            rows="4"
            value={form.descripcionLarga}
            onChange={handleChange}
          />
        </div>

        {/* Operación - Tipo */}
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

        {/* Superficies */}
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

        {/* Precio / Expensas */}
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
              <option value="USD">USD</option>
              <option value="ARS">ARS</option>
            </select>
          </div>
        </div>

        {/* Ambientes / Dormitorios / Baños */}
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

        {/* Luminosidad / Orientación */}
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

        {/* Piso / Antigüedad */}
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

        {/* 🚗 / 🌇 */}
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

        {/* 📍 Dirección */}
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

        {/* 📸 Carga multimedia */}
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

          {/* Vista previa */}
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
