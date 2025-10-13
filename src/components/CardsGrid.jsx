
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
          location={property.ubicacion}
          price={property.precio}
          expenses={property.expensas}
          currency={property.moneda}
          image={property.imagen}
          description={property.descripcionLarga}
          tag={property.tipo}
        />
      ))}
    </div>
  );
}
