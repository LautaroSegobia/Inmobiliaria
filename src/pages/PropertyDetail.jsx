
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const FALLBACK_IMAGE = "https://placehold.co/600x400?text=Sin+Imagen";

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://68cca15b716562cf5077f884.mockapi.io/properties/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProperty(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al traer propiedad:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Cargando propiedad...</p>;
  if (!property) return <p>No se encontró la propiedad</p>;

  const handleBack = () => navigate(-1);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hola! Estoy interesado en la propiedad "${property.titulo}" ubicada en ${property.ubicacion}. ¿Podrías darme más información?`
    );
    window.open(`https://wa.me/5491134567890?text=${message}`, "_blank");
  };

  return (
    <div className="property-detail container">
      <div className="property-detail__image">
        <img
          src={property.imagen || FALLBACK_IMAGE}
          alt={property.titulo}
          onError={(e) => (e.target.src = FALLBACK_IMAGE)}
        />
      </div>

      <div className="property-detail__content">
        <h1>{property.titulo}</h1>
        <p className="property-detail__location">{property.ubicacion}</p>
        <p className="property-detail__price">
          {property.moneda} {property.precio.toLocaleString("es-AR")}
        </p>

        <p className="property-detail__description">
          {property.descripcionLarga}
        </p>

        <ul className="property-detail__features">
          <li>Tipo: {property.tipo}</li>
          <li>Operación: {property.operacion}</li>
          <li>Ambientes: {property.ambientes}</li>
          <li>Dormitorios: {property.dormitorios}</li>
          <li>Baños: {property.banios}</li>
          <li>Superficie total: {property.areaTotal} m²</li>
          <li>Antigüedad: {property.antiguedad} años</li>
          <li>Cochera: {property.cochera ? "Sí" : "No"}</li>
          <li>Balcón: {property.balcon ? "Sí" : "No"}</li>
          <li>Expensas: {property.monedaExpensas} {property.expensas}</li>
          <li>Luminosidad: {property.luminosidad}</li>
          <li>Orientación: {property.orientacion}</li>
          <li>Piso: {property.piso}</li>
        </ul>

        <div className="property-detail__buttons">
          <button className="btn btn-primary" onClick={handleBack}>
            Volver
          </button>

          <button className="btn btn-whatsapp" onClick={handleWhatsApp}>
            <FontAwesomeIcon icon={faWhatsapp} /> Consultar
          </button>
        </div>
      </div>
    </div>
  );
}
