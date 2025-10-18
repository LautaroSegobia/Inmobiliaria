
import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

/* Configuración mockapi y cloudinary */
const MOCKAPI_BASE = "https://68cca15b716562cf5077f884.mockapi.io";
const MOCKAPI_ENDPOINT = "properties";

const CLOUD_NAME = "dcnd6bmzb";
const UPLOAD_PRESET = "propiedades_unsigned";

const schema = yup.object().shape({
  titulo: yup.string().required("El título es obligatorio").min(3),
  descripcionCorta: yup.string().required("La descripción corta es obligatoria").min(10),
  descripcionLarga: yup.string().required("La descripción larga es obligatoria").min(20),
  precio: yup.number().typeError("Debe ser un número").positive().required(),
  moneda: yup.string().required("Selecciona una moneda"),
  expensas: yup.number().typeError("Debe ser un número").min(0).required(),
  monedaExpensas: yup.string().required("Selecciona una moneda"),
  areaCubierta: yup.number().typeError("Debe ser un número").min(0).required(),
  areaDescubierta: yup.number().typeError("Debe ser un número").min(0).required(),
  areaTotal: yup.number().typeError("Debe ser un número").min(0).required(),
  cochera: yup.boolean(),
  dormitorios: yup.number().typeError("Debe ser un número").min(0).required(),
  banios: yup.number().typeError("Debe ser un número").min(0).required(),
  ambientes: yup.number().typeError("Debe ser un número").min(1).required(),
  piso: yup.number().typeError("Debe ser un número").min(0).required(),
  balcon: yup.boolean(),
  antiguedad: yup.number().typeError("Debe ser un número").min(0).required(),
  operacion: yup.string().required("Selecciona una operación"),
  tipo: yup.string().required("Selecciona un tipo de propiedad"),
  luminosidad: yup.string().required("Selecciona luminosidad"),
  orientacion: yup.string().required("Selecciona orientación"),
  calle: yup.string().required("La calle es obligatoria"),
  numero: yup.string().required("El número es obligatorio"),
  zona: yup.string().required("La zona es obligatoria"),
});

export default function AddProperty() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      titulo: "",
      descripcionCorta: "",
      descripcionLarga: "",
      precio: "",
      moneda: "",
      expensas: "",
      monedaExpensas: "",
      areaCubierta: "",
      areaDescubierta: "",
      areaTotal: "",
      cochera: false,
      dormitorios: "",
      banios: "",
      ambientes: "",
      piso: "",
      balcon: false,
      antiguedad: "",
      operacion: "",
      tipo: "",
      luminosidad: "media",
      orientacion: "norte",
      calle: "",
      numero: "",
      zona: "",
    },
  });

  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    const imgs = selected.filter((f) => f.type.startsWith("image/"));
    setFiles(imgs);
  };

  const uploadFiles = async (selectedFiles) => {
    const urls = [];
    setUploadProgress(0);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          formData,
          {
            onUploadProgress: (e) => {
              const totalProgress =
                ((i + e.loaded / e.total) / selectedFiles.length) * 100;
              setUploadProgress(Math.round(totalProgress));
            },
          }
        );
        if (res.data.secure_url) urls.push(res.data.secure_url);
      } catch (err) {
        console.error("Error subiendo imagen:", err.message);
      }
    }

    setUploadProgress(0);
    return urls;
  };

  const onSubmit = async (data) => {
    try {
      const uploadedUrls = files.length ? await uploadFiles(files) : [];
      const direccionCompleta = `${data.calle} ${data.numero}, ${data.zona}`;
      const payload = { 
          ...data, 
          direccion: direccionCompleta,
          imagenes: uploadedUrls 
          };

      const res = await axios.post(`${MOCKAPI_BASE}/${MOCKAPI_ENDPOINT}`, payload);

      if (res.status >= 200 && res.status < 300) {
        alert("Propiedad agregada con éxito 🎉");
        reset();
        setFiles([]);
      } else {
        alert("Error al guardar la propiedad");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error.message);
      alert("Hubo un error al guardar la propiedad");
    }
  };

  return (
    <div className="add-property">
      <h2>Agregar Propiedad</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* DATOS BÁSICOS */}
        <div className="form-group">
          <label>Título</label>
          <input {...register("titulo")} />
          <p className="error">{errors.titulo?.message}</p>
        </div>

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

        {/* OPERACIÓN */}
        <div className="form-group">
          <label>Operación</label>
          <select {...register("operacion")}>
            <option value="">Seleccionar</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
          <p className="error">{errors.operacion?.message}</p>
        </div>

        {/* TIPO DE PROPIEDAD */}
        <div className="form-group">
          <label>Tipo</label>
          <select {...register("tipo")}>
            <option value="">Seleccionar</option>
            <option value="casa">Casa</option>
            <option value="departamento">Departamento</option>
            <option value="local comercial">Local comercial</option>
            <option value="terreno">Terreno</option>
          </select>
          <p className="error">{errors.tipo?.message}</p>
        </div>

        {/* PRECIO Y EXPENSAS */}
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
              <option value="ARS">Pesos</option>
              <option value="USD">Dólares</option>
            </select>
            <p className="error">{errors.moneda?.message}</p>
          </div>
        </div>

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
              <option value="ARS">Pesos</option>
              <option value="USD">Dólares</option>
            </select>
            <p className="error">{errors.monedaExpensas?.message}</p>
          </div>
        </div>

        {/* MEDIDAS */}
        <div className="form-row">
          <div className="form-group">
            <label>m² Cubiertos</label>
            <input type="number" {...register("areaCubierta")} />
            <p className="error">{errors.areaCubierta?.message}</p>
          </div>
          <div className="form-group">
            <label>m² Descubiertos</label>
            <input type="number" {...register("areaDescubierta")} />
            <p className="error">{errors.areaDescubierta?.message}</p>
          </div>
          <div className="form-group">
            <label>m² Totales</label>
            <input type="number" {...register("areaTotal")} />
            <p className="error">{errors.areaTotal?.message}</p>
          </div>
        </div>

        {/* CARACTERÍSTICAS */}
        <div className="form-row">
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
            <label>Ambientes</label>
            <input type="number" {...register("ambientes")} />
            <p className="error">{errors.ambientes?.message}</p>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Piso</label>
            <input type="number" {...register("piso")} />
            <p className="error">{errors.piso?.message}</p>
          </div>
          <div className="form-group">
            <label>Antigüedad (años)</label>
            <input type="number" {...register("antiguedad")} />
            <p className="error">{errors.antiguedad?.message}</p>
          </div>
        </div>

        {/* LUMINOSIDAD Y ORIENTACIÓN */}
        <div className="form-row">
          <div className="form-group">
            <label>Luminosidad</label>
            <select {...register("luminosidad")}>
              <option value="">Seleccionar</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
            <p className="error">{errors.luminosidad?.message}</p>
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
            <p className="error">{errors.orientacion?.message}</p>
          </div>
        </div>

        {/* EXTRAS */}
        <div className="form-row">
          <div className="form-group checkbox">
            <input type="checkbox" {...register("cochera")} />
            <label>Tiene cochera</label>
          </div>
          <div className="form-group checkbox">
            <input type="checkbox" {...register("balcon")} />
            <label>Tiene balcón</label>
          </div>
        </div>

        {/* DIRECCIÓN */}
        <div className="form-row">
          <div className="form-group">
            <label>Calle</label>
            <input {...register("calle")} />
            <p className="error">{errors.calle?.message}</p>
          </div>
          <div className="form-group">
            <label>Número</label>
            <input {...register("numero")} />
            <p className="error">{errors.numero?.message}</p>
          </div>
          <div className="form-group">
            <label>Zona / Barrio</label>
            <input {...register("zona")} />
            <p className="error">{errors.zona?.message}</p>
          </div>
        </div>

        {/* IMÁGENES */}
        <div className="form-group">
          <label>Imágenes</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} />
          <div className="preview-grid">
            {previewUrls.map((url, i) => (
              <img key={i} src={url} alt={`preview-${i}`} width="100" />
            ))}
          </div>
          {uploadProgress > 0 && (
            <div>
              Subiendo imágenes: {uploadProgress}%
              <progress value={uploadProgress} max="100"></progress>
            </div>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Agregar Propiedad"}
        </button>
      </form>
    </div>
  );
}
