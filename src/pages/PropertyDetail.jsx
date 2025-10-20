
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

  // Modal + Zoom
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const startRef = useRef({ x: 0, y: 0 });
  const originRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`https://68cca15b716562cf5077f884.mockapi.io/properties/${id}`);
        if (!res.ok) throw new Error("Error al cargar");
        const data = await res.json();
        setProperty(data);
        const imgs = data.imagenes && data.imagenes.length ? data.imagenes : [data.imagen];
        setSelectedImage(imgs[0] || FALLBACK_IMAGE);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

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
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setModalOpen(false);
      setIsClosing(false);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }, 250);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setZoom((prev) => {
      const newZoom = Math.min(Math.max(prev + e.deltaY * -0.0015, 1), 4);
      return newZoom;
    });
  };

  const handleMouseDown = (e) => {
    if (zoom === 1) return;
    setIsDragging(true);
    startRef.current = { x: e.clientX, y: e.clientY };
    originRef.current = { ...position };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoom === 1) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    setPosition({
      x: originRef.current.x + dx,
      y: originRef.current.y + dy,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleImageClick = () => {
    if (zoom === 1) {
      setZoom(2);
    } else {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const images = property?.imagenes?.length ? property.imagenes : [property?.imagen || FALLBACK_IMAGE];

  if (loading) return <div className="loading">Cargando...</div>;
  if (error || !property) return <div className="error">Propiedad no encontrada</div>;

  return (
    <main className="property-detail container">
      <div className="property-detail__grid">
        {/* IZQUIERDA: Galería + Descripción */}
        <div className="property-detail__left">
          {/* GALERÍA */}
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
                    alt={`Imagen ${idx + 1}`}
                    onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                  />
                </button>
              ))}
            </div>
          </section>

          {/* DESCRIPCIÓN */}
          <section className="property-detail__description">
            <h3>Descripción</h3>
            <p>{property.descripcionLarga || property.descripcion || "Sin descripción disponible."}</p>
          </section>
        </div>

        {/* DERECHA: Info + Mapa */}
        <aside className="property-detail__content">
          <h1>{property.titulo}</h1>
          <p className="location">{property.direccion || property.ubicacion}</p>
          <p className="price">
            {property.moneda ? property.moneda + " " : ""}
            {Number(property.precio || 0).toLocaleString("es-AR")}
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
              style={{
                width: "100%",
                height: "300px",
                border: "none",
                borderRadius: "12px",
              }}
            />
          </div>
        </aside>
      </div>

      {/* MODAL CON ZOOM + ARRASTRE */}
      {modalOpen && (
        <div
          className={`image-modal ${isClosing ? "closing" : ""}`}
          onClick={handleCloseModal}
        >
          <div
            className="image-modal__content"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: isDragging ? "grabbing" : zoom > 1 ? "grab" : "zoom-in" }}
          >
            <button className="image-modal__close" onClick={handleCloseModal}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <img
              src={selectedImage || FALLBACK_IMAGE}
              alt="Vista ampliada"
              draggable={false}
              onClick={handleImageClick}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transition: isDragging ? "none" : "transform 0.25s ease-out",
                maxWidth: "100%",
                maxHeight: "90vh",
                userSelect: "none",
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
}
