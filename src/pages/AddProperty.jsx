
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  titulo: yup
    .string()
    .required("El título es obligatorio")
    .min(3, "Debe tener al menos 3 caracteres"),
  descripcion: yup
    .string()
    .required("La descripción es obligatoria")
    .min(10, "Debe tener al menos 10 caracteres"),
  precio: yup
    .number()
    .typeError("Debe ser un número")
    .positive("Debe ser mayor a 0")
    .required("El precio es obligatorio"),
  area: yup
    .number()
    .typeError("Debe ser un número")
    .positive("Debe ser mayor a 0")
    .required("El área es obligatoria"),
  ambientes: yup
    .number()
    .typeError("Debe ser un número")
    .min(1, "Debe ser al menos 1")
    .required("Los ambientes son obligatorios"),
  dormitorios: yup
    .number()
    .typeError("Debe ser un número")
    .min(0, "No puede ser negativo")
    .required("Los dormitorios son obligatorios"),
  banios: yup
    .number()
    .typeError("Debe ser un número")
    .min(0, "No puede ser negativo")
    .required("Los baños son obligatorios"),
  ubicacion: yup.string().required("La ubicación es obligatoria"),
  imagen: yup
    .string()
    .url("Debe ser una URL válida")
    .nullable()
    .notRequired(),
  operacion: yup.string().required("Debes seleccionar una operación"),
  tipo: yup.string().required("Debes seleccionar un tipo de propiedad"),
});

const AddProperty = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch(
        "https://68cca15b716562cf5077f884.mockapi.io",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Error al guardar la propiedad");
      alert("Propiedad agregada con éxito 🎉");
      reset();
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al guardar la propiedad");
    }
  };

  return (
    <div className="add-property">
      <h2>Agregar Propiedad</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Título</label>
          <input {...register("titulo")} />
          <p className="error">{errors.titulo?.message}</p>
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea {...register("descripcion")} />
          <p className="error">{errors.descripcion?.message}</p>
        </div>

        <div className="form-group">
          <label>Precio</label>
          <input type="number" {...register("precio")} />
          <p className="error">{errors.precio?.message}</p>
        </div>

        <div className="form-group">
          <label>Área (m²)</label>
          <input type="number" {...register("area")} />
          <p className="error">{errors.area?.message}</p>
        </div>

        <div className="form-group">
          <label>Ambientes</label>
          <input type="number" {...register("ambientes")} />
          <p className="error">{errors.ambientes?.message}</p>
        </div>

        <div className="form-group">
          <label>Dormitorios</label>
          <input type="number" {...register("dormitorios")} />
          <p className="error">{errors.dormitorios?.message}</p>
        </div>

        <div className="form-group">
          <label>Baños</label>
          <input type="number" {...register("banios")} />
          <p className="error">{errors.banios?.message}</p>
        </div>

        <div className="form-group">
          <label>Ubicación</label>
          <input {...register("ubicacion")} />
          <p className="error">{errors.ubicacion?.message}</p>
        </div>

        <div className="form-group">
          <label>Imagen (URL)</label>
          <input {...register("imagen")} />
          <p className="error">{errors.imagen?.message}</p>
        </div>

        <div className="form-group">
          <label>Operación</label>
          <select {...register("operacion")}>
            <option value="">Seleccionar</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
          <p className="error">{errors.operacion?.message}</p>
        </div>

        <div className="form-group">
          <label>Tipo de Propiedad</label>
          <select {...register("tipo")}>
            <option value="">Seleccionar</option>
            <option value="casa">Casa</option>
            <option value="departamento">Departamento</option>
            <option value="comercial">Local comercial</option>
            <option value="terreno">Terreno</option>
          </select>
          <p className="error">{errors.tipo?.message}</p>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Agregar Propiedad"}
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
