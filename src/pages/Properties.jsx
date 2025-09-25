
import React, { useEffect, useState } from "react";
import Card from "../components/Card";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://68cca15b716562cf5077f884.mockapi.io/properties")
      .then((res) => res.json())
      .then((data) => {
        setProperties(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al traer propiedades:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando propiedades...</p>;

  return (
    <div className="properties">
      <h1>Propiedades disponibles</h1>
      <div className="properties-grid">
        {properties.map((property) => (
          <Card
            key={property.id}
            id={property.id}
            title={property.title}
            location={property.location}
            price={property.price}
            image={property.image}
            tag={property.tag}
          />
        ))}
      </div>
    </div>
  );
}
