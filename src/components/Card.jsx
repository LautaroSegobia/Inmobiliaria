
import React from "react";
import { Link } from "react-router-dom";

export default function Card({ id, title, location, price, expenses, image, description, tag }) {

  const formatPrice = (value) => {
    if (!value || isNaN(value)) return "$0";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="card">
      {}
      <div className="card__image">
        <img
          src={image || "https://via.placeholder.com/400x250?text=Sin+Imagen"}
          alt={title}
          className="card__img"
        />
        {tag && <span className="card__tag">{tag}</span>}
      </div>

      {}
      <div className="card__content">
        <div className="card__header">
          <h3 className="card__price">{formatPrice(price)}</h3>
          {expenses && <p className="card__expenses">{formatPrice(expenses)} Expensas</p>}
          <h4 className="card__title">{title}</h4>
          <p className="card__location">{location}</p>
        </div>

        <p className="card__description">{description?.slice(0, 120)}...</p>

        {}
        <div className="card__actions">
          <Link to={`/properties/${id}`} className="btn btn--primary">
            Ver detalles
          </Link>
          <button className="btn btn--whatsapp">WhatsApp</button>
          <button className="btn btn--secondary">Contactar</button>
        </div>
      </div>
    </div>
  );
}
