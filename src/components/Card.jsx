
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faInfoCircle,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const FALLBACK_IMAGE = "https://placehold.co/400x250?text=Sin+Imagen";

export default function Card({
  id,
  title,
  calle,
  numero,
  zona,
  price,
  expenses,
  currency,
  image,
  images,
  description,
  tag,
  autoplay = true,
  autoplayInterval = 3000,
}) {
  // Combinar dirección
  const location = [calle, numero, zona].filter(Boolean).join(" ");

  // Normalizar array de imágenes
  const allImages = Array.isArray(images)
    ? images
    : Array.isArray(image)
    ? image
    : [image || FALLBACK_IMAGE];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const autoplayRef = useRef(null);

  // touch swipe
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const minSwipeDistance = 40;

  const formatPrice = (value, currency) => {
    if (!value || isNaN(value)) return "$0";
    const validCurrency = ["ARS", "USD"].includes(currency) ? currency : "ARS";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: validCurrency,
      minimumFractionDigits: 0,
    }).format(value);
  };

  const nextImage = () =>
    setCurrentIndex((prev) => (prev + 1) % allImages.length);

  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));

  // autoplay
  useEffect(() => {
    if (!autoplay) return;
    if (allImages.length <= 1) return;

    if (!isHovering) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % allImages.length);
      }, autoplayInterval);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [isHovering, allImages.length, autoplay, autoplayInterval]);

  // limpiar interval si cambian imágenes
  useEffect(() => {
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, []);

  // touch handlers
  const onTouchStart = (e) => {
    touchEndX.current = null;
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // swipe left
        nextImage();
      } else {
        // swipe right
        prevImage();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const imageUrl = allImages[currentIndex] || FALLBACK_IMAGE;

  return (
    <div
      className="card"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Imagen + slider */}
      <div
        className="card__image"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={imageUrl}
          alt={title || "Propiedad"}
          onError={(e) => (e.target.src = FALLBACK_IMAGE)}
        />

        {/* Controles solo si hay >1 imagen */}
        {allImages.length > 1 && (
          <div className="card__image-controls">
            <button
              className="card__nav-btn prev"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Imagen anterior"
              type="button"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <button
              className="card__nav-btn next"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Imagen siguiente"
              type="button"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        )}

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
        </div>

        <div className="card__body">
          <h4 className="card__title">{title}</h4>
          <p className="card__location">
            {location || "Dirección no especificada"}
          </p>
          <p className="card__description">
            {description ? description.slice(0, 120) + "..." : "Sin descripción"}
          </p>
        </div>

        <div className="card__actions">
          <Link to={`/properties/${id}`} className="btn btn-primary">
            <FontAwesomeIcon icon={faInfoCircle} /> Ver detalles
          </Link>

          <button className="btn btn-whatsapp" type="button">
            <FontAwesomeIcon icon={faWhatsapp} /> WhatsApp
          </button>

          <button className="btn btn-secondary" type="button">
            <FontAwesomeIcon icon={faEnvelope} /> Contactar
          </button>
        </div>
      </div>
    </div>
  );
}
