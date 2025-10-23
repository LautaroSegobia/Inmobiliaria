
import React from "react";
import Card from "./Card";

export default function CardsGrid({ properties = [] }) {
  if (!properties.length) {
    return <p>No hay propiedades disponibles</p>;
  }

  return (
    <div className="cards-grid">
      {properties.map((property) => (
        <Card
          key={property.id}
          id={property.id}
          title={property.titulo}
          calle={property.calle}
          numero={property.numero}
          zona={property.zona}
          price={property.precio}
          expenses={property.expensas}
          currency={property.moneda}
          image={property.imagen}
          images={property.imagenes}
          description={property.descripcionCorta}
          tag={property.tipo}
        />
      ))}
    </div>
  );
}
