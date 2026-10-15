import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, MapPin, Play, Search, ShieldCheck, X } from "lucide-react";
import InquiryForm from "@/components/InquiryForm";
import PropertyCard from "@/components/PropertyCard";
import { brand } from "@/data/brand";
import {  formatPrice, formatPriceSource, getMediaAvailabilityMessage, getPrimaryPricingSource, getProperty, getPublishableMedia, locations, properties, type PropertyMedia, type PropertyRecord } from "@/data/properties";

const heroImage = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2200&q=85";
const interiorImage = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85";
const areaImage = "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1400&q=85";

const PageMeta = ({ title, description }: { title: string; description: string }) => {
  document.title = `${title} | ${brand.name}`;
  const descriptionTag = document.querySelector('meta[name="description"]');
  if (descriptionTag) descriptionTag.setAttribute("content", description);
  return null;
};

const Eyebrow = ({ children }: { children: React.ReactNode }) => <p className="eyebrow"><span />{children}</p>;

const PageIntro = ({ eyebrow, title, description }: { eyebrow: string; title: React.ReactNode; description?: string }) => (
  <div className="page-intro">
    <Eyebrow>{eyebrow}</Eyebrow>
    <h1>{title}</h1>
    {description && <p>{description}</p>}
  </div>
);

const PropertyGallery = ({ property, media }: { property: PropertyRecord; media: PropertyMedia[] }) => {
  const [failedMedia, setFailedMedia] = useState<Set<string>>(() => new Set());
  const availableMedia = useMemo(() => media.filter((item) => !failedMedia.has(item.id)), [failedMedia, media]);
  const [activeId, setActiveId] = useState(media[0]?.id ?? "");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const activeIndex = availableMedia.findIndex((item) => item.id === activeId);
  const activeMedia = availableMedia[activeIndex];

  useEffect(() => {
    if (!availableMedia.some((item) => item.id === activeId)) setActiveId(availableMedia[0]?.id ?? "");
  }, [activeId, availableMedia]);

  useEffect(() => {
    if (!lightboxOpen || !activeMedia) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      else if (event.key === "ArrowRight") setActiveId(availableMedia[(activeIndex + 1) % availableMedia.length].id);
      else if (event.key === "ArrowLeft") setActiveId(availableMedia[(activeIndex - 1 + availableMedia.length) % availableMedia.length].id);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeMedia, activeIndex, availableMedia, lightboxOpen]);

  const selectRelativeImage = (offset: number) => {
    const nextIndex = (activeIndex + offset + availableMedia.length) % availableMedia.length;
    setActiveId(availableMedia[nextIndex].id);
  };

  const markMediaFailed = (id: string) => setFailedMedia((failed) => new Set(failed).add(id));

  if (!availableMedia.length) {
    const mediaSource = property.videos[0]?.sourcePage ?? property.images[0]?.sourcePage;
    return <div className="detail-gallery"><div className="gallery-placeholder"><span className="placeholder-monogram">A</span><strong>Property media not cleared for display</strong><small>{getMediaAvailabilityMessage(property)}</small>{mediaSource && <a href={mediaSource} target="_blank" rel="noreferrer">View the original media source <ArrowUpRight size={14} /></a>}</div></div>;
  }

  return (
    <>
      <section className="property-gallery" aria-label={`${property.name} media gallery`}>
        {availableMedia.some((item) => item.illustrative) && (
          <p className="gallery-demo-notice">Illustrative demo media — these photos and video do not depict {property.name}.</p>
        )}
        <div className="gallery-feature">
          {activeMedia.type === "image" ? (
            <button type="button" className="gallery-image-button" onClick={() => setLightboxOpen(true)} aria-label={`View ${property.name} photograph full screen`}>
              <img src={activeMedia.url} alt={activeMedia.alt || `${property.name} property photograph`} onError={() => markMediaFailed(activeMedia.id)} />
            </button>
          ) : (
            <video className="gallery-feature-video" controls playsInline preload="metadata" aria-label={activeMedia.alt} onError={() => markMediaFailed(activeMedia.id)}>
              <source src={activeMedia.url} type="video/mp4" />
            </video>
          )}
          <span className="gallery-counter">{activeIndex + 1} / {availableMedia.length}</span>
          {availableMedia.length > 1 && (
            <>
              <button type="button" className="gallery-arrow gallery-previous" onClick={() => selectRelativeImage(-1)} aria-label="Previous photograph"><ArrowLeft size={20} /></button>
              <button type="button" className="gallery-arrow gallery-next" onClick={() => selectRelativeImage(1)} aria-label="Next media item"><ArrowRight size={20} /></button>
            </>
          )}
        </div>
        {availableMedia.length > 1 && (
          <div className="gallery-thumbnails" aria-label="Choose a media item">
            {availableMedia.map((item, index) => (
              <button type="button" key={item.id} className={item.id === activeId ? "active" : ""} onClick={() => setActiveId(item.id)} aria-label={`Show ${item.type} ${index + 1}`}>
                {item.type === "image" ? <img src={item.url} alt="" loading="lazy" onError={() => markMediaFailed(item.id)} /> : <span className="gallery-video-thumbnail"><Play size={18} />Video</span>}
              </button>
            ))}
          </div>
        )}
        <p className="gallery-attribution">
          {activeMedia.caption || (activeMedia.type === "video" ? "Authorized property video" : "Authorized property photograph")}
          {" · "}
          <a href={activeMedia.sourcePage} target="_blank" rel="noreferrer">Media source</a>
        </p>
      </section>
      {lightboxOpen && activeMedia?.type === "image" && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${property.name} photograph ${activeIndex + 1} of ${availableMedia.length}`} onClick={() => setLightboxOpen(false)}>
          <button type="button" className="gallery-lightbox-close" onClick={() => setLightboxOpen(false)} aria-label="Close gallery"><X size={22} /></button>
          {availableMedia.length > 1 && <button type="button" className="gallery-lightbox-arrow gallery-lightbox-previous" onClick={(event) => { event.stopPropagation(); selectRelativeImage(-1); }} aria-label="Previous photograph"><ArrowLeft size={24} /></button>}
          <img src={activeMedia.url} alt={activeMedia.alt || `${property.name} property photograph`} onError={() => markMediaFailed(activeMedia.id)} onClick={(event) => event.stopPropagation()} />
          {availableMedia.length > 1 && <button type="button" className="gallery-lightbox-arrow gallery-lightbox-next" onClick={(event) => { event.stopPropagation(); selectRelativeImage(1); }} aria-label="Next photograph"><ArrowRight size={24} /></button>}
          <p>{activeIndex + 1} / {availableMedia.length} · {activeMedia.caption || property.name}</p>
        </div>
      )}
    </>
  );
};

const InquiryBand = () => (
  <section className="inquiry-band">
    <div>
      <Eyebrow>Start a conversation</Eyebrow>
      <h2>A better-informed move<br />starts with a conversation.</h2>
    </div>
    <Link className="button button-light" to="/contact">Speak with our team <ArrowUpRight size={16} /></Link>
  </section>
);

const ExploreSearch = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("sale");
  const navigate = useNavigate();

  return (
    <form className="hero-search" onSubmit={(event) => {
      event.preventDefault();
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      params.set("type", category);
      navigate(`/properties?${params.toString()}`);
    }}>
      <label className="search-location">
        <span>LOCATION OR DEVELOPMENT</span>
        <span className="search-input-wrap"><MapPin size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Where would you like to live?" /></span>
      </label>
      <label className="search-category">
        <span>LOOKING TO</span>
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="sale">Buy a property</option>
          <option value="rent">Rent a property</option>
        </select>
      </label>
      <button type="submit" aria-label="Search properties"><Search size={18} /><span>Explore properties</span></button>
    </form>
  );
};

export const HomePage = () => (
  <>
    <PageMeta title="Dubai property, thoughtfully considered" description="Explore Dubai communities and property opportunities with Aurevia Estates Dubai." />
    <section className="home-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(12, 27, 39, .83) 0%, rgba(12, 27, 39, .44) 54%, rgba(12, 27, 39, .05) 100%), url("${heroImage}")` }}>
      <div className="home-hero-content">
        <Eyebrow>Dubai real estate · A considered approach</Eyebrow>
        <h1>Find your place<br />in <em>what’s next.</em></h1>
        <p>Thoughtful guidance for a more confident move in one of the world’s most dynamic cities.</p>
        <Link className="text-link text-link-light" to="/about">Discover Aurevia <ArrowRight size={16} /></Link>
      </div>
      <div className="hero-bottom-note"><span>25°12' N &nbsp; 55°16' E</span><span>Dubai, United Arab Emirates</span></div>
    </section>

    <div className="search-overlap"><ExploreSearch /></div>

    <section className="section section-spacious">
      <div className="section-heading">
        <div><Eyebrow>Discover with clarity</Eyebrow><h2>A place for every<br /><em>kind of ambition.</em></h2></div>
        <p>From a waterfront address to a calm family neighbourhood, begin with the areas that feel right to you.</p>
      </div>
      <div className="location-grid">
        {locations.slice(0, 4).map((location, index) => (
          <Link className={`location-card location-card-${index + 1}`} key={location.slug} to={`/locations/${location.slug}`}>
            <span className="location-card-art" style={{ backgroundImage: `linear-gradient(0deg, rgba(12,27,39,.7), transparent 75%), url("${[heroImage, areaImage, interiorImage, heroImage][index]}")` }} />
            <span className="location-card-copy"><small>Dubai · Community guide</small><strong>{location.name}</strong><span>Explore area <ArrowUpRight size={15} /></span></span>
          </Link>
        ))}
      </div>
      <Link className="text-link section-link" to="/locations">Explore all locations <ArrowRight size={16} /></Link>
    </section>

    <section className="section section-tint">
      <div className="section-heading">
        <div><Eyebrow>Selected opportunities</Eyebrow><h2>Explore the<br /><em>property register.</em></h2></div>
        <p>Every property shown here includes its source and collection date. Unconfirmed details are clearly identified—not filled in with assumptions.</p>
      </div>
      <div className="property-grid">
        {properties.slice(0, 3).map((property) => <PropertyCard key={property.id} property={property} />)}
      </div>
      {properties.length === 0 && <p className="empty-note">No properties are published yet. Contact us to discuss your search.</p>}
      <Link className="text-link section-link" to="/properties">View property register <ArrowRight size={16} /></Link>
    </section>

    <section className="editorial-feature section">
      <div className="editorial-image" style={{ backgroundImage: `url("${interiorImage}")` }}>
        <span>Illustrative interior photography</span>
      </div>
      <div className="editorial-copy">
        <Eyebrow>How we work</Eyebrow>
        <h2>More context.<br /><em>Better decisions.</em></h2>
        <p>We bring the details into focus: the area, the source of a listing, what has been confirmed, and what still needs a conversation.</p>
        <Link className="text-link" to="/services">Our approach <ArrowRight size={16} /></Link>
      </div>
    </section>
    <InquiryBand />
  </>
);

type SearchFilters = {
  q: string;
  type: string;
  propertyType: string;
  minPrice: string;
  maxPrice: string;
  currency: string;
  beds: string;
  status: string;
  sort: string;
};

const initialFilters = (params: URLSearchParams): SearchFilters => ({
  q: params.get("q") ?? "",
  type: params.get("type") ?? "",
  propertyType: "",
  minPrice: "",
  maxPrice: "",
  currency: params.get("currency") ?? "",
  beds: "",
  status: "",
  sort: "recent",
});

const selectClass = "filter-select";

export const PropertiesPage = () => {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>(() => initialFilters(params));
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const filtered = useMemo(() => {
    const query = filters.q.trim().toLowerCase();
    const result = properties.filter((property) => {
      const matchesQuery = !query || `${property.name} ${property.location.community} ${property.location.city}`.toLowerCase().includes(query);
      const matchesType = !filters.type || property.listingType === filters.type;
      const matchesPropertyType = !filters.propertyType || property.propertyType === filters.propertyType;
      const matchesBeds = !filters.beds || (property.bedrooms.min != null && property.bedrooms.min >= Number(filters.beds));
      const matchesStatus = !filters.status || (filters.status === "ready" ? Boolean(property.constructionStatus?.toLowerCase().includes("ready")) : !property.constructionStatus?.toLowerCase().includes("ready"));
      const low = Number(filters.minPrice);
      const high = Number(filters.maxPrice);
      const priceIsKnown = property.price.min != null || property.price.max != null;
      const hasPriceFilter = Boolean(filters.minPrice || filters.maxPrice);
      const currencyMatches = !filters.currency || property.price.currency === filters.currency;
      const amountFiltersHaveCurrency = !hasPriceFilter || Boolean(filters.currency);
      const matchesMin = !filters.minPrice || (amountFiltersHaveCurrency && priceIsKnown && (property.price.max ?? property.price.min ?? 0) >= low);
      const matchesMax = !filters.maxPrice || (amountFiltersHaveCurrency && priceIsKnown && (property.price.min ?? property.price.max ?? 0) <= high);
      return matchesQuery && matchesType && matchesPropertyType && matchesBeds && matchesStatus &&
        currencyMatches && matchesMin && matchesMax;
    });
    if (filters.sort === "price-asc" && filters.currency) result.sort((a, b) => (a.price.min ?? Number.MAX_VALUE) - (b.price.min ?? Number.MAX_VALUE));
    if (filters.sort === "price-desc" && filters.currency) result.sort((a, b) => (b.price.max ?? -1) - (a.price.max ?? -1));
    if (filters.sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [filters]);
  const shown = filtered.slice((page - 1) * pageSize, page * pageSize);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const update = (key: keyof SearchFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };
  const clear = () => {
    setFilters(initialFilters(new URLSearchParams()));
    setParams({});
    setPage(1);
  };

  return (
    <main className="page-shell properties-shell">
      <PageMeta title="Dubai properties" description="Search source-attributed property records in Dubai, with clear verification status." />
      <h1 className="properties-title">Properties</h1>
      <div className="listing-layout">
        <aside className="filter-panel">
          <div className="filter-title"><span>Refine your search</span><button type="button" onClick={clear}>Clear all</button></div>
          <label className="filter-field">Search location or development<input value={filters.q} onChange={(event) => update("q", event.target.value)} placeholder="e.g. Dubai Marina" /></label>
          <label className="filter-field">Listing type<select className={selectClass} value={filters.type} onChange={(event) => update("type", event.target.value)}><option value="">Buy or rent</option><option value="sale">For sale</option><option value="rent">For rent</option></select></label>
          <label className="filter-field">Property type<select className={selectClass} value={filters.propertyType} onChange={(event) => update("propertyType", event.target.value)}><option value="">Any type</option>{["Apartment", "Villa", "Penthouse", "Townhouse"].map((type) => <option key={type}>{type}</option>)}</select></label>
          <label className="filter-field">Price currency<select className={selectClass} value={filters.currency} onChange={(event) => update("currency", event.target.value)}><option value="">Choose currency</option>{[...new Set(properties.map((property) => property.price.currency).filter((currency): currency is string => Boolean(currency)))].sort().map((currency) => <option key={currency}>{currency}</option>)}</select></label>
          <div className="filter-field"><span>Price range{filters.currency ? ` (${filters.currency})` : ""}</span><div className="range-fields"><input aria-label={`Minimum price in ${filters.currency || "selected"} currency`} type="number" min="0" placeholder="Min" value={filters.minPrice} onChange={(event) => update("minPrice", event.target.value)} /><input aria-label={`Maximum price in ${filters.currency || "selected"} currency`} type="number" min="0" placeholder="Max" value={filters.maxPrice} onChange={(event) => update("maxPrice", event.target.value)} /></div><small>{filters.currency ? "Only source-listed prices in this currency match." : "Choose a currency before filtering by amount."}</small></div>
          <label className="filter-field">Bedrooms<select className={selectClass} value={filters.beds} onChange={(event) => update("beds", event.target.value)}><option value="">Any number</option>{["1", "2", "3", "4", "5"].map((n) => <option key={n} value={n}>{n}+</option>)}</select></label>
          <label className="filter-field">Construction status<select className={selectClass} value={filters.status} onChange={(event) => update("status", event.target.value)}><option value="">Any status</option><option value="ready">Ready</option><option value="off-plan">Off-plan / other</option></select></label>
        </aside>
        <section className="results-panel" aria-live="polite">
          <div className="results-toolbar"><p><strong>{filtered.length}</strong> {filtered.length === 1 ? "record" : "records"}{filtered.some((property) => property.illustrative) && <span> · {filtered.filter((property) => property.illustrative).length} clearly labelled fictional demo samples</span>}</p><label>Sort by <select className={selectClass} value={filters.sort} onChange={(event) => update("sort", event.target.value)}><option value="recent">Recently collected</option><option value="name">Name</option><option value="price-asc" disabled={!filters.currency}>Price: low to high</option><option value="price-desc" disabled={!filters.currency}>Price: high to low</option></select></label></div>
          {shown.length ? <div className="property-grid">{shown.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <div className="empty-state"><Search size={24} /><h2>No matching records</h2><p>{(filters.minPrice || filters.maxPrice) && !filters.currency ? "Choose a currency before filtering by a price amount." : "Try another area or remove filters. Records without published prices or specifications cannot match those filters."}</p><button className="button button-outline" onClick={clear}>Clear filters</button></div>}
          {pages > 1 && <div className="pagination"><button disabled={page === 1} onClick={() => setPage((n) => n - 1)}>Previous</button><span>Page {page} of {pages}</span><button disabled={page === pages} onClick={() => setPage((n) => n + 1)}>Next</button></div>}
        </section>
      </div>
    </main>
  );
};

const DetailFact = ({ label, value }: { label: string; value: string | number | null }) => (
  value == null || value === "" ? null : <div className="detail-fact"><small>{label}</small><strong>{value}</strong></div>
);

export const PropertyDetailPage = () => {
  const { slug = "" } = useParams();
  const property = getProperty(slug);
  if (!property) return <NotFoundPage />;
  const related = properties.filter((item) => item.id !== property.id).slice(0, 3);
  const media = getPublishableMedia(property);
  const primaryPricing = getPrimaryPricingSource(property);

  return (
    <main className="page-shell detail-shell">
      <PageMeta title={property.name} description={`${property.name}, ${property.location.community}. Listing details and source verification status.`} />
      <div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><Link to="/properties">Properties</Link><span>/</span><span>{property.name}</span></div>
      {property.illustrative && <div className="illustrative-disclaimer" role="note"><strong>Illustrative sample — not a real property listing</strong><p>This example property does not exist and is not available to buy or rent. Its location, price, size, features, dates and all other details are fictional and shown only to demonstrate the page.</p></div>}
      <div className="detail-heading">
        <div><Eyebrow>{property.location.city} · {property.location.country}</Eyebrow><h1>{property.name}</h1><p className="detail-location"><MapPin size={16} />{property.location.community}</p></div>
        <div className="detail-price">{property.price.min == null && property.price.max == null ? "Price not published · contact us for current pricing" : <>{formatPrice(property)}<small>{primaryPricing?.label ?? property.price.basis}{primaryPricing ? ` · source checked ${primaryPricing.checkedAt}` : ""}. Confirm current availability before enquiry.</small></>}</div>
      </div>
      <PropertyGallery property={property} media={media} />
      <div className="detail-content-grid">
        <div>
          <div className="verification-note"><ShieldCheck size={18} /><div><strong>{property.status === "verified" ? "Verified listing information" : "Source record · details not verified"}</strong><p>Collected {property.collectedAt}. Prices, availability and property specifications should be confirmed directly before making a decision.</p></div></div>
          <section className="detail-section"><Eyebrow>Overview</Eyebrow><h2>Property information</h2><p>{property.summary}</p></section>
          <section className="detail-section"><Eyebrow>At a glance</Eyebrow><div className="facts-grid">
            <DetailFact label="Property type" value={property.propertyType} />
            <DetailFact label="Building" value={property.buildingInfo} />
            <DetailFact label="Bedrooms" value={property.bedrooms.min == null ? null : property.bedrooms.max != null && property.bedrooms.max !== property.bedrooms.min ? `${property.bedrooms.min}–${property.bedrooms.max}` : property.bedrooms.min} />
            <DetailFact label="Bathrooms" value={property.bathrooms.min == null ? null : property.bathrooms.max != null && property.bathrooms.max !== property.bathrooms.min ? `${property.bathrooms.min}–${property.bathrooms.max}` : property.bathrooms.min} />
            <DetailFact label="Area" value={property.area.min == null ? null : `${property.area.min}${property.area.max != null && property.area.max !== property.area.min ? `–${property.area.max}` : ""}${property.area.unit ? ` ${property.area.unit}` : ""}`} />
            <DetailFact label="Tenure" value={property.tenure} />
            <DetailFact label="Completion" value={property.completionDate} />
            <DetailFact label="Construction status" value={property.constructionStatus} />
            <DetailFact label="Payment plan" value={property.paymentPlan} />
          </div></section>
          {property.pricingSources.length > 0 && <section className="detail-section"><Eyebrow>Pricing by source</Eyebrow><h2>Published price information</h2><div className="pricing-source-list">{property.pricingSources.map((source) => <div className="pricing-source-item" key={`${source.type}-${source.sourceUrl}`}><div><strong>{formatPriceSource(source)}</strong><small>{source.label} · checked {source.checkedAt}</small><p>{source.note}</p></div><a href={source.sourceUrl} target="_blank" rel="noreferrer">View source <ArrowUpRight size={14} /></a></div>)}</div></section>}
          {property.amenities.length > 0 && <section className="detail-section"><Eyebrow>Features</Eyebrow><h2>Property features</h2><ul className="feature-list">{property.amenities.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul></section>}
          {!property.illustrative && <section className="source-panel"><span>Sources and verification</span>{property.sources.map((source) => <div className="source-reference" key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label} <ArrowUpRight size={14} /></a><small>Checked {source.checkedAt}. {source.note}</small></div>)}<small>Original source content and imagery belong to their respective rights holders. Photography references are not displayed without confirmed reuse permission.</small></section>}
        </div>
        <aside className="detail-inquiry"><Eyebrow>Request information</Eyebrow><h2>Ask about<br /><em>{property.name}.</em></h2><p>Share what you are looking for and our team can follow up once an inquiry channel is configured.</p><InquiryForm propertyName={property.name} /></aside>
      </div>
      {related.length > 0 && <section className="section related-section"><div className="section-heading"><div><Eyebrow>Explore further</Eyebrow><h2>Related <em>records.</em></h2></div></div><div className="property-grid">{related.map((item) => <PropertyCard key={item.id} property={item} />)}</div></section>}
    </main>
  );
};

export const LocationsPage = () => (
  <main className="page-shell"><PageMeta title="Dubai communities" description="Browse Dubai community guides and source-backed property location records." />
    <PageIntro eyebrow="The neighbourhood register" title={<>A city of many<br /><em>ways to belong.</em></>} description="Browse Dubai area guides. A community directory entry does not imply that Aurevia has a property listing there." />
    <div className="location-directory">{locations.map((location, index) => {
      const matches = properties.filter((property) => property.location.community.toLowerCase() === location.name.toLowerCase());
      return <Link className="location-row" key={location.slug} to={`/locations/${location.slug}`}><span className="location-index">0{index + 1}</span><span className="location-title">{location.name}<small>{location.status === "source-location" ? "Named in an inspected source listing" : "Community directory · no listing data collected"}</small></span><span className="location-count">{matches.length} sourced {matches.length === 1 ? "record" : "records"}</span><ArrowUpRight size={18} /></Link>;
    })}</div><InquiryBand />
  </main>
);

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const LocationDetailPage = () => {
  const { slug = "" } = useParams();
  const location = locations.find((item) => item.slug === slug);
  if (!location) return <NotFoundPage />;
  const matches = properties.filter((property) => slugify(property.location.community) === location.slug);
  return <main className="page-shell"><PageMeta title={location.name} description={`Location directory entry for ${location.name}, Dubai.`} />
    <div className="location-detail-hero" style={{ backgroundImage: `linear-gradient(0deg, rgba(12,27,39,.78), rgba(12,27,39,.12)), url("${areaImage}")` }}><span>Illustrative area photography</span><div><Eyebrow>Dubai community guide</Eyebrow><h1>{location.name}</h1></div></div>
    <div className="location-data-note"><ShieldCheck size={18} /><p>{location.status === "source-location" ? `This area is named in a source property page. No community amenities or area claims have been added without verification. ${matches.length} source record${matches.length === 1 ? "" : "s"} currently match.` : "This is a directory entry only. We have not collected a source-backed property listing or independently verified area guide for this community."}</p></div>
    {location.sourceUrl && <p className="source-line">Location source: <a href={location.sourceUrl} target="_blank" rel="noreferrer">view original page <ArrowUpRight size={13} /></a></p>}
    <section className="section"><div className="section-heading"><div><Eyebrow>Source-backed records</Eyebrow><h2>Properties in <em>{location.name}.</em></h2></div></div>{matches.length ? <div className="property-grid">{matches.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <div className="empty-state"><h2>No property records yet</h2><p>Listings will appear here when sourced and added to the property register.</p></div>}</section>
  </main>;
};



export const AboutPage = () => (
  <main className="page-shell"><PageMeta title="About Aurevia" description="Learn about the Aurevia Estates Dubai approach to property discovery." />
    <PageIntro eyebrow="Aurevia Estates Dubai" title={<>Dubai property,<br /><em>with perspective.</em></>} description="An independent, configurable real estate experience built around clear sourcing, thoughtful discovery and informed conversations." />
    <section className="editorial-feature about-feature"><div className="editorial-image" style={{ backgroundImage: `url("${areaImage}")` }}><span>Illustrative Dubai architecture</span></div><div className="editorial-copy"><Eyebrow>Our point of view</Eyebrow><h2>Clarity before<br /><em>confidence.</em></h2><p>Aurevia is a temporary brand for this product experience. Company credentials, registration, address and contact details are intentionally not claimed; add verified business information before launch.</p><Link className="text-link" to="/contact">Get in touch <ArrowRight size={16} /></Link></div></section>
  </main>
);

export const ServicesPage = () => (
  <main className="page-shell"><PageMeta title="Our approach" description="Property discovery and buyer guidance services from Aurevia Estates Dubai." />
    <PageIntro eyebrow="Our approach" title={<>The right guidance<br /><em>for the next step.</em></>} description="A practical framework for discovering, comparing and asking better questions about Dubai real estate." />
    <div className="service-list">{[
      ["01", "Property discovery", "Clarify your priorities and explore source-attributed records by community, property type and price where published."],
      ["02", "Area orientation", "Compare community information with the underlying sources and separate directory context from verified listing details."],
      ["03", "Buyer and investor conversations", "Discuss your goals and due diligence questions without promises of returns or unsupported market claims."],
      ["04", "Listing support", "Prepare listing information with clear source, authorization and verification status before publication."],
    ].map(([number, title, body]) => <article className="service-row" key={number}><span>{number}</span><h2>{title}</h2><p>{body}</p></article>)}</div><InquiryBand />
  </main>
);

export const GuidesPage = () => (
  <main className="page-shell"><PageMeta title="Dubai property guides" description="Independent buyer and investor guides for researching Dubai property." />
    <PageIntro eyebrow="The field notes" title={<>Research before<br /><em>you decide.</em></>} description="Practical, non-promissory guides to help frame questions. Confirm regulations, fees and contract terms with qualified professionals." />
    <div className="guide-grid">{[
      ["Buying in Dubai: a research checklist", "A starting framework for confirming the listing, parties, documents, fees and transaction steps with the relevant professionals."],
      ["Questions to ask about an off-plan home", "Confirm the project, status, milestone schedule, payment terms and cancellation provisions against official documents."],
      ["Comparing Dubai communities", "Build a shortlist around your own commute, budget, amenities and lifestyle requirements—then verify specifics locally."],
    ].map(([title, description], index) => <article className="guide-card" key={title}><span>FIELD NOTE 0{index + 1}</span><h2>{title}</h2><p>{description}</p><span className="guide-read">Read guide <ArrowDown size={14} /></span></article>)}</div>
  </main>
);

const faqs = [
  ["Are property prices on this site current?", "A price is shown only when it is present in the sourced record. The current starter dataset does not include verified prices. Confirm any price, availability and terms with the relevant seller before relying on them."],
  ["Are the images photographs of listed homes?", "No property-specific images have been added to the starter records. Any editorial photography is illustrative and is labelled as such."],
  ["Does Aurevia guarantee investment returns?", "No. No return, appreciation or rental-yield guarantees are made. Real estate decisions carry risk and should be assessed independently."],
  ["Can I submit a property for publication?", "Yes. Contact us with authorized listing details. Publishing requires a configured inquiry channel and verification of the source and image rights."],
];

export const FaqPage = () => (
  <main className="page-shell"><PageMeta title="Frequently asked questions" description="Answers to common questions about property data, sources and inquiries." /><PageIntro eyebrow="A few useful answers" title={<>Frequently<br /><em>asked questions.</em></>} />
    <div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={18} /></summary><p>{answer}</p></details>)}</div>
  </main>
);

export const ContactPage = () => (
  <main className="page-shell"><PageMeta title="Contact" description="Contact Aurevia Estates Dubai to discuss your property search." /><div className="contact-layout"><div><PageIntro eyebrow="Get in touch" title={<>A thoughtful move<br /><em>begins here.</em></>} description="Tell us a little about what you are looking for. Contact channels are configurable and no message will be sent until an endpoint is set up." /><div className="config-note"><strong>Contact information</strong><p>{brand.email || "Email not configured"}<br />{brand.phone || "Telephone not configured"}<br />{brand.address || "Business address not configured"}</p></div></div><div className="contact-form-panel"><InquiryForm /></div></div></main>
);

const LegalPage = ({ type }: { type: "privacy" | "terms" }) => (
  <main className="page-shell"><PageMeta title={type === "privacy" ? "Privacy policy" : "Terms and conditions"} description={`${type === "privacy" ? "Privacy" : "Terms"} information for Aurevia Estates Dubai.`} /><PageIntro eyebrow="Important information" title={type === "privacy" ? <>Privacy <em>policy.</em></> : <>Terms and <em>conditions.</em></>} description="This starter text is a configuration placeholder and must be reviewed by qualified counsel before the site is published." />
    {type === "privacy" ? <div className="legal-copy"><h2>Data collection</h2><p>This website currently uses a local, static property dataset. Contact and newsletter forms do not transmit or store personal information unless an endpoint is configured. Before enabling forms, document the data collected, purpose, retention period, processors and contact route.</p><h2>Your choices</h2><p>Replace this placeholder with a jurisdiction-appropriate privacy notice and verified contact details before launch.</p></div> : <div className="legal-copy"><h2>Property information</h2><p>Property records are informational and may be incomplete or outdated. Verify current availability, pricing, specifications, legal status and contractual terms with the relevant parties and qualified advisers.</p><h2>Use of this site</h2><p>Replace this placeholder with terms reviewed for the operating business and applicable jurisdictions before launch.</p></div>}
  </main>
);

export const PrivacyPage = () => <LegalPage type="privacy" />;
export const TermsPage = () => <LegalPage type="terms" />;

export const NotFoundPage = () => (
  <main className="not-found"><PageMeta title="Page not found" description="The requested page could not be found." /><Eyebrow>404 · Page not found</Eyebrow><h1>This address<br /><em>isn't on the map.</em></h1><Link className="button button-dark" to="/">Return home <ArrowRight size={16} /></Link></main>
);
