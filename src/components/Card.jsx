
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const FALLBACK_IMAGE = "https://placehold.co/400x250?text=Sin+Imagen";

export default function Card({
  id,
  title,
  location,
  price,
  expenses,
  currency,
  image,
  description,
  tag,
}) {
  const formatPrice = (value, currency = "ARS") => {
    if (!value || isNaN(value)) return "$0";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="card">
      {/* Imagen y etiqueta */}
      <div className="card__image">
        <img
          src={image || FALLBACK_IMAGE}
          alt={title || "Propiedad"}
          className="card__img"
          onError={(e) => (e.target.src = FALLBACK_IMAGE)}
        />
        {tag && <span className="card__tag">{tag}</span>}
      </div>

      {/* Contenido */}
      <div className="card__content">
        <div className="card__header">
          <h3 className="card__price">{formatPrice(price, currency)}</h3>
          {expenses > 0 && (
            <p className="card__expenses">
              Expensas: {formatPrice(expenses, "ARS")}
            </p>
          )}
          <h4 className="card__title">{title}</h4>
          <p className="card__location">{location}</p>
        </div>

        <p className="card__description">
          {description?.slice(0, 100) || "Sin descripción"}...
        </p>

        {/* Acciones */}
        <div className="card__actions">
          <Link to={`/properties/${id}`} className="btn btn-primary">
            <FontAwesomeIcon icon={faInfoCircle} /> Ver detalles
          </Link>
          <button className="btn btn-whatsapp">
            <FontAwesomeIcon icon={faWhatsapp} /> WhatsApp
          </button>
          <button className="btn btn-secondary">
            <FontAwesomeIcon icon={faEnvelope} /> Contactar
          </button>
        </div>
      </div>
    </div>
  );
}
