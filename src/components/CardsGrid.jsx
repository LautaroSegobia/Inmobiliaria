
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
          title={property.title}
          location={property.location}
          price={property.price}
          expenses={property.expenses}
          image={property.image}
          description={property.description}
          tag={property.tag}
        />
      ))}
    </div>
  );
}
