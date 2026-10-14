import propertyRecords from "./properties.json";
import developerRecords from "./developers.json";
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
  developerId: string | null;
  tenure: string | null;
  completionDate: string | null;
  constructionStatus: string | null;
  paymentPlan: string | null;
  amenities: string[];
  images: PropertyImage[];
  videos: PropertyVideo[];
  summary: string;
  sourceUrl: string;
  developerProfileUrl: string | null;
  collectedAt: string;
  verifiedAt: string | null;
  priceVerifiedAt: string | null;
  status: "unverified" | "verified" | "draft";
};

export type DeveloperRecord = {
  id: string;
  name: string;
  website: string | null;
  overview: string | null;
  sourceUrl: string | null;
  additionalSources?: { label: string; url: string; checkedAt: string }[];
};

export type LocationRecord = {
  slug: string;
  name: string;
  status: "source-location" | "directory-only";
  sourceUrl: string | null;
};

export const properties = propertyRecords as PropertyRecord[];
export const developers = developerRecords as DeveloperRecord[];
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
