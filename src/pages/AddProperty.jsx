
import useForm from "../hooks/useForm";
import API_BASE_URL from "../config/api";

export default function AddProperty() {
  const initialValues = {
    title: "",
    description: "",
    price: "",
    location: "",
    rooms: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    image: "",
    tag: "",
    operation: "",
    type: "",
    available: true,
  };

  const validate = (values) => {
    let errors = {};

    if (!values.title.trim()) errors.title = "El título es obligatorio";
    if (!values.description.trim()) errors.description = "La descripción es obligatoria";

    if (!values.price || Number(values.price) <= 0) {
      errors.price = "El precio debe ser mayor a 0";
    }

    if (!values.location.trim()) errors.location = "La ubicación es obligatoria";

    if (values.rooms && Number(values.rooms) < 0) {
      errors.rooms = "Los ambientes no pueden ser negativos";
    }

    if (values.bedrooms && Number(values.bedrooms) < 0) {
      errors.bedrooms = "Los dormitorios no pueden ser negativos";
    }

    if (values.bathrooms && Number(values.bathrooms) < 0) {
      errors.bathrooms = "Los baños no pueden ser negativos";
    }

    if (values.area && Number(values.area) <= 0) {
      errors.area = "El área debe ser mayor a 0";
    }

    if (values.image && !/^https?:\/\/.+/i.test(values.image)) {
      errors.image = "Debe ser una URL válida";
    }

    if (!values.operation) {
      errors.operation = "Debes seleccionar si es compra o alquiler";
    }

    if (!values.type) {
      errors.type = "Debes seleccionar el tipo de propiedad";
    }

    return errors;
  };

  const onSubmit = (values) => {
    fetch(`${API_BASE_URL}/properties`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Propiedad agregada con éxito 🎉");
        console.log("Nueva propiedad:", data);
      })
      .catch((err) => console.error("Error al crear propiedad:", err));
  };

  const { form, errors, handleChange, handleSubmit } = useForm(initialValues, validate, onSubmit);

  return (
    <div className="page">
      <h1>Agregar nueva propiedad</h1>
      <form onSubmit={handleSubmit}>
        {/* Título */}
        <div className="form-group">
          <label>Título:</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className={errors.title ? "error-input" : ""}
          />
          {errors.title && <p className="error">{errors.title}</p>}
        </div>

        {/* Descripción */}
        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className={errors.description ? "error-input" : ""}
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>

        {/* Precio */}
        <div className="form-group">
          <label>Precio ($):</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className={errors.price ? "error-input" : ""}
          />
          {errors.price && <p className="error">{errors.price}</p>}
        </div>

        {/* Ubicación */}
        <div className="form-group">
          <label>Ubicación:</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className={errors.location ? "error-input" : ""}
          />
          {errors.location && <p className="error">{errors.location}</p>}
        </div>

        {/* c/Ambientes */}
        <div className="form-group">
          <label>Ambientes:</label>
          <input
            type="number"
            name="rooms"
            value={form.rooms}
            onChange={handleChange}
            className={errors.rooms ? "error-input" : ""}
          />
          {errors.rooms && <p className="error">{errors.rooms}</p>}
        </div>

        {/* c/Dormitorios */}
        <div className="form-group">
          <label>Dormitorios:</label>
          <input
            type="number"
            name="bedrooms"
            value={form.bedrooms}
            onChange={handleChange}
            className={errors.bedrooms ? "error-input" : ""}
          />
          {errors.bedrooms && <p className="error">{errors.bedrooms}</p>}
        </div>

        {/* c/Baños */}
        <div className="form-group">
          <label>Baños:</label>
          <input
            type="number"
            name="bathrooms"
            value={form.bathrooms}
            onChange={handleChange}
            className={errors.bathrooms ? "error-input" : ""}
          />
          {errors.bathrooms && <p className="error">{errors.bathrooms}</p>}
        </div>

        {/* Área */}
        <div className="form-group">
          <label>Área (m²):</label>
          <input
            type="number"
            name="area"
            value={form.area}
            onChange={handleChange}
            className={errors.area ? "error-input" : ""}
          />
          {errors.area && <p className="error">{errors.area}</p>}
        </div>

        {/* Imagen */}
        <div className="form-group">
          <label>URL de la imagen:</label>
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            className={errors.image ? "error-input" : ""}
          />
          {errors.image && <p className="error">{errors.image}</p>}
        </div>

        {/* tags */}
        <div className="form-group">
          <label>Etiqueta (Tag):</label>
          <select name="tag" value={form.tag} onChange={handleChange}>
            <option value="">Ninguna</option>
            <option value="Luminoso">Luminoso</option>
            <option value="Super destacado">Super destacado</option>
            <option value="Oportunidad">Oportunidad</option>
          </select>
        </div>

        {/* Compra/Venta */}
        <div className="form-group">
          <label>Operación:</label>
          <select
            name="operation"
            value={form.operation}
            onChange={handleChange}
            className={errors.operation ? "error-input" : ""}
          >
            <option value="">Seleccionar</option>
            <option value="comprar">Comprar</option>
            <option value="alquilar">Alquilar</option>
          </select>
          {errors.operation && <p className="error">{errors.operation}</p>}
        </div>

        {/* Tipo de propiedad */}
        <div className="form-group">
          <label>Tipo de propiedad:</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className={errors.type ? "error-input" : ""}
          >
            <option value="">Seleccionar</option>
            <option value="casa">Casa</option>
            <option value="departamento">Departamento</option>
            <option value="comercial">Comercial</option>
          </select>
          {errors.type && <p className="error">{errors.type}</p>}
        </div>

        {/* Disponible */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="available"
              checked={form.available}
              onChange={handleChange}
            />
            Disponible
          </label>
        </div>
        <div className="form-actions">
          <button type="submit">Agregar propiedad</button>
        </div>
      </form>
    </div>
  );
}
