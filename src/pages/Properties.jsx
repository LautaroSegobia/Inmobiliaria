
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CardsGrid from "../components/CardsGrid";

export default function Properties() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    bathrooms: "",
    bedrooms: "",
    rooms: "",
    minPrice: "",
    maxPrice: "",
  });

  const initialFilters = {
    operation: params.get("operation") || "",
    type: params.get("type") || "",
    location: params.get("location") || "",
  };

  useEffect(() => {
    fetch("https://68cca15b716562cf5077f884.mockapi.io/properties")
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch((err) => console.error("Error al cargar propiedades:", err));
  }, []);

  const filteredProperties = properties.filter((p) => {
    if (initialFilters.operation && p.operation !== initialFilters.operation) return false;
    if (initialFilters.type && p.type !== initialFilters.type) return false;
    if (initialFilters.location && !p.location.toLowerCase().includes(initialFilters.location.toLowerCase())) return false;

    if (filters.bathrooms && Number(p.bathrooms) < Number(filters.bathrooms)) return false;
    if (filters.bedrooms && Number(p.bedrooms) < Number(filters.bedrooms)) return false;
    if (filters.rooms && Number(p.rooms) < Number(filters.rooms)) return false;
    if (filters.minPrice && Number(p.price) < Number(filters.minPrice)) return false;
    if (filters.maxPrice && Number(p.price) > Number(filters.maxPrice)) return false;

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
        <input type="number" name="bathrooms" value={filters.bathrooms} onChange={handleFilterChange} />

        <label>Dormitorios (mín):</label>
        <input type="number" name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange} />

        <label>Ambientes (mín):</label>
        <input type="number" name="rooms" value={filters.rooms} onChange={handleFilterChange} />

        <label>Precio mínimo:</label>
        <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} />

        <label>Precio máximo:</label>
        <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} />
      </aside>

      <section className="properties__results">
        <h2>Propiedades encontradas ({filteredProperties.length})</h2>
        <CardsGrid properties={filteredProperties} />
      </section>
    </div>
  );
}
