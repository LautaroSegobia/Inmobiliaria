
import useForm from "../hooks/useForm";

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
    available: true,
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    const numericValue = value.toString().replace(/\D/g, "");
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(numericValue);
  };

  const validate = (values) => {
    let errors = {};
    if (!values.title.trim()) errors.title = "El título es obligatorio";
    if (!values.description.trim()) errors.description = "La descripción es obligatoria";

    const numericPrice = Number(values.price.toString().replace(/\D/g, ""));
    if (!numericPrice || numericPrice <= 0) errors.price = "El precio debe ser mayor a 0";

    if (!values.location.trim()) errors.location = "La ubicación es obligatoria";

    const numericArea = Number(values.area);
    if (values.area && numericArea <= 0) errors.area = "El área debe ser mayor a 0";

    if (values.image && !/^https?:\/\/.+/i.test(values.image)) {
      errors.image = "Debe ser una URL válida";
    }

    return errors;
  };

  const onSubmit = (values) => {
    const payload = {
      ...values,
      price: Number(values.price.toString().replace(/\D/g, "")),
    };

    fetch("https://68cca15b716562cf5077f884.mockapi.io/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Propiedad agregada con éxito 🎉");
        console.log("Nueva propiedad:", data);
      })
      .catch((err) => console.error("Error al crear propiedad:", err));
  };

  const { form, errors, handleChange, handleSubmit, setForm } = useForm(
    initialValues,
    validate,
    onSubmit
  );

  const handlePriceChange = (e) => {
    const { value } = e.target;
    const formatted = formatCurrency(value);
    setForm({ ...form, price: formatted });
  };

  return (
    <div className="page">
      <h1>Agregar nueva propiedad</h1>
      <form onSubmit={handleSubmit}>
        <div>
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

        <div>
          <label>Descripción:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className={errors.description ? "error-input" : ""}
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>

        <div>
          <label>Precio:</label>
          <input
            type="text"
            name="price"
            value={form.price}
            onChange={handlePriceChange}
            className={errors.price ? "error-input" : ""}
          />
          {errors.price && <p className="error">{errors.price}</p>}
        </div>

        <div>
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

        <div>
          <label>Ambientes:</label>
          <input type="number" name="rooms" value={form.rooms} onChange={handleChange} />
        </div>

        <div>
          <label>Dormitorios:</label>
          <input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} />
        </div>

        <div>
          <label>Baños:</label>
          <input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} />
        </div>

        <div>
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

        <div>
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

        <div>
          <label>Etiqueta (Tag):</label>
          <select name="tag" value={form.tag} onChange={handleChange}>
            <option value="">Ninguna</option>
            <option value="Luminoso">Luminoso</option>
            <option value="Super destacado">Super destacado</option>
            <option value="Oportunidad">Oportunidad</option>
          </select>
        </div>

        <button type="submit">Agregar propiedad</button>
      </form>
    </div>
  );
}
