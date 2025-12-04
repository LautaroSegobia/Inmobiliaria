
import React from "react";
import Card from "./Card";

const FALLBACK_IMAGE = "https://placehold.co/400x250?text=Sin+Imagen";

export default function CardsGrid({ properties = [] }) {
  if (!Array.isArray(properties) || properties.length === 0) {
    return <p className="no-properties">No hay propiedades disponibles</p>;
  }

  return (
    <div className="cards-grid">
      {properties.map((p, i) => {
        // --- NORMALIZACIÓN DE IMÁGENES ---
        let imgs = [];

        // 1) multimedia (backend nuevo)
        if (Array.isArray(p.multimedia) && p.multimedia.length > 0) {
          imgs = p.multimedia.map((img) =>
            typeof img === "string"
              ? img
              : img?.url || FALLBACK_IMAGE
          );
        }

        // 2) imagenes (backend viejo)
        else if (Array.isArray(p.imagenes) && p.imagenes.length > 0) {
          imgs = p.imagenes.map((img) =>
            typeof img === "string"
              ? img
              : img?.url || FALLBACK_IMAGE
          );
        }

        // 3) mainImage puede ser string o {url}
        else if (p.mainImage) {
          imgs = [
            typeof p.mainImage === "string"
              ? p.mainImage
              : p.mainImage?.url || FALLBACK_IMAGE,
          ];
        }

        // 4) imagen (súper viejo)
        else if (p.imagen) {
          imgs = [p.imagen];
        }

        // 5) fallback total
        else {
          imgs = [FALLBACK_IMAGE];
        }

        return (
          <Card
            key={p._id || `property-${i}`}
            id={p._id}
            title={p.titulo || "Propiedad sin título"}
            calle={p.calle || ""}
            numero={p.numero || ""}
            zona={p.zona || "Zona no especificada"}
            price={p.precio?.valor || p.precio || 0}
            expenses={p.expensas?.valor || p.expensas || 0}
            currency={p.precio?.moneda || p.moneda || "ARS"}
            image={imgs[0]}
            images={imgs} 
            description={p.descripcionCorta || "Sin descripción disponible"}
            tag={p.tipo || "Sin tipo"}
          />
        );
      })}
    </div>
  );
}
