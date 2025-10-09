
import { Link } from "react-router-dom";
import logo from "../assets/blanco.svg";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <Link to="/">
          <img
            src={logo}
            alt="Medina Abella Inmobiliaria"
            className="navbar__logo"
          />
        </Link>
      </div>
      <ul className="navbar__links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/properties">Propiedades</Link></li>
        <li><Link to="/add-property">Agregar Propiedad</Link></li>
        <li><Link to="/contact">Contacto</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Registro</Link></li>
      </ul>
    </nav>
  );
}
