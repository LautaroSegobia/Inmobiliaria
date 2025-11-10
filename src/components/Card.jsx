
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
import { useAuth } from "../contexts/AuthContext"; // ✅ usamos el hook personalizado

const FALLBACK_IMAGE = "https://placehold.co/400x250?text=Sin+Imagen";
const WHATSAPP_PHONE = "5491134567890"; // ⚠️ Ajustar número

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
  onEdit, // opcional: función para editar
  onDelete, // opcional: función para eliminar
}) {
  const { user } = useAuth(); // ✅ obtenemos usuario logueado

  // Dirección combinada
  const location = [calle, numero, zona].filter(Boolean).join(" ");

  // Normalizar imágenes
  const allImages = Array.isArray(images)
    ? images
    : Array.isArray(image)
    ? image
    : [image || FALLBACK_IMAGE];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const autoplayRef = useRef(null);

  // Swipe
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const minSwipeDistance = 40;

  // Formatear precio
  const formatPrice = (value, currency) => {
    if (!value || isNaN(value)) return "$0";
    const validCurrency = ["ARS", "USD"].includes(currency) ? currency : "ARS";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: validCurrency,
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Navegación de imágenes
  const nextImage = () =>
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );

  // Autoplay
  useEffect(() => {
    if (!autoplay || allImages.length <= 1) return;
    if (!isHovering) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % allImages.length);
      }, autoplayInterval);
    }
    return () => clearInterval(autoplayRef.current);
  }, [isHovering, allImages.length, autoplay, autoplayInterval]);

  // Swipe handlers
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
      distance > 0 ? nextImage() : prevImage();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const imageUrl = allImages[currentIndex] || FALLBACK_IMAGE;

  // === Funciones de contacto ===
  const handleWhatsApp = () => {
    const msg = `Hola! Estoy interesado en la propiedad "${title}" ubicada en ${location}.`;
    window.open(
      `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const handleEmail = () => {
    const subject = `Consulta sobre ${title}`;
    const body = `Hola,%0A%0AEstoy interesado en la propiedad "${title}" ubicada en ${location}.%0A%0AGracias.`;
    window.location.href = `mailto:info@medinaabella.com?subject=${encodeURIComponent(
      subject
    )}&body=${body}`;
  };

  // Helpers seguros
  const handleEditClick = () => {
    if (typeof onEdit === "function") onEdit(id);
  };
  const handleDeleteClick = () => {
    if (typeof onDelete === "function") onDelete(id);
  };

  // Control de permisos
  const canManage =
    user && (user.role === "admin" || user.role === "developer");

  // === Render ===
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
            {description
              ? description.slice(0, 120) + "..."
              : "Sin descripción"}
          </p>
        </div>

        <div className="card__actions">
          <Link to={`/properties/${id}`} className="btn btn-primary">
            <FontAwesomeIcon icon={faInfoCircle} /> Ver detalles
          </Link>

          <button
            className="btn btn-whatsapp"
            type="button"
            onClick={handleWhatsApp}
          >
            <FontAwesomeIcon icon={faWhatsapp} /> WhatsApp
          </button>

          <button
            className="btn btn-secondary"
            type="button"
            onClick={handleEmail}
          >
            <FontAwesomeIcon icon={faEnvelope} /> Contactar
          </button>

          {/* ✅ Mostrar botones de editar/eliminar sólo para admin o developer */}
          {canManage && (
            <>
              <button
                className="btn btn-edit"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick();
                }}
              >
                Editar
              </button>

              <button
                className="btn btn-delete"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("¿Eliminar esta propiedad?")) {
                    handleDeleteClick();
                  }
                }}
              >
                Eliminar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
