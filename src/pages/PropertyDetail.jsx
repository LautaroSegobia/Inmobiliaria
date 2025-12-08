
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faXmark,
  faChevronLeft,
  faChevronRight,
  faHome,
  faTag,
  faBed,
  faBath,
  faCar,
  faCalendarAlt,
  faCompass,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

const FALLBACK_IMAGE = "https://placehold.co/1200x800?text=Imagen+no+disponible";
const WHATSAPP_PHONE = "5491134567890";

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(FALLBACK_IMAGE);
  const [modalOpen, setModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const draggingRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });
  const originRef = useRef({ x: 0, y: 0 });
  const lastTouchDistanceRef = useRef(null);

  // URL CORREGIDA: local → local, producción → producción
  const API_BASE = import.meta.env.VITE_API_URL;

  // --- CARGA DE DATOS ---
  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/properties/${id}`);

        if (!mounted) return;

        const p = res.data;
        if (!p || Object.keys(p).length === 0) throw new Error("Propiedad no encontrada");

        setProperty(p);

        // NORMALIZACIÓN FORTALECIDA DE IMÁGENES (no rompe más)
  
        let imgs = [];

        // 1) multimedia (correcto nuevo backend)
        if (Array.isArray(p.multimedia) && p.multimedia.length > 0) {
          imgs = p.multimedia.map((img) =>
            typeof img === "string" ? img : img?.url || FALLBACK_IMAGE
          );
        }
        // 2) imagenes (backend viejo)
        else if (Array.isArray(p.imagenes) && p.imagenes.length > 0) {
          imgs = p.imagenes.map((img) =>
            typeof img === "string" ? img : img?.url || FALLBACK_IMAGE
          );
        }
        // 3) mainImage → puede ser {url} o string
        else if (p.mainImage) {
          imgs = [
            typeof p.mainImage === "string"
              ? p.mainImage
              : p.mainImage?.url || FALLBACK_IMAGE,
          ];
        }
        // 4) formato muy viejo
        else if (p.imagen) {
          imgs = [p.imagen];
        }
        // 5) fallback absoluto
        else {
          imgs = [FALLBACK_IMAGE];
        }

        setImages(imgs);
        setSelectedImage(imgs[0]);

      } catch (err) {
        console.error("Error al cargar propiedad:", err);
        setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProperty();
    return () => (mounted = false);
  }, [id, API_BASE]);

  // --- HELPERS ---
  const direccionCompleta = (p = property) => {
    const calle = p?.calle || "";
    const numero = p?.numero || "";
    const zona = p?.zona || "";
    return [calle, numero, zona].filter(Boolean).join(" ");
  };

  const formatPrice = (val) => {
    if (!val) return "";

    const valor = typeof val === "object" ? val.valor : Number(val) || 0;
    const moneda =
      typeof val === "object" ? val.moneda || "ARS" : "ARS";

    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: ["ARS", "USD"].includes(moneda) ? moneda : "ARS",
      minimumFractionDigits: 0,
    }).format(valor);
  };

  // --- MODAL ---
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

  // --- NAVEGACIÓN DE IMÁGENES ---
  const goPrev = useCallback(() => {
    const i = images.indexOf(selectedImage);
    const prev = i <= 0 ? images.length - 1 : i - 1;
    setSelectedImage(images[prev]);
  }, [images, selectedImage]);

  const goNext = useCallback(() => {
    const i = images.indexOf(selectedImage);
    const next = (i + 1) % images.length;
    setSelectedImage(images[next]);
  }, [images, selectedImage]);

  // --- ZOOM Y DRAG ---
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

  // --- TOUCH EVENTS PARA MOBILE ---

const handleTouchStart = (e) => {
  if (e.touches.length === 1) {
    // Drag
    draggingRef.current = true;
    startRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    originRef.current = { ...position };
  } else if (e.touches.length === 2) {
    // Pinch zoom
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    lastTouchDistanceRef.current = Math.hypot(
      touch1.clientX - touch2.clientX,
      touch1.clientY - touch2.clientY
    );
  }
};

const handleTouchMove = (e) => {
  if (e.touches.length === 1 && draggingRef.current && zoom > 1) {
    // Drag image
    const dx = e.touches[0].clientX - startRef.current.x;
    const dy = e.touches[0].clientY - startRef.current.y;
    setPosition({
      x: originRef.current.x + dx,
      y: originRef.current.y + dy,
    });
  }

  if (e.touches.length === 2) {
    // Pinch zoom
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const newDistance = Math.hypot(
      touch1.clientX - touch2.clientX,
      touch1.clientY - touch2.clientY
    );

    if (lastTouchDistanceRef.current) {
      const diff = newDistance - lastTouchDistanceRef.current;
      setZoom((prev) => {
        let next = prev + diff * 0.01;
        return Math.min(Math.max(next, 1), 4);
      });
    }

    lastTouchDistanceRef.current = newDistance;
  }
};

const handleTouchEnd = () => {
  draggingRef.current = false;
  lastTouchDistanceRef.current = null;
};

  // --- CONTACTO ---
  const handleWhatsApp = () => {
    if (!property) return;
    const msg = `Hola! Estoy interesado en la propiedad "${property.titulo}" ubicada en ${direccionCompleta(property)}.`;
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleEmail = () => {
    if (!property) return;
    const subject = `Consulta sobre ${property.titulo}`;
    const body = `Hola,%0A%0AEstoy interesado en la propiedad "${property.titulo}" ubicada en ${direccionCompleta(property)}.%0A%0AGracias.`;
    window.location.href = `mailto:info@medinaabella.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  // --- RENDER ---
  if (loading) return <div className="loading">Cargando propiedad...</div>;
  if (error || !property)
    return (
      <div className="error">
        No se encontró la propiedad o ocurrió un error.{" "}
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );

  return (
    <main className="property-detail container">
      <div className="property-detail__grid">
        {/* IZQUIERDA */}
        <div className="property-detail__left">
          <section className="property-detail__gallery">
            <div
              className="gallery-main"
              onClick={() => openModal(selectedImage)}
              role="button"
            >
              <img
                src={selectedImage}
                alt={property.titulo}
                onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                className="gallery-main__img"
              />
            </div>

            <div className="gallery-thumbs" aria-hidden={modalOpen}>
              {images.map((img, idx) => (
                <button
                  key={`${idx}-${img}`}
                  className={`thumb ${selectedImage === img ? "active" : ""}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img}
                    alt={`thumb-${idx}`}
                    onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                  />
                </button>
              ))}
            </div>
          </section>

          <section className="property-detail__description">
            <h3>Descripción</h3>
            <p>
              {property.descripcionLarga ||
                property.descripcionCorta ||
                "Sin descripción disponible."}
            </p>
          </section>
        </div>

        {/* DERECHA */}
        <aside className="property-detail__right">
          <section className="property-detail__info">
            <h1>{property.titulo}</h1>
            <p>
              <FontAwesomeIcon icon={faMapMarkerAlt} /> {direccionCompleta()}
            </p>

            <p className="price">
              {formatPrice(property.precio)}
            </p>

            {property.expensas && (
              <p className="expenses">
                Expensas: {formatPrice(property.expensas)}
              </p>
            )}

            <div className="actions">
              <button onClick={handleWhatsApp} className="btn btn--whatsapp">
                <FontAwesomeIcon icon={faWhatsapp} /> WhatsApp
              </button>
              <button onClick={handleEmail} className="btn btn--mail">
                <FontAwesomeIcon icon={faEnvelope} /> Mail
              </button>
            </div>

            <ul className="features">
              <li>
                <FontAwesomeIcon icon={faTag} /> {property.operacion ?? "—"}
              </li>
              <li>
                <FontAwesomeIcon icon={faHome} /> {property.tipo ?? "—"}
              </li>
              <li>
                <FontAwesomeIcon icon={faBed} /> {property.dormitorios ?? 0} dormitorios
              </li>
              <li>
                <FontAwesomeIcon icon={faBath} /> {property.banos ?? 0} baños
              </li>
              <li>
                <FontAwesomeIcon icon={faCar} />{" "}
                {property.cochera ? "Con cochera" : "Sin cochera"}
              </li>
              <li>
                <FontAwesomeIcon icon={faCalendarAlt} /> {property.antiguedad ?? "—"} años
              </li>
              <li>
                <FontAwesomeIcon icon={faCompass} /> Orientación:{" "}
                {property.orientacion ?? "—"}
              </li>
            </ul>
          </section>

          <section className="property-detail__map">
            <h4>Ubicación</h4>
            <iframe
              title="mapa"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                direccionCompleta()
              )}&output=embed`}
              className="map__iframe"
              loading="lazy"
            />
          </section>
        </aside>
      </div>

      {/* MODAL DE IMAGEN */}
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
            <button className="close-btn" onClick={closeModal}>
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <img
              src={selectedImage}
              alt="Vista ampliada"
              draggable={false}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              }}
            />

            {images.length > 1 && (
              <>
                <button
                  className="nav prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button
                  className="nav next"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
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
