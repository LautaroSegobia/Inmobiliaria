
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faXmark } from "@fortawesome/free-solid-svg-icons";

const FALLBACK_IMAGE = "https://placehold.co/1200x800?text=Imagen+no+disponible";
const WHATSAPP_PHONE = "5491134567890"; // número fijo

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const positionRef = useRef({ x: 0, y: 0 });
  const pointerStartRef = useRef(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    const fetchProperty = async () => {
      try {
        const res = await fetch(`https://68cca15b716562cf5077f884.mockapi.io/properties/${id}`);
        if (!res.ok) throw new Error("Error al cargar");
        const data = await res.json();
        if (!mounted) return;
        setProperty(data);
        const imgs = data.imagenes && data.imagenes.length ? data.imagenes : [data.imagen];
        setSelectedImage(imgs[0] || FALLBACK_IMAGE);
      } catch (err) {
        console.error(err);
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProperty();
    return () => (mounted = false);
  }, [id]);

  useEffect(() => {
    if (!modalOpen) {
      setZoom(1);
      positionRef.current = { x: 0, y: 0 };
    }
  }, [modalOpen]);

  if (loading) return <div className="loading">Cargando...</div>;
  if (error || !property) return <div className="error">Propiedad no encontrada</div>;

  const handleWhatsApp = () => {
    const mensaje = `Hola! Estoy interesado en la propiedad "${property.titulo}" ubicada en ${property.direccion || property.ubicacion}.`;
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(mensaje)}`, "_blank");
  };

  const handleEmail = () => {
    const subject = `Consulta sobre ${property.titulo}`;
    const body = `Hola,%0A%0AEstoy interesado en la propiedad "${property.titulo}" ubicada en ${property.direccion || property.ubicacion}.%0A%0AGracias.`;
    window.location.href = `mailto:info@medinaabella.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  const openModal = (img) => {
    setSelectedImage(img);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);
  const toggleZoom = () => setZoom((z) => (z === 1 ? 2 : 1));

  const onPointerDown = (e) => {
    if (zoom === 1) return;
    isDraggingRef.current = true;
    pointerStartRef.current = { x: e.clientX, y: e.clientY, originX: positionRef.current.x, originY: positionRef.current.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!isDraggingRef.current || zoom === 1) return;
    const start = pointerStartRef.current;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    positionRef.current = { x: start.originX + dx, y: start.originY + dy };
    setZoom((z) => z);
  };
  const onPointerUp = (e) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  const modalImageStyle = () => {
    const { x, y } = positionRef.current;
    return {
      transform: `translate(${x}px, ${y}px) scale(${zoom})`,
      cursor: zoom > 1 ? (isDraggingRef.current ? "grabbing" : "grab") : "zoom-in",
    };
  };

  const images = property.imagenes && property.imagenes.length ? property.imagenes : [property.imagen || FALLBACK_IMAGE];

  return (
    <main className="property-detail container">
      <section className="property-detail__gallery">
        <div className="gallery-main" onClick={() => openModal(selectedImage)}>
          <img src={selectedImage || FALLBACK_IMAGE} alt={property.titulo} onError={(e) => (e.target.src = FALLBACK_IMAGE)} />
        </div>
        <div className="gallery-thumbs">
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`thumb ${selectedImage === img ? "active" : ""}`}
              onClick={() => setSelectedImage(img)}
            >
              <img src={img || FALLBACK_IMAGE} alt={`Imagen ${idx + 1}`} onError={(e) => (e.target.src = FALLBACK_IMAGE)} />
            </button>
          ))}
        </div>
      </section>

      <aside className="property-detail__content">
        <h1>{property.titulo}</h1>
        <p className="location">{property.direccion || property.ubicacion}</p>
        <p className="price">
          {property.moneda ? property.moneda + " " : ""}{Number(property.precio || 0).toLocaleString("es-AR")}
        </p>

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
          <li><strong>Superficie:</strong> {property.areaTotal} m²</li>
        </ul>

        <div className="property-detail__map">
          <h4>Ubicación</h4>
          <p>{property.direccion || property.ubicacion}</p>
          <iframe
            title="mapa"
            src={`https://www.google.com/maps?q=${encodeURIComponent(property.direccion || property.ubicacion || "")}&output=embed`}
            loading="lazy"
          />
        </div>
      </aside>

      <section className="property-detail__description">
        <h3>Descripción</h3>
        <p>{property.descripcionLarga || property.descripcion || "Sin descripción"}</p>
      </section>

      {modalOpen && (
        <div className="image-modal" onClick={closeModal}>
          <div className="image-modal__content" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal__close" onClick={closeModal}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <div
              className="image-modal__viewport"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            >
              <img
                src={selectedImage || FALLBACK_IMAGE}
                alt="Ampliada"
                style={modalImageStyle()}
                onClick={toggleZoom}
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
