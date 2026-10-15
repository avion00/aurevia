import propertyRecords from "./properties.json";
import locationRecords from "./locations.json";

export type PricingSource = {
  type: "project-range" | "available-units" | "unit-asking";
  label: string;
  min: number | null;
  max: number | null;
  currency: string;
  sourceUrl: string;
  checkedAt: string;
  note: string;
};

type PropertyImage = {
  id: string;
  url: string;
  sourcePage: string;
  caption: string | null;
  alt: string;
  sequence: number;
  downloadStatus: "not-downloaded" | "downloaded" | "failed";
  permissionStatus: "authorized" | "unknown" | "not-authorized";
  verificationStatus: "verified" | "unverified" | "missing";
  illustrative?: boolean;
};

type PropertyVideo = PropertyImage;

export type PropertyMedia =
  | (PropertyImage & { type: "image" })
  | (PropertyVideo & { type: "video" });

export type PropertyRecord = {
  id: string;
  slug: string;
  name: string;
  illustrative?: boolean;
  location: { city: string; community: string; country: string };
  price: { min: number | null; max: number | null; currency: string | null; basis: string | null };
  pricingSources: PricingSource[];
  priceCheckedAt: string | null;
  sources: { label: string; url: string; checkedAt: string; note: string }[];
  bedrooms: { min: number | null; max: number | null };
  bathrooms: { min: number | null; max: number | null };
  area: { min: number | null; max: number | null; unit: string | null };
  propertyType: string | null;
  buildingInfo: string | null;
  listingType: "sale" | "rent";
  tenure: string | null;
  completionDate: string | null;
  constructionStatus: string | null;
  paymentPlan: string | null;
  amenities: string[];
  images: PropertyImage[];
  videos: PropertyVideo[];
  summary: string;
  sourceUrl: string;
  collectedAt: string;
  verifiedAt: string | null;
  priceVerifiedAt: string | null;
  status: "unverified" | "verified" | "draft";
};

const illustrativeSamples: PropertyRecord[] = [
  {
    id: "demo-marina-apartment",
    slug: "illustrative-marina-apartment",
    name: "Illustrative Marina Apartment",
    location: { city: "Dubai", community: "Dubai Marina", country: "United Arab Emirates" },
    price: { min: 1800000, max: 3200000, currency: "AED", basis: "Fictional sample range; not an offer" },
    bedrooms: { min: 1, max: 2 },
    bathrooms: { min: 1, max: 3 },
    area: { min: 720, max: 1380, unit: "sq ft" },
    propertyType: "Apartment",
    buildingInfo: "Illustrative 32-storey residential tower",
    listingType: "sale",
    tenure: "Sample: freehold",
    completionDate: "Sample: completed",
    constructionStatus: "Illustrative sample only",
    paymentPlan: "Not applicable — fictional sample",
    amenities: ["Swimming pool", "Residents' gym", "Marina promenade access", "Covered parking", "24-hour reception"],
    summary: "Illustrative sample only—not a real building or available home. Every specification and price shown here is fictional and is included to demonstrate the property page layout.",
  },
  {
    id: "demo-downtown-penthouse",
    slug: "illustrative-downtown-penthouse",
    name: "Illustrative Downtown Penthouse",
    location: { city: "Dubai", community: "Downtown Dubai", country: "United Arab Emirates" },
    price: { min: 8500000, max: 14500000, currency: "AED", basis: "Fictional sample range; not an offer" },
    bedrooms: { min: 3, max: 4 },
    bathrooms: { min: 3, max: 5 },
    area: { min: 2450, max: 3900, unit: "sq ft" },
    propertyType: "Penthouse",
    buildingInfo: "Illustrative high-rise residence",
    listingType: "sale",
    tenure: "Sample: freehold",
    completionDate: "Sample: completed",
    constructionStatus: "Illustrative sample only",
    paymentPlan: "Not applicable — fictional sample",
    amenities: ["Private terrace", "Sky lounge", "Concierge", "Residents' pool", "Valet parking"],
    summary: "Illustrative sample only—not a real building or available home. Every specification and price shown here is fictional and is included to demonstrate the property page layout.",
  },
  {
    id: "demo-palm-villa",
    slug: "illustrative-palm-villa",
    name: "Illustrative Palm Garden Villa",
    location: { city: "Dubai", community: "Palm Jumeirah", country: "United Arab Emirates" },
    price: { min: 18500000, max: 29000000, currency: "AED", basis: "Fictional sample range; not an offer" },
    bedrooms: { min: 4, max: 6 },
    bathrooms: { min: 4, max: 7 },
    area: { min: 4600, max: 7200, unit: "sq ft" },
    propertyType: "Villa",
    buildingInfo: "Illustrative detached villa",
    listingType: "sale",
    tenure: "Sample: freehold",
    completionDate: "Sample: completed",
    constructionStatus: "Illustrative sample only",
    paymentPlan: "Not applicable — fictional sample",
    amenities: ["Private garden", "Plunge pool", "Maid's room", "Multiple parking spaces", "Beach-club access (sample)"],
    summary: "Illustrative sample only—not a real building or available home. Every specification and price shown here is fictional and is included to demonstrate the property page layout.",
  },
  {
    id: "demo-creek-townhouse",
    slug: "illustrative-creek-townhouse",
    name: "Illustrative Creek Townhouse",
    location: { city: "Dubai", community: "Dubai Creek Harbour", country: "United Arab Emirates" },
    price: { min: 4100000, max: 5900000, currency: "AED", basis: "Fictional sample range; not an offer" },
    bedrooms: { min: 3, max: 4 },
    bathrooms: { min: 3, max: 5 },
    area: { min: 2100, max: 3150, unit: "sq ft" },
    propertyType: "Townhouse",
    buildingInfo: "Illustrative multi-level townhouse",
    listingType: "sale",
    tenure: "Sample: freehold",
    completionDate: "Sample: 2028",
    constructionStatus: "Illustrative sample only",
    paymentPlan: "Not applicable — fictional sample",
    amenities: ["Private courtyard", "Community park", "Cycling paths", "Shared pool", "EV-ready parking (sample)"],
    summary: "Illustrative sample only—not a real building or available home. Every specification and price shown here is fictional and is included to demonstrate the property page layout.",
  },
  {
    id: "demo-jlt-apartment",
    slug: "illustrative-jlt-apartment",
    name: "Illustrative Lakeside Apartment",
    location: { city: "Dubai", community: "Jumeirah Lake Towers", country: "United Arab Emirates" },
    price: { min: 1350000, max: 2650000, currency: "AED", basis: "Fictional sample range; not an offer" },
    bedrooms: { min: 1, max: 3 },
    bathrooms: { min: 1, max: 3 },
    area: { min: 680, max: 1710, unit: "sq ft" },
    propertyType: "Apartment",
    buildingInfo: "Illustrative residential tower",
    listingType: "sale",
    tenure: "Sample: freehold",
    completionDate: "Sample: completed",
    constructionStatus: "Illustrative sample only",
    paymentPlan: "Not applicable — fictional sample",
    amenities: ["Lake-facing lounge", "Fitness studio", "Pool deck", "Metro access (sample)", "Retail at podium"],
    summary: "Illustrative sample only—not a real building or available home. Every specification and price shown here is fictional and is included to demonstrate the property page layout.",
  },
  {
    id: "demo-arabian-ranches-villa",
    slug: "illustrative-arabian-ranches-villa",
    name: "Illustrative Ranches Family Villa",
    location: { city: "Dubai", community: "Arabian Ranches", country: "United Arab Emirates" },
    price: { min: 5200000, max: 8700000, currency: "AED", basis: "Fictional sample range; not an offer" },
    bedrooms: { min: 3, max: 5 },
    bathrooms: { min: 3, max: 6 },
    area: { min: 2900, max: 4900, unit: "sq ft" },
    propertyType: "Villa",
    buildingInfo: "Illustrative detached family home",
    listingType: "sale",
    tenure: "Sample: freehold",
    completionDate: "Sample: completed",
    constructionStatus: "Illustrative sample only",
    paymentPlan: "Not applicable — fictional sample",
    amenities: ["Landscaped garden", "Family room", "Community clubhouse", "Sports courts", "Two-car garage"],
    summary: "Illustrative sample only—not a real building or available home. Every specification and price shown here is fictional and is included to demonstrate the property page layout.",
  },
  {
    id: "demo-business-bay-apartment",
    slug: "illustrative-business-bay-apartment",
    name: "Illustrative Canal-Side Apartment",
    location: { city: "Dubai", community: "Business Bay", country: "United Arab Emirates" },
    price: { min: 1700000, max: 3450000, currency: "AED", basis: "Fictional sample range; not an offer" },
    bedrooms: { min: 1, max: 3 },
    bathrooms: { min: 1, max: 4 },
    area: { min: 760, max: 1960, unit: "sq ft" },
    propertyType: "Apartment",
    buildingInfo: "Illustrative canal-side tower",
    listingType: "sale",
    tenure: "Sample: freehold",
    completionDate: "Sample: 2027",
    constructionStatus: "Illustrative sample only",
    paymentPlan: "Not applicable — fictional sample",
    amenities: ["Canal-view terrace", "Residents' gym", "Infinity pool", "Co-working lounge", "Secure access"],
    summary: "Illustrative sample only—not a real building or available home. Every specification and price shown here is fictional and is included to demonstrate the property page layout.",
  },
  {
    id: "demo-dubai-hills-townhouse",
    slug: "illustrative-dubai-hills-townhouse",
    name: "Illustrative Hillside Townhouse",
    location: { city: "Dubai", community: "Dubai Hills Estate", country: "United Arab Emirates" },
    price: { min: 3600000, max: 5700000, currency: "AED", basis: "Fictional sample range; not an offer" },
    bedrooms: { min: 3, max: 4 },
    bathrooms: { min: 3, max: 5 },
    area: { min: 1950, max: 2950, unit: "sq ft" },
    propertyType: "Townhouse",
    buildingInfo: "Illustrative two-storey townhouse",
    listingType: "sale",
    tenure: "Sample: freehold",
    completionDate: "Sample: 2028",
    constructionStatus: "Illustrative sample only",
    paymentPlan: "Not applicable — fictional sample",
    amenities: ["Private garden", "Walking trails", "Community pool", "Children's play area", "Park-side setting (sample)"],
    summary: "Illustrative sample only—not a real building or available home. Every specification and price shown here is fictional and is included to demonstrate the property page layout.",
  },
].map((sample): PropertyRecord => ({
  ...sample,
  illustrative: true,
  pricingSources: [],
  priceCheckedAt: null,
  sources: [],
  priceVerifiedAt: null,
  collectedAt: "2026-10-15",
  verifiedAt: null,
  status: "draft",
  sourceUrl: "https://example.invalid/illustrative-sample",
  images: [],
  videos: [],
}));

export type LocationRecord = {
  slug: string;
  name: string;
  status: "source-location" | "directory-only";
  sourceUrl: string | null;
};

export const properties = [...(propertyRecords as PropertyRecord[]), ...illustrativeSamples];
export const locations = locationRecords as LocationRecord[];

export const getPublishableMedia = (property: PropertyRecord): PropertyMedia[] =>
  [
    ...property.images.map((image) => ({ ...image, type: "image" as const })),
    ...property.videos.map((video) => ({ ...video, type: "video" as const })),
  ]
    .filter((media) =>
      media.permissionStatus === "authorized" &&
      (media.verificationStatus === "verified" || media.illustrative === true) &&
      media.downloadStatus !== "failed"
    )
    .sort((a, b) => a.sequence - b.sequence);

export const getMediaAvailabilityMessage = (property: PropertyRecord) => {
  const images = property.images.length;
  const videos = property.videos.length;
  const references = [
    images ? `${images} image reference${images === 1 ? "" : "s"}` : null,
    videos ? `${videos} video reference${videos === 1 ? "" : "s"}` : null,
  ].filter(Boolean);
  if (!references.length) return "No property media has been collected.";
  return `${references.join(" and ")} found; reuse permission is not confirmed, so the media is not displayed.`;
};

export const formatPrice = (property: PropertyRecord) => {
  const { min, max, currency } = property.price;
  if (min == null && max == null) return "Price on request";
  if (!currency) return "Price currency not verified";
  const format = (amount: number) =>
    new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  if (min != null && max != null && min !== max) return `${format(min)} – ${format(max)}`;
  return format(min ?? max!);
};

export const formatPriceSource = (price: Pick<PricingSource, "min" | "max" | "currency">) => {
  const format = (amount: number) =>
    new Intl.NumberFormat("en", { style: "currency", currency: price.currency, maximumFractionDigits: 0 }).format(amount);
  if (price.min != null && price.max != null && price.min !== price.max) return `${format(price.min)} – ${format(price.max)}`;
  return format(price.min ?? price.max ?? 0);
};

export const getPrimaryPricingSource = (property: PropertyRecord) =>
  property.pricingSources.find((source) => source.type === "available-units") ??
  property.pricingSources.find((source) => source.type === "project-range") ??
  null;

export const getProperty = (slug: string) => properties.find((property) => property.slug === slug);
