import { useState } from "react";
import { ArrowUpRight, BedDouble, MapPin, Ruler } from "lucide-react";
import { Link } from "react-router-dom";
import type { PropertyRecord } from "@/data/properties";
import { formatPrice, getMediaAvailabilityMessage, getPrimaryPricingSource, getPublishableMedia } from "@/data/properties";

type Props = { property: PropertyRecord };

const PropertyCard = ({ property }: Props) => {
  const [imageFailed, setImageFailed] = useState(false);
  const image = getPublishableMedia(property).find((item) => item.type === "image");
  const pricingSource = getPrimaryPricingSource(property);

  return (
    <article className="property-card">
      <Link to={`/properties/${property.slug}`} className="property-image" aria-label={`View ${property.name}`}>
        {image && !imageFailed ? (
          <img src={image.url} alt={image.alt || `${property.name} property photograph`} loading="lazy" onError={() => setImageFailed(true)} />
        ) : (
          <div className="property-image-placeholder" aria-label={getMediaAvailabilityMessage(property)}>
            <span className="placeholder-monogram">A</span>
            <span>{getMediaAvailabilityMessage(property)}</span>
          </div>
        )}
        <span className={`status-pill ${property.status}`}>{property.status === "verified" ? "Verified details" : "Details to verify"}</span>
        {image?.illustrative && <span className="demo-image-pill">Demo image</span>}
        <span className="image-link-icon"><ArrowUpRight size={18} /></span>
      </Link>
      <div className="property-card-body">
        <div className="property-card-kicker"><MapPin size={13} /> {property.location.community}, Dubai</div>
        <h3><Link to={`/properties/${property.slug}`}>{property.name}</Link></h3>
        <p className="property-price">{formatPrice(property)}</p>
        {pricingSource && <small className="property-price-note">{pricingSource.type === "available-units" ? "Available-unit range" : "Published project range"} · checked {pricingSource.checkedAt}</small>}
        <div className="property-meta">
          <span><BedDouble size={15} /> {property.bedrooms.min == null ? "Details pending" : `${property.bedrooms.min}${property.bedrooms.max != null && property.bedrooms.max !== property.bedrooms.min ? `–${property.bedrooms.max}` : "+"} beds`}</span>
          <span><Ruler size={15} /> {property.area.min == null ? "Area pending" : `${property.area.min}${property.area.max != null && property.area.max !== property.area.min ? `–${property.area.max}` : ""} ${property.area.unit ?? ""}`}</span>
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;
