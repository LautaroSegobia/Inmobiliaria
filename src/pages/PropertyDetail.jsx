
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faArrowLeft, faXmark } from "@fortawesome/free-solid-svg-icons";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const FALLBACK_IMAGE = "https://placehold.co/600x400?text=Imagen+no+disponible";

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`https://68cca15b716562cf5077f884.mockapi.io/properties/${id}`);
        if (!res.ok) throw new Error("No se encontró la propiedad");
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        console.error("Error al cargar la propiedad:", err);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  useEffect(() => {
    if (selectedImage) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [selectedImage]);

  const handleWhatsApp = () => {
    if (!property) return;
    const mensaje = `¡Hola! Estoy interesado en la propiedad "${property.titulo}" ubicada en ${property.ubicacion}. ¿Podrías darme más información?`;
    window.open(`https://wa.me/5491134567890?text=${encodeURIComponent(mensaje)}`, "_blank");
  };

  const handleEmail = () => {
    if (!property) return;
    const subject = `Consulta sobre propiedad "${property.titulo}"`;
    const body = `Hola, estoy interesado en la propiedad ubicada en ${property.ubicacion}. ¿Podrías brindarme más información?`;
    window.location.href = `mailto:info@medinaabella.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const toggleZoom = () => {
    setZoom((prev) => (prev === 1 ? 1.8 : 1));
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoom === 1) return;
    setDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  if (loading) return <div className="loading">Cargando...</div>;
  if (!property) return <div className="error">Propiedad no encontrada</div>;

  return (
    <section className="property-detail container">
      {/* GALERÍA */}
      <div className="property-detail__gallery">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={10}
          slidesPerView={1}
          className="property-swiper"
        >
          {(property.imagenes?.length ? property.imagenes : [property.imagen || FALLBACK_IMAGE]).map(
            (img, i) => (
              <SwiperSlide key={i}>
                <div className="swiper-zoom-container">
                  <img
                    src={img}
                    alt={property.titulo}
                    onClick={() => setSelectedImage(img)}
                    onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                  />
                </div>
              </SwiperSlide>
            )
          )}
        </Swiper>
      </div>

      {/* CONTENIDO */}
      <div className="property-detail__content">
        <h1>{property.titulo}</h1>
        <p className="property-detail__location">{property.direccion || property.ubicacion}</p>
        <p className="property-detail__price">
          {property.moneda} {Number(property.precio).toLocaleString("es-AR")}
        </p>

        <p className="property-detail__description">
          {property.descripcionLarga || property.descripcionCorta}
        </p>

        <ul className="property-detail__features">
          <li><strong>Tipo:</strong> {property.tipo}</li>
          <li><strong>Operación:</strong> {property.operacion}</li>
          <li><strong>Ambientes:</strong> {property.ambientes}</li>
          <li><strong>Dormitorios:</strong> {property.dormitorios}</li>
          <li><strong>Baños:</strong> {property.banios}</li>
          <li><strong>Cochera:</strong> {property.cochera ? "Sí" : "No"}</li>
          <li><strong>Antigüedad:</strong> {property.antiguedad} años</li>
          <li><strong>Superficie:</strong> {property.areaTotal} m²</li>
        </ul>

        <div className="property-detail__buttons">
          <button className="btn" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} /> Volver
          </button>

          <button className="btn-whatsapp" onClick={handleWhatsApp}>
            <FontAwesomeIcon icon={faWhatsapp} /> WhatsApp
          </button>

          <button className="btn" onClick={handleEmail}>
            <FontAwesomeIcon icon={faEnvelope} /> Mail
          </button>
        </div>

        <div className="property-detail__map">
          <h3>{property.direccion || property.ubicacion}</h3>
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(property.ubicacion)}&output=embed`}
            allowFullScreen
            loading="lazy"
            title="mapa"
          />
        </div>
      </div>

      {/* MODAL DE IMAGEN */}
      {selectedImage && (
        <div
          className="image-modal"
          onClick={() => {
            setSelectedImage(null);
            setZoom(1);
            setPosition({ x: 0, y: 0 });
          }}
        >
          <div className="image-modal__content" onClick={(e) => e.stopPropagation()}>
            <button
              className="image-modal__close"
              onClick={() => {
                setSelectedImage(null);
                setZoom(1);
                setPosition({ x: 0, y: 0 });
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <img
              src={selectedImage}
              alt="Vista ampliada"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                cursor: zoom > 1 ? "grab" : "zoom-in",
              }}
              onClick={toggleZoom}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>
        </div>
      )}
    </section>
  );
}
