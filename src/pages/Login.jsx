
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { loginUser } from "../services/authService"; 
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const initialValues = { email: "", password: "" };

  const validate = (values) => {
    let errors = {};
    if (!values.email.trim()) {
      errors.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "El email no es válido";
    }
    if (!values.password.trim()) {
      errors.password = "La contraseña es obligatoria";
    }
    return errors;
  };

  const onSubmit = async (values) => {
  try {
    const data = await loginUser(values);

    // Guardamos sesión usando el contexto
      login(data.user, data.token);

    // Redirigir al dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error al iniciar sesión");
    }
  };

  const { form, errors, handleChange, handleSubmit } = useForm(initialValues, validate, onSubmit);

  return (
    <div className="page">
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? "error-input" : ""}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className={errors.password ? "error-input" : ""}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}
