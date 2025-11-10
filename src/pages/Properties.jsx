
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import CardsGrid from "../components/CardsGrid";

export default function Properties() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    banios: "",
    dormitorios: "",
    ambientes: "",
    minPrecio: "",
    maxPrecio: "",
  });

  // ✅ Filtros iniciales por URL
  const initialFilters = {
    operacion: params.get("operacion") || "",
    tipo: params.get("tipo") || "",
    zona: params.get("ubicacion") || "",
  };

  // ✅ Cargar propiedades desde el backend real
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_BASE}/api/properties`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Adaptar formato si es necesario
        const data = res.data.map((p) => ({
          ...p,
          precio: p.precio?.valor || p.precio || 0,
          expensas: p.expensas?.valor || p.expensas || 0,
        }));

        setProperties(data);
      } catch (err) {
        console.error("❌ Error al cargar propiedades:", err);
      }
    };

    fetchProperties();
  }, []);

  // ✅ Aplicar filtros dinámicos
  const filteredProperties = properties.filter((p) => {
    if (initialFilters.operacion && p.operacion !== initialFilters.operacion) return false;
    if (initialFilters.tipo && p.tipo !== initialFilters.tipo) return false;
    if (
      initialFilters.zona &&
      !p.zona?.toLowerCase().includes(initialFilters.zona.toLowerCase())
    )
      return false;

    if (filters.banios && Number(p.banos) < Number(filters.banios)) return false;
    if (filters.dormitorios && Number(p.dormitorios) < Number(filters.dormitorios)) return false;
    if (filters.ambientes && Number(p.ambientes) < Number(filters.ambientes)) return false;
    if (filters.minPrecio && Number(p.precio) < Number(filters.minPrecio)) return false;
    if (filters.maxPrecio && Number(p.precio) > Number(filters.maxPrecio)) return false;

    return true;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  return (
    <div className="properties">
      <aside className="properties__filters">
        <h3>Filtrar</h3>

        <label>Baños (mín):</label>
        <input type="number" name="banios" value={filters.banios} onChange={handleFilterChange} />

        <label>Dormitorios (mín):</label>
        <input
          type="number"
          name="dormitorios"
          value={filters.dormitorios}
          onChange={handleFilterChange}
        />

        <label>Ambientes (mín):</label>
        <input
          type="number"
          name="ambientes"
          value={filters.ambientes}
          onChange={handleFilterChange}
        />

        <label>Precio mínimo:</label>
        <input
          type="number"
          name="minPrecio"
          value={filters.minPrecio}
          onChange={handleFilterChange}
        />

        <label>Precio máximo:</label>
        <input
          type="number"
          name="maxPrecio"
          value={filters.maxPrecio}
          onChange={handleFilterChange}
        />
      </aside>

      <section className="properties__results">
        <h2>Propiedades encontradas ({filteredProperties.length})</h2>
        <CardsGrid properties={filteredProperties} />
      </section>
    </div>
  );
}
