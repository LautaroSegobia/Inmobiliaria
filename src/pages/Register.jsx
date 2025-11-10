
import { useState } from "react";
import useForm from "../hooks/useForm";
import { registerUser } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const { login } = useAuth();
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const initialValues = { nombre: "", apellido: "", email: "", password: "", confirmPassword: "" };

  const validate = (values) => {
    let errors = {};

    if (!values.nombre.trim()) errors.nombre = "El nombre es obligatorio";
    if (!values.apellido.trim()) errors.apellido = "El apellido es obligatorio";

    if (!values.email.trim()) errors.email = "El email es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = "El email no es válido";

    if (!values.password) errors.password = "La contraseña es obligatoria";
    else if (values.password.length < 6) errors.password = "Debe tener al menos 6 caracteres";

    if (values.password !== values.confirmPassword)
      errors.confirmPassword = "Las contraseñas no coinciden";

    return errors;
  };

  const onSubmit = async (values) => {
  const payload = {
    name: values.nombre,
    lastname: values.apellido,
    email: values.email,
    password: values.password,
  };

  try {
    const data = await registerUser(payload);

    // Guarda sesión usando el contexto
    login(data.user, data.token);

    window.location.href = "/dashboard";
  } catch (err) {
    console.error(err.response?.data);
    alert(err.response?.data?.message || "❌ Error en el registro");
  }
};

  const { form, errors, handleChange, handleSubmit } = useForm(initialValues, validate, onSubmit);

  return (
    <div className="page">
      <h1>Crear cuenta</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} />
          {errors.nombre && <p className="error">{errors.nombre}</p>}
        </div>

        <div>
          <label>Apellido:</label>
          <input name="apellido" value={form.apellido} onChange={handleChange} />
          {errors.apellido && <p className="error">{errors.apellido}</p>}
        </div>

        <div>
          <label>Email:</label>
          <input name="email" value={form.email} onChange={handleChange} />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div>
          <label>Contraseña:</label>
          <div className="password-wrapper">
            <input
              type={showPassword1 ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            <input type="checkbox" onChange={() => setShowPassword1(!showPassword1)} />
          </div>
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div>
          <label>Confirmar Contraseña:</label>
          <div className="password-wrapper">
            <input
              type={showPassword2 ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <input type="checkbox" onChange={() => setShowPassword2(!showPassword2)} />
          </div>
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}
