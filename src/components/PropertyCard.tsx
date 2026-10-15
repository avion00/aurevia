import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, BedDouble, Bath, MapPin, Ruler } from "lucide-react";
import { Link } from "react-router-dom";
import type { PropertyRecord } from "@/data/properties";
import { formatPrice, formatPriceSource, getMediaAvailabilityMessage, getPrimaryPricingSource, getPublishableMedia } from "@/data/properties";

type Props = { property: PropertyRecord };

const displayRange = (min: number | null, max: number | null, unit = "") => {
  if (min == null) return "Not stated";
  const range = max != null && max !== min ? `${min}–${max}` : `${min}`;
  return `${range}${unit ? ` ${unit}` : ""}`;
};

const PropertyCard = ({ property }: Props) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const images = useMemo(
    () => getPublishableMedia(property).filter((media) => media.type === "image" && !failedImages.has(media.id)),
    [failedImages, property],
  );
  const image = images[imageIndex % Math.max(images.length, 1)];
  const pricingSource = getPrimaryPricingSource(property);

  useEffect(() => {
    if (imageIndex >= images.length) setImageIndex(0);
  }, [imageIndex, images.length]);

  const changeImage = (offset: number) => {
    setImageIndex((current) => (current + offset + images.length) % images.length);
  };

  return (
    <article className="property-card">
      <div className="property-image">
        {image ? (
          <img
            key={image.url}
            src={image.url}
            alt={image.alt || `${property.name} property photograph`}
            loading="lazy"
            onError={() => setFailedImages((failed) => new Set(failed).add(image.id))}
          />
        ) : (
          <div className="property-image-placeholder" aria-label={getMediaAvailabilityMessage(property)}>
            <span className="placeholder-monogram">A</span>
            <span>{property.illustrative ? "Fictional sample · no property photo" : getMediaAvailabilityMessage(property)}</span>
          </div>
        )}
        <Link to={`/properties/${property.slug}`} className="property-image-link" aria-label={`View ${property.name}`} />
        <span className={`status-pill ${property.illustrative ? "illustrative-pill" : property.status}`}>
          {property.illustrative ? "Illustrative sample · not real" : property.status === "verified" ? "Verified details" : "Details to verify"}
        </span>
        {image?.illustrative && <span className="demo-image-pill">Demo image</span>}
        {images.length > 1 && (
          <div className="property-image-controls" aria-label={`${images.length} property images`}>
            <button type="button" onClick={() => changeImage(-1)} aria-label={`Previous ${property.name} image`}><ArrowLeft size={16} /></button>
            <span>{imageIndex + 1} / {images.length}</span>
            <button type="button" onClick={() => changeImage(1)} aria-label={`Next ${property.name} image`}><ArrowRight size={16} /></button>
          </div>
        )}
        <Link to={`/properties/${property.slug}`} className="image-link-icon" aria-label={`View all details for ${property.name}`}><ArrowUpRight size={18} /></Link>
      </div>
      <div className="property-card-body">
        <div className="property-card-kicker"><MapPin size={13} /> {property.location.community}, {property.location.city}</div>
        <h2><Link to={`/properties/${property.slug}`}>{property.name}</Link></h2>
        <p className="property-price">{formatPrice(property)}</p>
        {pricingSource && <small className="property-price-note">{pricingSource.type === "available-units" ? "Available-unit range" : "Published project range"} · checked {pricingSource.checkedAt}</small>}
        <div className="property-meta">
          <span><BedDouble size={15} /> {displayRange(property.bedrooms.min, property.bedrooms.max, "beds")}</span>
          <span><Bath size={15} /> {displayRange(property.bathrooms.min, property.bathrooms.max, "baths")}</span>
          <span><Ruler size={15} /> {displayRange(property.area.min, property.area.max, property.area.unit ?? "")}</span>
        </div>
      </div>
      <div className="property-card-details">
        {property.illustrative && <p className="card-demo-warning">Fictional demonstration property. Not available to buy or rent.</p>}
        <p className="card-summary">{property.summary}</p>
        <dl className="card-facts">
          <div><dt>Property type</dt><dd>{property.propertyType ?? "Not stated"}</dd></div>
          <div><dt>Building</dt><dd>{property.buildingInfo ?? "Not stated"}</dd></div>
          <div><dt>Tenure</dt><dd>{property.tenure ?? "Not stated"}</dd></div>
          <div><dt>Completion</dt><dd>{property.completionDate ?? "Not stated"}</dd></div>
          <div><dt>Construction</dt><dd>{property.constructionStatus ?? "Not stated"}</dd></div>
          <div><dt>Payment plan</dt><dd>{property.paymentPlan ?? "Not stated"}</dd></div>
          <div><dt>Listing</dt><dd>{property.listingType === "sale" ? "For sale" : "For rent"}</dd></div>
          <div><dt>Price basis</dt><dd>{property.price.basis ?? "Not stated"}</dd></div>
          <div><dt>Record collected</dt><dd>{property.collectedAt}</dd></div>
          <div><dt>Verification</dt><dd>{property.illustrative ? "Fictional sample" : property.status === "verified" ? "Verified" : "Not verified"}</dd></div>
        </dl>
        {property.amenities.length > 0 && (
          <div className="card-amenities">
            <strong>Features & amenities</strong>
            <ul>{property.amenities.map((amenity) => <li key={amenity}>{amenity}</li>)}</ul>
          </div>
        )}
        {!property.illustrative && property.pricingSources.length > 0 && (
          <div className="card-sources">
            <strong>Published pricing</strong>
            {property.pricingSources.map((source) => (
              <div className="card-source-detail" key={`${source.type}-${source.sourceUrl}`}>
                <a href={source.sourceUrl} target="_blank" rel="noreferrer">
                  {formatPriceSource(source)} · {source.label} <ArrowUpRight size={13} />
                </a>
                <small>Checked {source.checkedAt}. {source.note}</small>
              </div>
            ))}
          </div>
        )}
        {!property.illustrative && property.sources.length > 0 && (
          <div className="card-sources">
            <strong>Information sources</strong>
            {property.sources.map((source) => (
              <div className="card-source-detail" key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">{source.label} · checked {source.checkedAt} <ArrowUpRight size={13} /></a>
                <small>{source.note}</small>
              </div>
            ))}
          </div>
        )}
        <Link to={`/properties/${property.slug}`} className="card-details-link">Full property details <ArrowUpRight size={14} /></Link>
      </div>
    </article>
  );
};

export default PropertyCard;
