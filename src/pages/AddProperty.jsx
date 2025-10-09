
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  titulo: yup
    .string()
    .required("El título es obligatorio")
    .min(3, "Debe tener al menos 3 caracteres"),
  descripcionCorta: yup
    .string()
    .required("La descripción corta es obligatoria")
    .min(10, "Debe tener al menos 10 caracteres"),
  descripcionLarga: yup
    .string()
    .required("La descripción larga es obligatoria")
    .min(20, "Debe tener al menos 20 caracteres"),
  precio: yup
    .number()
    .typeError("Debe ser un número")
    .positive("Debe ser mayor a 0")
    .required("El precio es obligatorio"),
  moneda: yup.string().required("Debes seleccionar una moneda"),
  expensas: yup
    .number()
    .typeError("Debe ser un número")
    .min(0, "No puede ser negativo")
    .required("Las expensas son obligatorias"),
  monedaExpensas: yup.string().required("Debes seleccionar una moneda"),
  areaCubierta: yup
    .number()
    .typeError("Debe ser un número")
    .min(0)
    .required("Campo obligatorio"),
  areaDescubierta: yup
    .number()
    .typeError("Debe ser un número")
    .min(0)
    .required("Campo obligatorio"),
  areaTotal: yup
    .number()
    .typeError("Debe ser un número")
    .min(0)
    .required("Campo obligatorio"),
  terreno: yup
    .number()
    .typeError("Debe ser un número")
    .min(0)
    .required("Campo obligatorio"),
  ambientes: yup
    .number()
    .typeError("Debe ser un número")
    .min(1)
    .required("Campo obligatorio"),
  dormitorios: yup
    .number()
    .typeError("Debe ser un número")
    .min(0)
    .required("Campo obligatorio"),
  banios: yup
    .number()
    .typeError("Debe ser un número")
    .min(0)
    .required("Campo obligatorio"),
  cochera: yup.boolean().required(),
  balcon: yup.boolean().required(),
  luminosidad: yup.string().required("Debes seleccionar una opción"),
  orientacion: yup.string().required("Debes seleccionar una orientación"),
  piso: yup
    .number()
    .typeError("Debe ser un número")
    .min(0)
    .required("Campo obligatorio"),
  antiguedad: yup
    .number()
    .typeError("Debe ser un número")
    .min(0)
    .required("Campo obligatorio"),
  ubicacion: yup.string().required("La ubicación es obligatoria"),
  operacion: yup.string().required("Debes seleccionar una operación"),
  tipo: yup.string().required("Debes seleccionar un tipo de propiedad"),
  imagen: yup
    .string()
    .url("Debe ser una URL válida")
    .nullable()
    .notRequired(),
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
        "https://68cca15b716562cf5077f884.mockapi.io/properties",
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
        {/* TITULO */}
        <div className="form-group">
          <label>Título</label>
          <input {...register("titulo")} />
          <p className="error">{errors.titulo?.message}</p>
        </div>

        {/* DESCRIPCIONES */}
        <div className="form-group">
          <label>Descripción corta</label>
          <textarea {...register("descripcionCorta")} />
          <p className="error">{errors.descripcionCorta?.message}</p>
        </div>

        <div className="form-group">
          <label>Descripción larga</label>
          <textarea {...register("descripcionLarga")} />
          <p className="error">{errors.descripcionLarga?.message}</p>
        </div>

        {/* PRECIO Y MONEDA */}
        <div className="form-row">
          <div className="form-group">
            <label>Precio</label>
            <input type="number" {...register("precio")} />
            <p className="error">{errors.precio?.message}</p>
          </div>
          <div className="form-group">
            <label>Moneda</label>
            <select {...register("moneda")}>
              <option value="">Seleccionar</option>
              <option value="ARS">$ (Pesos Argentinos)</option>
              <option value="USD">US$ (Dólares)</option>
            </select>
            <p className="error">{errors.moneda?.message}</p>
          </div>
        </div>

        {/* EXPENSAS */}
        <div className="form-row">
          <div className="form-group">
            <label>Expensas</label>
            <input type="number" {...register("expensas")} />
            <p className="error">{errors.expensas?.message}</p>
          </div>
          <div className="form-group">
            <label>Moneda Expensas</label>
            <select {...register("monedaExpensas")}>
              <option value="">Seleccionar</option>
              <option value="ARS">$</option>
              <option value="USD">US$</option>
            </select>
            <p className="error">{errors.monedaExpensas?.message}</p>
          </div>
        </div>

        {/* ÁREAS */}
        <div className="form-row">
          <div className="form-group">
            <label>m² Cubiertos</label>
            <input type="number" {...register("areaCubierta")} />
          </div>
          <div className="form-group">
            <label>m² Descubiertos</label>
            <input type="number" {...register("areaDescubierta")} />
          </div>
          <div className="form-group">
            <label>Total m²</label>
            <input type="number" {...register("areaTotal")} />
          </div>
          <div className="form-group">
            <label>Terreno (m²)</label>
            <input type="number" {...register("terreno")} />
          </div>
        </div>

        {/* DETALLES */}
        <div className="form-row">
          <div className="form-group">
            <label>Ambientes</label>
            <input type="number" {...register("ambientes")} />
          </div>
          <div className="form-group">
            <label>Dormitorios</label>
            <input type="number" {...register("dormitorios")} />
          </div>
          <div className="form-group">
            <label>Baños</label>
            <input type="number" {...register("banios")} />
          </div>
          <div className="form-group">
            <label>Piso</label>
            <input type="number" {...register("piso")} />
          </div>
        </div>

        {/* CHECKS Y SELECTS */}
        <div className="form-row">
          <div className="form-group checkbox">
            <label>
              <input type="checkbox" {...register("cochera")} /> Cochera
            </label>
          </div>
          <div className="form-group checkbox">
            <label>
              <input type="checkbox" {...register("balcon")} /> Balcón
            </label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Luminosidad</label>
            <select {...register("luminosidad")}>
              <option value="">Seleccionar</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>

          <div className="form-group">
            <label>Orientación</label>
            <select {...register("orientacion")}>
              <option value="">Seleccionar</option>
              <option value="norte">Norte</option>
              <option value="sur">Sur</option>
              <option value="este">Este</option>
              <option value="oeste">Oeste</option>
            </select>
          </div>
        </div>

        {/* ANTIGÜEDAD Y UBICACIÓN */}
        <div className="form-row">
          <div className="form-group">
            <label>Antigüedad (años)</label>
            <input type="number" {...register("antiguedad")} />
          </div>
          <div className="form-group">
            <label>Ubicación</label>
            <input {...register("ubicacion")} />
          </div>
        </div>

        {/* IMAGEN */}
        <div className="form-group">
          <label>Imagen (URL)</label>
          <input {...register("imagen")} />
        </div>

        {/* OPERACIÓN Y TIPO */}
        <div className="form-row">
          <div className="form-group">
            <label>Operación</label>
            <select {...register("operacion")}>
              <option value="">Seleccionar</option>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tipo de Propiedad</label>
            <select {...register("tipo")}>
              <option value="">Seleccionar</option>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="comercial">Local Comercial</option>
              <option value="terreno">Terreno</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Agregar Propiedad"}
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
