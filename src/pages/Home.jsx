
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [operation, setOperation] = useState("comprar");
  const [type, setType] = useState("casa");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      `/properties?operation=${operation}&type=${type}&location=${location}`
    );
  };

  return (
    <div className="home">
      <div className="home__hero">
        <h1 className="home__title">Encontrá tu hogar</h1>

        <form className="home__search" onSubmit={handleSearch}>
          <div className="home__search-row">
            <div className="home__search-group">
              <label>Operación</label>
              <select value={operation} onChange={(e) => setOperation(e.target.value)}>
                <option value="comprar">Comprar</option>
                <option value="alquilar">Alquilar</option>
              </select>
            </div>

            <div className="home__search-group">
              <label>Tipo</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="terreno">Terreno</option>
              </select>
            </div>

            <div className="home__search-group">
              <label>Ubicación</label>
              <input
                type="text"
                placeholder="Ej: Palermo, Córdoba..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn--primary">
              Buscar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
