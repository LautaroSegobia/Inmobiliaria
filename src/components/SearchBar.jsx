
import React, { useState } from "react";

export default function SearchBar({ properties, setFiltered }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [tag, setTag] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    let result = [...properties];

    // Texto
    if (query.trim()) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.location.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Precio
    if (minPrice) {
      result = result.filter((p) => Number(p.price) >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter((p) => Number(p.price) <= Number(maxPrice));
    }

    // Tags
    if (tag) {
      result = result.filter((p) => p.tag === tag);
    }

    // Precio
    if (sort === "asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    setFiltered(result);
  };

  return (
    <form className="searchbar" onSubmit={handleSearch}>
      {/* Texto */}
      <input
        type="text"
        placeholder="Buscar por título o ubicación..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Precio */}
      <input
        type="number"
        placeholder="Precio mínimo"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Precio máximo"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />

      {/* tags */}
      <select value={tag} onChange={(e) => setTag(e.target.value)}>
        <option value="">Todas las etiquetas</option>
        <option value="Luminoso">Luminoso</option>
        <option value="Super destacado">Super destacado</option>
        <option value="Oportunidad">Oportunidad</option>
      </select>

      {/* Ordenamiento */}
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="">Ordenar por precio</option>
        <option value="asc">Menor a mayor</option>
        <option value="desc">Mayor a menor</option>
      </select>

      <button type="submit">Aplicar filtros</button>
    </form>
  );
}
