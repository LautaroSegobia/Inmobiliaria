
import React from "react";
import Card from "./Card";

export default function CardsGrid({ properties = [] }) {
  if (!properties.length) {
    return <p>No hay propiedades disponibles</p>;
  }

  return (
    <div className="cards-grid">
      {properties.map((property) => {
        // si tiene imágenes, usamos la primera; si no, usamos una de fallback
        const fallback = "https://placehold.co/600x400?text=Sin+Imagen";
        const firstImage =
          property.imagenes && property.imagenes.length > 0
            ? property.imagenes[0]
            : fallback;

        return (
          <Card
            key={property.id}
            id={property.id}
            title={property.titulo}
            location={property.ubicacion}
            price={property.precio}
            expenses={property.expensas}
            currency={property.moneda}
            image={firstImage}
            description={property.descripcionLarga}
            tag={property.tipo}
          />
        );
      })}
    </div>
  );
}
