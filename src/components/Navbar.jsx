
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/dorado.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Logo */}
        <div className="navbar__brand">
          <Link to="/" onClick={closeMenu}>
            <img src={logo} alt="Medina Abella Inmobiliaria" className="navbar__logo" />
          </Link>
        </div>

        {/* Botón Toggle */}
        <button className="navbar__toggle" onClick={toggleMenu}>
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>

        {/* Links */}
        <ul className={`navbar__links ${menuOpen ? "active" : ""}`}>
          <li><Link to="/" onClick={closeMenu}>Inicio</Link></li>
          <li><Link to="/properties" onClick={closeMenu}>Propiedades</Link></li>
          <li><Link to="/add-property" onClick={closeMenu}>Agregar Propiedad</Link></li>
          <li><Link to="/contact" onClick={closeMenu}>Contacto</Link></li>
          <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
          <li><Link to="/register" onClick={closeMenu}>Registro</Link></li>
        </ul>
      </div>
    </nav>
  );
}
