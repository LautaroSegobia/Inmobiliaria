
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // Número de la inmobiliaria
  const whatsappNumber = "00000000";

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

  // Mensaje pre-armado WhatsApp
  const whatsappMessage = `Hola, estoy interesado en la propiedad: ${property.title} en ${property.location} (ID: ${property.id}). ¿Podrían darme más información?`;

  return (
    <div className="property-detail">
      <div className="property-detail__image">
        <img src={property.image} alt={property.title} />
      </div>

      <div className="property-detail__content">
        <h1 className="property-detail__title">{property.title}</h1>
        <p className="property-detail__location">{property.location}</p>
        <p className="property-detail__price">${property.price}</p>

        <p className="property-detail__description">{property.description}</p>

        <ul className="property-detail__features">
          {property.rooms && <li><strong>Ambientes:</strong> {property.rooms}</li>}
          {property.bedrooms && <li><strong>Dormitorios:</strong> {property.bedrooms}</li>}
          {property.bathrooms && <li><strong>Baños:</strong> {property.bathrooms}</li>}
          {property.area && <li><strong>Área:</strong> {property.area} m²</li>}
          <li><strong>Estado:</strong> {property.available ? "Disponible ✅" : "No disponible ❌"}</li>
        </ul>

        <div className="property-detail__actions">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              whatsappMessage
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            WhatsApp
          </a>

          <button className="btn btn-primary">Contactar</button>

          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
