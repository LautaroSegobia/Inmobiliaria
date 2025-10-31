
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// brand
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
// solid
import {
  faEnvelope,
  faXmark,
  faChevronLeft,
  faChevronRight,
  faHome,
  faTag,
  faRulerCombined,
  faBed,
  faBath,
  faCar,
  faBuilding,
  faCalendarAlt,
  faSun,
  faCompass,
  faMapMarkerAlt,
  faImages,
} from "@fortawesome/free-solid-svg-icons";

const FALLBACK_IMAGE = "https://placehold.co/1200x800?text=Imagen+no+disponible";
const WHATSAPP_PHONE = "5491134567890";
const MOCKAPI_BASE = "https://68cca15b716562cf5077f884.mockapi.io/properties";

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [thumbIndex, setThumbIndex] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const draggingRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });
  const originRef = useRef({ x: 0, y: 0 });
  const lastTouchDistanceRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${MOCKAPI_BASE}/${id}`);
        if (!mounted) return;
        const p = res.data || {};
        setProperty(p);

        const imgs =
          Array.isArray(p.imagenes) && p.imagenes.length
            ? p.imagenes
            : p.imagen
            ? [p.imagen]
            : [FALLBACK_IMAGE];

        setImages(imgs);
        setSelectedImage((prev) => prev || imgs[0]);
        setThumbIndex(0);
      } catch (err) {
        console.error("Error al cargar propiedad:", err);
        setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProperty();
    return () => {
      mounted = false;
    };
  }, [id]);

  const direccionCompleta = (p = property) =>
    `${p?.calle ?? ""} ${p?.numero ?? ""}${p?.zona ? `, ${p.zona}` : ""}`.trim();

  const formatPrice = (val, currency) => {
    const n = Number(val || 0);
    const curr = currency || "ARS";
    try {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: ["ARS", "USD"].includes(curr) ? curr : "ARS",
        minimumFractionDigits: 0,
      }).format(n);
    } catch {
      return `${curr} ${n.toLocaleString("es-AR")}`;
    }
  };

  const handleWhatsApp = () => {
    if (!property) return;
    const msg = `Hola! Estoy interesado en la propiedad "${property.titulo}" ubicada en ${direccionCompleta(
      property
    )}.`;
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleEmail = () => {
    if (!property) return;
    const subject = `Consulta sobre ${property.titulo}`;
    const body = `Hola,%0A%0AEstoy interesado en la propiedad "${property.titulo}" ubicada en ${direccionCompleta(
      property
    )}.%0A%0AGracias.`;
    window.location.href = `mailto:info@medinaabella.com?subject=${encodeURIComponent(
      subject
    )}&body=${body}`;
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
    draggingRef.current = false;
    lastTouchDistanceRef.current = null;
  };

  const goPrev = useCallback(() => {
    if (!images.length) return;
    const i = images.indexOf(selectedImage);
    const prev = i <= 0 ? images.length - 1 : i - 1;
    setSelectedImage(images[prev]);
    setThumbIndex(prev);
  }, [images, selectedImage]);

  const goNext = useCallback(() => {
    if (!images.length) return;
    const i = images.indexOf(selectedImage);
    const next = (i + 1) % images.length;
    setSelectedImage(images[next]);
    setThumbIndex(next);
  }, [images, selectedImage]);

  const handleWheel = (e) => {
    e.preventDefault();
    setZoom((prev) => Math.min(Math.max(prev + e.deltaY * -0.0015, 1), 4));
  };

  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    draggingRef.current = true;
    startRef.current = { x: e.clientX, y: e.clientY };
    originRef.current = { ...position };
  };
  const handleMouseMove = (e) => {
    if (!draggingRef.current || zoom <= 1) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    setPosition({ x: originRef.current.x + dx, y: originRef.current.y + dy });
  };
  const handleMouseUp = () => {
    draggingRef.current = false;
  };

  function getTouchDistance(touches) {
    if (!touches || touches.length < 2) return 0;
    const [a, b] = touches;
    return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
  }

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
      setPosition({ x: originRef.current.x + dx, y: originRef.current.y + dy });
    }
  };
  const handleTouchEnd = () => {
    draggingRef.current = false;
    lastTouchDistanceRef.current = null;
  };

  useEffect(() => {
    const onKey = (e) => {
      if (!modalOpen) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, goPrev, goNext]);

  if (loading) return <div className="loading">Cargando...</div>;
  if (error || !property) return <div className="error">Propiedad no encontrada</div>;

  return (
    <main className="property-detail container">
      <div className="property-detail__grid">
        <div className="property-detail__left">
          <section className="property-detail__gallery">
            <div
              className="gallery-main"
              onClick={() => openModal(selectedImage)}
              role="button"
              aria-label="Abrir imagen en modal"
            >
              <img
                src={selectedImage || FALLBACK_IMAGE}
                alt={property.titulo}
                onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                className="gallery-main__img"
              />
            </div>

            <div className="gallery-thumbs" aria-hidden={modalOpen}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumb ${selectedImage === img ? "active" : ""}`}
                  onClick={() => {
                    setSelectedImage(img);
                    setThumbIndex(idx);
                  }}
                  aria-label={`Seleccionar imagen ${idx + 1}`}
                >
                  <img
                    src={img || FALLBACK_IMAGE}
                    alt={`thumb-${idx}`}
                    onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                    className="thumb__img"
                  />
                </button>
              ))}
            </div>
          </section>

          <section className="property-detail__description">
            <h3>Descripción</h3>
            <p>{property.descripcionLarga || property.descripcionCorta || "Sin descripción disponible."}</p>
          </section>
        </div>

        <aside className="property-detail__right">
          <section className="property-detail__info">
            <h1 className="info__title">{property.titulo}</h1>
            <p className="info__address">
              <FontAwesomeIcon icon={faMapMarkerAlt} /> <span>{direccionCompleta()}</span>
            </p>
            <p className="info__price">{formatPrice(property.precio, property.moneda)}</p>

            {Number(property.expensas) > 0 && (
              <p className="info__expenses">
                Expensas: {property.monedaExpensas || "ARS"} {Number(property.expensas).toLocaleString("es-AR")}
              </p>
            )}

            <div className="info__actions">
              <button className="btn btn--whatsapp" onClick={handleWhatsApp}>
                <FontAwesomeIcon icon={faWhatsapp} /> <span>WhatsApp</span>
              </button>
              <button className="btn btn--mail" onClick={handleEmail}>
                <FontAwesomeIcon icon={faEnvelope} /> <span>Mail</span>
              </button>
            </div>

            <ul className="info__features">
              <li><FontAwesomeIcon icon={faTag} /> <span>{property.operacion ?? "—"}</span></li>
              <li><FontAwesomeIcon icon={faHome} /> <span>{property.tipo ?? "—"}</span></li>
              <li><FontAwesomeIcon icon={faBed} /> <span>{property.dormitorios ?? 0} dormitorios</span></li>
              <li><FontAwesomeIcon icon={faBath} /> <span>{property.banios ?? 0} baños</span></li>
              <li><FontAwesomeIcon icon={faRulerCombined} /> <span>{property.metrosCubiertos ?? "—"} m² cub.</span></li>
              <li><FontAwesomeIcon icon={faImages} /> <span>{property.metrosDescubiertos ?? "—"} m² desc.</span></li>
              <li><FontAwesomeIcon icon={faRulerCombined} /> <span>{property.metrosTotales ?? "—"} m² tot.</span></li>
              <li><FontAwesomeIcon icon={faBuilding} /> <span>Piso {property.piso ?? "—"}</span></li>
              <li><FontAwesomeIcon icon={faCar} /> <span>{property.cochera ? "Con cochera" : "Sin cochera"}</span></li>
              <li><FontAwesomeIcon icon={faHome} /> <span>{property.balcon ? "Con balcón" : "Sin balcón"}</span></li>
              <li><FontAwesomeIcon icon={faCalendarAlt} /> <span>{property.antiguedad ?? "—"} años</span></li>
              <li><FontAwesomeIcon icon={faSun} /> <span>Luminosidad: {property.luminosidad ?? "—"}</span></li>
              <li><FontAwesomeIcon icon={faCompass} /> <span>Orientación: {property.orientacion ?? "—"}</span></li>
              <li><FontAwesomeIcon icon={faMapMarkerAlt} /> <span>Zona: {property.zona ?? "—"}</span></li>
            </ul>
          </section>

          <section className="property-detail__map">
            <h4>Ubicación</h4>
            <p className="map__address">{direccionCompleta()}</p>
            <iframe
              title="mapa"
              className="map__iframe"
              src={`https://www.google.com/maps?q=${encodeURIComponent(direccionCompleta())}&output=embed`}
              loading="lazy"
            />
          </section>
        </aside>
      </div>

      {modalOpen && (
        <div className="image-modal" onClick={closeModal} role="dialog" aria-modal="true">
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
            <button className="image-modal__close" onClick={closeModal} aria-label="Cerrar">
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <img
              src={selectedImage || FALLBACK_IMAGE}
              alt="Vista ampliada"
              draggable={false}
              className="image-modal__img"
              onClick={() => setZoom((z) => (z === 1 ? 2 : 1))}
              style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})` }}
            />

            {images.length > 1 && (
              <>
                <button className="image-modal__nav image-modal__nav--prev" aria-label="Anterior" onClick={(e) => { e.stopPropagation(); goPrev(); }}>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button className="image-modal__nav image-modal__nav--next" aria-label="Siguiente" onClick={(e) => { e.stopPropagation(); goNext(); }}>
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
