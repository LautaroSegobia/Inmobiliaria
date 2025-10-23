
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faXmark, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const FALLBACK_IMAGE = "https://placehold.co/1200x800?text=Imagen+no+disponible";
const WHATSAPP_PHONE = "5491134567890";
const MOCKAPI_BASE = "https://68cca15b716562cf5077f884.mockapi.io/properties";

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const startRef = useRef({ x: 0, y: 0 });
  const originRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const lastTouchDistanceRef = useRef(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`${MOCKAPI_BASE}/${id}`);
        setProperty(res.data);
        const imgs =
          res.data.imagenes && res.data.imagenes.length
            ? res.data.imagenes
            : [res.data.imagen || FALLBACK_IMAGE];
        setSelectedImage(imgs[0]);
      } catch (err) {
        console.error("Error al cargar propiedad:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleWhatsApp = () => {
    if (!property) return;
    const direccion = `${property.calle || ""} ${property.numero || ""}, ${property.zona || ""}`.trim();
    const mensaje = `Hola! Estoy interesado en la propiedad "${property.titulo}" ubicada en ${direccion}.`;
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(mensaje)}`, "_blank");
  };

  const handleEmail = () => {
    if (!property) return;
    const direccion = `${property.calle || ""} ${property.numero || ""}, ${property.zona || ""}`.trim();
    const subject = `Consulta sobre ${property.titulo}`;
    const body = `Hola,%0A%0AEstoy interesado en la propiedad "${property.titulo}" ubicada en ${direccion}.%0A%0AGracias.`;
    window.location.href = `mailto:info@medinaabella.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  const openModal = (img) => {
    setSelectedImage(img);
    setModalOpen(true);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const closeModal = () => {
    setModalOpen(false);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setZoom((prev) => Math.min(Math.max(prev + e.deltaY * -0.0015, 1), 4));
  };

  const handleMouseDown = (e) => {
    if (zoom === 1) return;
    draggingRef.current = true;
    startRef.current = { x: e.clientX, y: e.clientY };
    originRef.current = { ...position };
  };

  const handleMouseMove = (e) => {
    if (!draggingRef.current || zoom === 1) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    setPosition({
      x: originRef.current.x + dx,
      y: originRef.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    draggingRef.current = false;
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      lastTouchDistanceRef.current = getTouchDistance(e.touches);
    } else if (e.touches.length === 1 && zoom > 1) {
      draggingRef.current = true;
      startRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      originRef.current = { ...position };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const newDistance = getTouchDistance(e.touches);
      if (lastTouchDistanceRef.current) {
        const delta = newDistance - lastTouchDistanceRef.current;
        setZoom((prev) => Math.min(Math.max(prev + delta * 0.005, 1), 4));
      }
      lastTouchDistanceRef.current = newDistance;
    } else if (e.touches.length === 1 && draggingRef.current && zoom > 1) {
      const dx = e.touches[0].clientX - startRef.current.x;
      const dy = e.touches[0].clientY - startRef.current.y;
      setPosition({
        x: originRef.current.x + dx,
        y: originRef.current.y + dy,
      });
    }
  };

  const handleTouchEnd = () => {
    draggingRef.current = false;
    lastTouchDistanceRef.current = null;
  };

  const handleImageClick = () => {
    setZoom((z) => (z === 1 ? 2 : 1));
    setPosition({ x: 0, y: 0 });
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error || !property) return <div className="error">Propiedad no encontrada</div>;

  const images =
    property.imagenes && property.imagenes.length
      ? property.imagenes
      : [property.imagen || FALLBACK_IMAGE];

  const direccionCompleta = `${property.calle || ""} ${property.numero || ""}, ${property.zona || ""}`.trim();

  return (
    <main className="property-detail container">
      <div className="property-detail__grid">
        <div className="property-detail__left">
          <section className="property-detail__gallery">
            <div className="gallery-main" onClick={() => openModal(selectedImage)}>
              <img
                src={selectedImage || FALLBACK_IMAGE}
                alt={property.titulo}
                onError={(e) => (e.target.src = FALLBACK_IMAGE)}
              />
            </div>

            <div className="gallery-thumbs">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumb ${selectedImage === img ? "active" : ""}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img || FALLBACK_IMAGE}
                    alt={`thumb-${idx}`}
                    onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                  />
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="property-detail__content">
          <h1>{property.titulo}</h1>
          <p className="location">{direccionCompleta}</p>
          <p className="price">
            {property.moneda ? property.moneda + " " : ""}
            {Number(property.precio || 0).toLocaleString("es-AR")}
          </p>

          {Number(property.expensas) > 0 && (
            <p className="expenses">
              Expensas: {property.monedaExpensas || "ARS"}{" "}
              {Number(property.expensas).toLocaleString("es-AR")}
            </p>
          )}

          <div className="actions">
            <button className="btn btn--whatsapp" onClick={handleWhatsApp}>
              <FontAwesomeIcon icon={faWhatsapp} /> WhatsApp
            </button>
            <button className="btn btn--mail" onClick={handleEmail}>
              <FontAwesomeIcon icon={faEnvelope} /> Mail
            </button>
          </div>

          <ul className="features">
            <li><strong>Tipo:</strong> {property.tipo}</li>
            <li><strong>Operación:</strong> {property.operacion}</li>
            <li><strong>Ambientes:</strong> {property.ambientes}</li>
            <li><strong>Dormitorios:</strong> {property.dormitorios}</li>
            <li><strong>Baños:</strong> {property.banios}</li>
            <li><strong>Metros cubiertos:</strong> {property.metrosCubiertos ?? "—"} m²</li>
            <li><strong>Metros descubiertos:</strong> {property.metrosDescubiertos ?? "—"} m²</li>
            <li><strong>Metros totales:</strong> {property.metrosTotales ?? "—"} m²</li>
            <li><strong>Piso:</strong> {property.piso ?? "—"}</li>
            <li><strong>Cocheras:</strong> {property.cochera ? "Sí" : "No"}</li>
            <li><strong>Balcón:</strong> {property.balcon ? "Sí" : "No"}</li>
            <li><strong>Antigüedad:</strong> {property.antiguedad ?? "—"} años</li>
            <li><strong>Luminosidad:</strong> {property.luminosidad ?? "—"}</li>
            <li><strong>Orientación:</strong> {property.orientacion ?? "—"}</li>
            <li><strong>Zona:</strong> {property.zona ?? "—"}</li>
          </ul>

          <div className="property-detail__map">
            <h4>Ubicación</h4>
            <p className="direccion">{direccionCompleta}</p>
            <iframe
              title="mapa"
              src={`https://www.google.com/maps?q=${encodeURIComponent(direccionCompleta)}&output=embed`}
              loading="lazy"
            />
          </div>
        </aside>
      </div>

      <section className="property-detail__description">
        <h3>Descripción</h3>
        <p>{property.descripcionLarga || property.descripcionCorta || "Sin descripción disponible."}</p>
      </section>

      {modalOpen && (
        <div className="image-modal" onClick={closeModal}>
          <div
            className="image-modal__content"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <button className="image-modal__close" onClick={closeModal}>
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <img
              src={selectedImage || FALLBACK_IMAGE}
              alt="Vista ampliada"
              draggable={false}
              onClick={handleImageClick}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              }}
            />

            {images.length > 1 && (
              <>
                <button
                  className="image-modal__nav prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    const i = images.indexOf(selectedImage);
                    const prev = i <= 0 ? images.length - 1 : i - 1;
                    setSelectedImage(images[prev]);
                  }}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button
                  className="image-modal__nav next"
                  onClick={(e) => {
                    e.stopPropagation();
                    const i = images.indexOf(selectedImage);
                    const next = (i + 1) % images.length;
                    setSelectedImage(images[next]);
                  }}
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
