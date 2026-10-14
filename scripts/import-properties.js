import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(root, "src", "data", "properties.json");
const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const fetchIndex = args.indexOf("--fetch");
const fetchUrls = fetchIndex < 0 ? [] : args.slice(fetchIndex + 1).filter((arg) => !arg.startsWith("--"));
const positional = args.filter((arg, index) => arg !== "--check" && arg !== "--fetch" && !arg.startsWith("--") && (fetchIndex < 0 || index < fetchIndex));
const inputPath = positional[0] ? path.resolve(process.cwd(), positional[0]) : outputPath;
const timeoutMs = 12_000;
const maxAttempts = 2;
const today = new Date().toISOString().slice(0, 10);

const fail = (message) => {
  console.error(`Property import failed: ${message}`);
  process.exitCode = 1;
};

const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const isNullableNumber = (value) => value === null || (typeof value === "number" && Number.isFinite(value) && value >= 0);
const isHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && !url.username && !url.password;
  } catch {
    return false;
  }
};
const stableSlug = (name) => name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const validDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
};
const emptyValue = (value) => value == null || value === "" || (Array.isArray(value) && value.length === 0);

const normalizeImage = (image, where) => {
  if (!isRecord(image)) throw new Error(`${where} needs a complete image manifest entry.`);
  const validLocalPath = typeof image.url === "string" &&
    image.url.startsWith("/images/properties/") &&
    !decodeURIComponent(image.url).split("/").includes("..");
  if (typeof image.id !== "string" || !image.id.trim() ||
      !(isHttpUrl(image.url) || validLocalPath) || !isHttpUrl(image.sourcePage) ||
      typeof image.alt !== "string" || !image.alt.trim() || typeof image.sequence !== "number" || !Number.isInteger(image.sequence) || image.sequence < 0 ||
      !(image.caption === null || typeof image.caption === "string") ||
      !["not-downloaded", "downloaded", "failed"].includes(image.downloadStatus) ||
      !["authorized", "unknown", "not-authorized"].includes(image.permissionStatus) ||
      !["verified", "unverified", "missing"].includes(image.verificationStatus) ||
      (image.illustrative !== undefined && typeof image.illustrative !== "boolean") ||
      (image.illustrative === true && (image.permissionStatus !== "authorized" || image.verificationStatus !== "unverified"))) {
    throw new Error(`${where} needs a complete image manifest entry with explicit permission and verification statuses.`);
  }
  if (validLocalPath && image.downloadStatus !== "downloaded") {
    throw new Error(`${where} is a local image path and must have downloadStatus "downloaded".`);
  }
  if (validLocalPath && !existsSync(path.join(root, "public", image.url.slice(1)))) {
    throw new Error(`${where} points to a missing local image file: public${image.url}`);
  }
  return image;
};

const normalizeVideo = (video, where) => {
  if (!isRecord(video)) throw new Error(`${where} needs a complete video manifest entry.`);
  const validLocalPath = typeof video.url === "string" &&
    video.url.startsWith("/videos/properties/") &&
    !decodeURIComponent(video.url).split("/").includes("..");
  if (typeof video.id !== "string" || !video.id.trim() ||
      !(isHttpUrl(video.url) || validLocalPath) || !isHttpUrl(video.sourcePage) ||
      typeof video.alt !== "string" || !video.alt.trim() || typeof video.sequence !== "number" || !Number.isInteger(video.sequence) || video.sequence < 0 ||
      !(video.caption === null || typeof video.caption === "string") ||
      !["not-downloaded", "downloaded", "failed"].includes(video.downloadStatus) ||
      !["authorized", "unknown", "not-authorized"].includes(video.permissionStatus) ||
      !["verified", "unverified", "missing"].includes(video.verificationStatus) ||
      (video.illustrative !== undefined && typeof video.illustrative !== "boolean") ||
      (video.illustrative === true && (video.permissionStatus !== "authorized" || video.verificationStatus !== "unverified"))) {
    throw new Error(`${where} needs a complete video manifest entry with explicit permission and verification statuses.`);
  }
  if (validLocalPath && video.downloadStatus !== "downloaded") {
    throw new Error(`${where} is a local video path and must have downloadStatus "downloaded".`);
  }
  if (validLocalPath && !existsSync(path.join(root, "public", video.url.slice(1)))) {
    throw new Error(`${where} points to a missing local video file: public${video.url}`);
  }
  return video;
};

const validateRecords = (records) => {
  if (!Array.isArray(records)) throw new Error("Input must be a JSON array of property records.");
  const ids = new Set();
  const slugs = new Set();
  const normalized = records.map((record, index) => {
    const where = `record ${index + 1}`;
    if (!isRecord(record)) throw new Error(`${where} must be an object.`);
    if (typeof record.name !== "string" || !record.name.trim()) throw new Error(`${where} needs a name.`);
    if (!isRecord(record.location) || !["city", "community", "country"].every((key) => typeof record.location[key] === "string" && record.location[key].trim())) {
      throw new Error(`${where} needs location.city, location.community and location.country.`);
    }
    if (!isRecord(record.price) || ![record.price.min, record.price.max].every(isNullableNumber)) throw new Error(`${where} price.min and price.max must be non-negative numbers or null.`);
    if ((record.price.min !== null || record.price.max !== null) && (typeof record.price.currency !== "string" || !/^[A-Z]{3}$/.test(record.price.currency))) {
      throw new Error(`${where} needs a valid original currency when a price is recorded.`);
    }
    if (record.price.min !== null && record.price.max !== null && record.price.min > record.price.max) throw new Error(`${where} has a minimum price above its maximum.`);
    for (const group of ["bedrooms", "bathrooms", "area"]) {
      if (!isRecord(record[group]) || !isNullableNumber(record[group].min) || !isNullableNumber(record[group].max)) throw new Error(`${where} needs valid nullable ${group} bounds.`);
      if (record[group].min !== null && record[group].max !== null && record[group].min > record[group].max) throw new Error(`${where} has invalid ${group} bounds.`);
    }
    const slug = stableSlug(record.slug || record.name);
    const id = typeof record.id === "string" && record.id.trim() ? record.id.trim() : slug;
    if (!slug) throw new Error(`${where} name cannot produce a stable slug.`);
    if (ids.has(id)) throw new Error(`Duplicate property id "${id}".`);
    if (slugs.has(slug)) throw new Error(`Duplicate property slug "${slug}".`);
    ids.add(id);
    slugs.add(slug);
    if (!["sale", "rent"].includes(record.listingType)) throw new Error(`${where} listingType must be "sale" or "rent".`);
    if (!["unverified", "verified", "draft"].includes(record.status)) throw new Error(`${where} status must be unverified, verified or draft.`);
    if (!isHttpUrl(record.sourceUrl)) throw new Error(`${where} needs a valid http(s) sourceUrl.`);
    if (!validDate(record.collectedAt)) throw new Error(`${where} collectedAt must use YYYY-MM-DD.`);
    if (record.verifiedAt !== null && !validDate(record.verifiedAt)) throw new Error(`${where} verifiedAt must be a date or null.`);
    if (record.priceVerifiedAt != null && !validDate(record.priceVerifiedAt)) throw new Error(`${where} priceVerifiedAt must be a date or null.`);
    if (record.priceCheckedAt != null && !validDate(record.priceCheckedAt)) throw new Error(`${where} priceCheckedAt must be a date or null.`);
    if (!Array.isArray(record.amenities) || !record.amenities.every((value) => typeof value === "string")) throw new Error(`${where} amenities must be an array of strings.`);
    const pricingSources = record.pricingSources ?? [];
    if (!Array.isArray(pricingSources) || !pricingSources.every((source) =>
      isRecord(source) &&
      ["project-range", "available-units", "unit-asking"].includes(source.type) &&
      typeof source.label === "string" &&
      [source.min, source.max].every(isNullableNumber) &&
      (source.min !== null || source.max !== null) &&
      (source.min === null || source.max === null || source.min <= source.max) &&
      typeof source.currency === "string" && /^[A-Z]{3}$/.test(source.currency) &&
      isHttpUrl(source.sourceUrl) && validDate(source.checkedAt) && typeof source.note === "string"
    )) throw new Error(`${where} pricingSources must contain typed, dated, source-linked prices.`);
    const sources = record.sources ?? [];
    if (!Array.isArray(sources) || !sources.every((source) =>
      isRecord(source) && typeof source.label === "string" && isHttpUrl(source.url) &&
      validDate(source.checkedAt) && typeof source.note === "string"
    )) throw new Error(`${where} sources must contain dated source references.`);
    if (!Array.isArray(record.images)) throw new Error(`${where} images must be an array.`);
    const imageUrls = new Set();
    const imageIds = new Set();
    const images = record.images.map((image, imageIndex) => {
      const entry = normalizeImage(image, `${where}, image ${imageIndex + 1}`);
      if (imageUrls.has(entry.url)) throw new Error(`${where} contains duplicate image URL "${entry.url}".`);
      if (imageIds.has(entry.id)) throw new Error(`${where} contains duplicate image id "${entry.id}".`);
      imageUrls.add(entry.url);
      imageIds.add(entry.id);
      return entry;
    });
    const videosInput = record.videos ?? [];
    if (!Array.isArray(videosInput)) throw new Error(`${where} videos must be an array.`);
    const videoUrls = new Set();
    const videoIds = new Set();
    const videos = videosInput.map((video, videoIndex) => {
      const entry = normalizeVideo(video, `${where}, video ${videoIndex + 1}`);
      if (videoUrls.has(entry.url)) throw new Error(`${where} contains duplicate video URL "${entry.url}".`);
      if (videoIds.has(entry.id)) throw new Error(`${where} contains duplicate video id "${entry.id}".`);
      videoUrls.add(entry.url);
      videoIds.add(entry.id);
      return entry;
    });
    return {
      ...record,
      id,
      slug,
      buildingInfo: record.buildingInfo ?? null,
      priceVerifiedAt: record.priceVerifiedAt ?? null,
      priceCheckedAt: record.priceCheckedAt ?? null,
      propertyType: record.propertyType ?? null,
      developerId: record.developerId ?? null,
      developerProfileUrl: record.developerProfileUrl ?? null,
      pricingSources,
      priceCheckedAt: record.priceCheckedAt ?? null,
      sources,
      images,
      videos,
    };
  });
  return normalized;
};

const preserveKnownValues = (previous, incoming) => {
  if (!isRecord(previous) || !isRecord(incoming)) return incoming;
  const merged = { ...incoming };
  for (const [key, value] of Object.entries(previous)) {
    if (key === "images" || key === "videos" || key === "pricingSources" || key === "sources") continue;
    if (emptyValue(merged[key]) && !emptyValue(value)) merged[key] = value;
    else if (isRecord(value) && isRecord(merged[key])) merged[key] = preserveKnownValues(value, merged[key]);
  }
  const images = new Map((previous.images ?? []).map((image) => [image.url, image]));
  for (const image of incoming.images ?? []) {
    if (!images.has(image.url)) images.set(image.url, image);
  }
  merged.images = [...images.values()].sort((a, b) => a.sequence - b.sequence);
  const videos = new Map((previous.videos ?? []).map((video) => [video.url, video]));
  for (const video of incoming.videos ?? []) {
    if (!videos.has(video.url)) videos.set(video.url, video);
  }
  merged.videos = [...videos.values()].sort((a, b) => a.sequence - b.sequence);
  for (const key of ["pricingSources", "sources"]) {
    const entries = new Map((previous[key] ?? []).map((entry) => [key === "pricingSources" ? `${entry.type}:${entry.sourceUrl}` : entry.url, entry]));
    for (const entry of incoming[key] ?? []) {
      const entryKey = key === "pricingSources" ? `${entry.type}:${entry.sourceUrl}` : entry.url;
      entries.set(entryKey, { ...(entries.get(entryKey) ?? {}), ...entry });
    }
    merged[key] = [...entries.values()];
  }
  return merged;
};

const decodeHtml = (text) => text
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
  .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const htmlToText = (html) => decodeHtml(html
  .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
  .replace(/<!--[\s\S]*?-->/g, " ")
  .replace(/<[^>]*>/g, " "))
  .replace(/\s+/g, " ")
  .trim();

const extractPublishedFacts = (html, sourceUrl) => {
  const text = htmlToText(html);
  const facts = {};
  const range = (field) => {
    const match = text.match(new RegExp(`\\b${field}:\\s*(\\d+)\\s*[-–]\\s*(\\d+)`, "i"));
    return match ? { min: Number(match[1]), max: Number(match[2]) } : null;
  };
  const beds = range("Beds");
  const baths = range("Baths");
  const tenure = text.match(/\bTenure:\s*(Freehold|Leasehold)\b/i)?.[1];
  const completionDate = text.match(/\bCompletion Date:\s*(\d{4})\b/i)?.[1] ?? null;
  const buildingInfo = text.match(/\b(G\+\d+\s*Storey(?:s)?|\d+\s*storeys?)\b/i)?.[1] ?? null;
  const priceMatch = text.match(/\bPrice\s+From\s+(AED|USD|[$€£])\s*([\d,]+)\s*[-–]\s*(?:(AED|USD|[$€£])\s*)?([\d,]+)/i);
  let price = null;
  if (priceMatch) {
    const currencyToken = priceMatch[1].toUpperCase();
    const currency = currencyToken === "$" ? "USD" : currencyToken === "€" ? "EUR" : currencyToken === "£" ? "GBP" : currencyToken;
    const min = Number(priceMatch[2].replaceAll(",", ""));
    const max = Number(priceMatch[4].replaceAll(",", ""));
    if (Number.isFinite(min) && Number.isFinite(max) && min <= max) {
      price = {
        type: "project-range",
        label: "Published project price range",
        min,
        max,
        currency,
        sourceUrl,
        checkedAt: today,
        note: `Price range displayed by the source page on ${today}; confirm current availability directly.`,
      };
    }
  }
  const propertyType = text.match(/\bProperty Type:\s*(Residential Apartments Building|Residential Apartments|Apartments|Villas?)\b/i)?.[1] ?? null;
  return {
    facts: {
      ...(beds ? { bedrooms: beds } : {}),
      ...(baths ? { bathrooms: baths } : {}),
      ...(tenure ? { tenure } : {}),
      ...(completionDate ? { completionDate } : {}),
      ...(buildingInfo ? { buildingInfo } : {}),
      ...(propertyType ? { propertyType } : {}),
    },
    price,
  };
};

const parseAttributes = (text) => {
  const attributes = {};
  for (const match of text.matchAll(/([^\s"'<>/=]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    attributes[match[1].toLowerCase()] = decodeHtml(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return attributes;
};

const pageImages = (html, sourceUrl, propertyId, propertyName) => {
  const candidates = new Set();
  const listingNumber = new URL(sourceUrl).pathname.match(/-(\d+)\/?$/)?.[1];
  for (const match of html.matchAll(/<meta\b([^>]+)>/gi)) {
    const attrs = parseAttributes(match[1]);
    if (["og:image", "og:image:url", "twitter:image"].includes((attrs.property ?? attrs.name ?? "").toLowerCase())) {
      candidates.add(attrs.content);
    }
  }
  for (const match of html.matchAll(/<img\b([^>]+)>/gi)) {
    const attrs = parseAttributes(match[1]);
    const src = attrs.src ?? attrs["data-src"] ?? attrs["data-original"];
    const context = `${src ?? ""} ${attrs.alt ?? ""} ${attrs.class ?? ""}`.toLowerCase();
    if (src && !/(logo|icon|avatar|sprite|pixel|tracking|placeholder)/.test(context)) candidates.add(src);
    if (!/(logo|icon|avatar|sprite|pixel|tracking|placeholder)/.test(context)) {
      for (const candidate of (attrs.srcset ?? "").split(",")) {
        const responsiveUrl = candidate.trim().split(/\s+/)[0];
        if (responsiveUrl) candidates.add(responsiveUrl);
      }
    }
  }
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
    const structured = JSON.parse(decodeHtml(match[1]));
    const collect = (value) => {
      if (Array.isArray(value)) {
        value.forEach(collect);
      } else if (isRecord(value)) {
        const image = value.image;
        if (typeof image === "string") candidates.add(image);
        else if (Array.isArray(image)) image.forEach((entry) => {
          if (typeof entry === "string") candidates.add(entry);
          else if (isRecord(entry) && typeof entry.url === "string") candidates.add(entry.url);
        });
        else if (isRecord(image) && typeof image.url === "string") candidates.add(image.url);
        if (Array.isArray(value["@graph"])) collect(value["@graph"]);
      }
    };
    collect(structured);
    } catch {
    console.warn(`  Ignored malformed structured-data block on ${sourceUrl}.`);
    }
  }
  const images = [];
  const seenUrls = new Set();
  for (const rawUrl of candidates) {
    try {
      const url = new URL(rawUrl, sourceUrl);
      if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) continue;
      const imageUrl = url.toString();
      if (/facebook\.com\/tr|\/assets\/|\.svg(?:$|\?)|tracking|pixel|analytics/i.test(imageUrl)) continue;
      if (/\/storage\/developers\//i.test(url.pathname)) continue;
      if (/\/storage\/floor[_-]?plans?\//i.test(url.pathname)) continue;
      const imageListingNumber = url.pathname.match(/\/storage\/properties\/(\d+)\/photos\//i)?.[1];
      if (listingNumber && imageListingNumber && listingNumber !== imageListingNumber) continue;
      if (seenUrls.has(imageUrl)) continue;
      seenUrls.add(imageUrl);
      const id = createHash("sha256").update(`${propertyId}\n${imageUrl}`).digest("hex").slice(0, 16);
      const attrs = [...html.matchAll(/<img\b([^>]+)>/gi)]
        .map((match) => parseAttributes(match[1]))
        .find((attrs) => {
          try { return new URL(attrs.src ?? attrs["data-src"] ?? attrs["data-original"], sourceUrl).toString() === imageUrl; }
          catch { return false; }
        });
      images.push({
        id,
        url: imageUrl,
        sourcePage: sourceUrl,
        caption: null,
        alt: attrs?.alt?.trim() || `${propertyName} image`,
        sequence: images.length,
        downloadStatus: "not-downloaded",
        permissionStatus: "unknown",
        verificationStatus: "unverified",
      });
    } catch {
      continue;
    }
  }
  return images;
};

const pageVideos = (html, sourceUrl, propertyId, propertyName) => {
  const videos = [];
  const seenUrls = new Set();
  for (const match of html.matchAll(/<video\b([^>]*)>([\s\S]*?)<\/video>/gi)) {
    const videoAttrs = parseAttributes(match[1]);
    const sources = [videoAttrs.src, videoAttrs["data-src"]];
    for (const sourceMatch of match[2].matchAll(/<source\b([^>]*)>/gi)) {
      const sourceAttrs = parseAttributes(sourceMatch[1]);
      const sourceType = sourceAttrs.type?.toLowerCase();
      if (sourceType && !sourceType.startsWith("video/")) continue;
      sources.push(sourceAttrs.src, sourceAttrs["data-src"]);
    }
    for (const rawUrl of sources.filter(Boolean)) {
      try {
        const url = new URL(rawUrl, sourceUrl);
        if (!["http:", "https:"].includes(url.protocol) || url.username || url.password ||
            !/\.mp4(?:$|\?)/i.test(`${url.pathname}${url.search}`)) continue;
        const videoUrl = url.toString();
        if (seenUrls.has(videoUrl)) continue;
        seenUrls.add(videoUrl);
        const id = createHash("sha256").update(`${propertyId}\n${videoUrl}`).digest("hex").slice(0, 16);
        videos.push({
          id,
          url: videoUrl,
          sourcePage: sourceUrl,
          caption: null,
          alt: videoAttrs["aria-label"]?.trim() || videoAttrs.title?.trim() || `${propertyName} video`,
          sequence: videos.length,
          downloadStatus: "not-downloaded",
          permissionStatus: "unknown",
          verificationStatus: "unverified",
        });
      } catch {
        continue;
      }
    }
  }
  return videos;
};

const timeoutSignal = () => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return { signal: controller.signal, clear: () => clearTimeout(timer) };
};

const fetchText = async (url, { redirects = 0, respectRobots = false } = {}) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const timeout = timeoutSignal();
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "AureviaPropertyImporter/1.0 (manual research; contact site owner for data corrections)", Accept: "text/html,text/plain,*/*;q=0.1" },
        signal: timeout.signal,
        redirect: "manual",
      });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        if (redirects >= 4) throw new Error("Too many redirects.");
        const location = response.headers.get("location");
        if (!location) throw new Error(`Redirect ${response.status} has no Location header.`);
        const targetUrl = new URL(location, url).toString();
        if (respectRobots) await checkRobots(targetUrl);
        return fetchText(targetUrl, { redirects: redirects + 1, respectRobots });
      }
      if (!response.ok) {
        if (response.status >= 500 && attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 300));
          continue;
        }
        throw new Error(`HTTP ${response.status}`);
      }
      return { text: await response.text(), contentType: response.headers.get("content-type") ?? "" };
    } catch (error) {
      if (attempt === maxAttempts || (error instanceof Error && /^HTTP [45]\d\d/.test(error.message))) throw error;
      await new Promise((resolve) => setTimeout(resolve, 300));
    } finally {
      timeout.clear();
    }
  }
  throw new Error("Request failed after the allowed attempts.");
};

const robotsRules = new Map();
const checkRobots = async (url) => {
  const parsed = new URL(url);
  const origin = parsed.origin;
  if (!robotsRules.has(origin)) {
    try {
      const { text } = await fetchText(`${origin}/robots.txt`);
      const rules = [];
      let applies = false;
      for (const line of text.split(/\r?\n/)) {
        const trimmed = line.replace(/#.*$/, "").trim();
        const separator = trimmed.indexOf(":");
        if (separator < 0) continue;
        const key = trimmed.slice(0, separator).trim().toLowerCase();
        const value = trimmed.slice(separator + 1).trim();
        if (key === "user-agent") applies = value === "*";
        else if (applies && (key === "allow" || key === "disallow") && value) rules.push({ allow: key === "allow", path: value });
      }
      robotsRules.set(origin, rules);
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes("HTTP 404")) {
        throw new Error(`Could not read ${origin}/robots.txt: ${error instanceof Error ? error.message : String(error)}`);
      }
      robotsRules.set(origin, []);
    }
  }
  const pathToCheck = `${parsed.pathname}${parsed.search}`;
  const matching = robotsRules.get(origin)
    .filter((rule) => pathToCheck.startsWith(rule.path))
    .sort((a, b) => b.path.length - a.path.length);
  if (matching[0]?.allow === false) throw new Error(`Blocked by ${origin}/robots.txt: ${pathToCheck}`);
};

let currentRecords = [];

const fetchListing = async (url, records) => {
  if (!isHttpUrl(url)) throw new Error(`Invalid listing URL: ${url}`);
  const existing = records.find((record) => record.sourceUrl === url || record.sources.some((source) => source.url === url));
  if (!existing) throw new Error(`No existing property record references ${url}. Add it to a property's sources before fetching a new source.`);
  const response = await fetchText(url, { respectRobots: true });
  if (!response.contentType.includes("html")) throw new Error(`${url} returned non-HTML content (${response.contentType || "unknown content type"}).`);
  const discovered = pageImages(response.text, url, existing.id, existing.name);
  const additions = discovered.filter((image) => !existing.images.some((known) => known.url === image.url));
  const discoveredVideos = pageVideos(response.text, url, existing.id, existing.name);
  const videoAdditions = discoveredVideos.filter((video) => !existing.videos.some((known) => known.url === video.url));
  const extracted = extractPublishedFacts(response.text, url);
  const pricingSources = [...(existing.pricingSources ?? [])];
  if (extracted.price) {
    const existingPrice = pricingSources.find((price) => price.type === extracted.price.type && price.sourceUrl === url);
    if (existingPrice && (existingPrice.min !== extracted.price.min || existingPrice.max !== extracted.price.max || existingPrice.currency !== extracted.price.currency)) {
      console.warn(`  Published project price changed from ${existingPrice.currency} ${existingPrice.min}–${existingPrice.max} to ${extracted.price.currency} ${extracted.price.min}–${extracted.price.max}.`);
    }
    const priceIndex = pricingSources.findIndex((price) => price.type === extracted.price.type && price.sourceUrl === url);
    if (priceIndex < 0) pricingSources.push(extracted.price);
    else pricingSources[priceIndex] = { ...pricingSources[priceIndex], ...extracted.price };
  }
  const sourceNote = [
    extracted.price ? `Published ${extracted.price.currency} project range ${extracted.price.min}–${extracted.price.max}` : null,
    extracted.facts.bedrooms ? `${extracted.facts.bedrooms.min}–${extracted.facts.bedrooms.max} bedrooms` : null,
    extracted.facts.bathrooms ? `${extracted.facts.bathrooms.min}–${extracted.facts.bathrooms.max} bathrooms` : null,
    extracted.facts.tenure ?? null,
    extracted.facts.completionDate ? `completion ${extracted.facts.completionDate}` : null,
    extracted.facts.buildingInfo ?? null,
    additions.length ? `${additions.length} new image reference(s)` : null,
    videoAdditions.length ? `${videoAdditions.length} new video reference(s)` : null,
  ].filter(Boolean).join("; ");
  const sources = [...(existing.sources ?? [])];
  if (sourceNote || !sources.some((source) => source.url === url)) {
    const reference = sources.find((source) => source.url === url);
    const nextReference = {
      label: reference?.label ?? new URL(url).hostname.replace(/^www\./, ""),
      url,
      checkedAt: today,
      note: sourceNote || "Project page checked; no supported facts or new media references were extracted.",
    };
    const sourceIndex = sources.findIndex((source) => source.url === url);
    if (sourceIndex < 0) sources.push(nextReference);
    else sources[sourceIndex] = nextReference;
  }
  const updated = {
    ...existing,
    collectedAt: today,
    ...Object.fromEntries(Object.entries(extracted.facts).filter(([key]) => emptyValue(existing[key]))),
    price: (existing.price.min == null && existing.price.max == null && extracted.price)
      ? { min: extracted.price.min, max: extracted.price.max, currency: extracted.price.currency, basis: extracted.price.label }
      : existing.price,
    priceCheckedAt: existing.priceCheckedAt ?? (extracted.price ? today : null),
    pricingSources,
    sources,
    images: [...existing.images, ...additions].map((image, index) => ({ ...image, sequence: index })),
    videos: [...existing.videos, ...videoAdditions].map((video, index) => ({ ...video, sequence: index })),
  };
  const title = response.text.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]*>/g, "").trim();
  const usable = [...updated.images, ...updated.videos].filter((media) => media.permissionStatus === "authorized" && media.verificationStatus === "verified").length;
  console.log(`${existing.name}: fetched page${title ? ` "${decodeHtml(title)}"` : ""}; ${additions.length} new image reference(s), ${videoAdditions.length} new video reference(s), ${usable} media item(s) approved and verified for display.`);
  if (additions.length || videoAdditions.length) console.log(`  Captured media references remain hidden: reuse permission and property attribution have not been verified.`);
  else console.log(`  No new media references found; no replacement media was generated or substituted.`);
  if (additions.length) console.log(`  Sample reference(s): ${additions.slice(0, 3).map((image) => image.url).join(" | ")}`);
  if (videoAdditions.length) console.log(`  Video reference(s): ${videoAdditions.map((video) => video.url).join(" | ")}`);
  if (sourceNote) console.log(`  Source facts found: ${sourceNote}.`);
  console.log(`  Automated extraction does not mark prices, listing details, or media verified. Review the source and rights before publishing.`);
  return updated;
};

try {
  if (args.includes("--help")) {
    console.log([
      "Usage:",
      "  npm run data:import -- --check",
      "  npm run data:import -- path\\to\\authorized-properties.json [--check]",
      "  npm run data:import -- --fetch <listing-url> [<listing-url> ...] [--check]",
      "",
      "Fetch mode checks robots.txt, reads public HTML only, and records image references as permission unknown / unverified.",
      "It never downloads images or promotes scraped content to verified/publishable status.",
    ].join("\n"));
  } else if (fetchIndex >= 0) {
    if (!fetchUrls.length) throw new Error("--fetch requires one or more listing URLs.");
    currentRecords = validateRecords(JSON.parse(await readFile(outputPath, "utf8")));
    let updatedRecords = currentRecords;
    for (const url of fetchUrls) {
      await checkRobots(url);
      const fetched = await fetchListing(url, updatedRecords);
      updatedRecords = updatedRecords.map((record) => record.id === fetched.id ? fetched : record);
    }
    validateRecords(updatedRecords);
    if (checkOnly) console.log("Check only: no files changed.");
    else {
      await writeFile(outputPath, `${JSON.stringify(updatedRecords, null, 2)}\n`, "utf8");
      console.log(`Updated ${path.relative(root, outputPath)} without replacing previously recorded facts or authorized images.`);
    }
  } else {
    const raw = await readFile(inputPath, "utf8");
    const incoming = validateRecords(JSON.parse(raw));
    const existing = inputPath === outputPath ? [] : validateRecords(JSON.parse(await readFile(outputPath, "utf8")));
    const byId = new Map(existing.map((record) => [record.id, record]));
    for (const record of incoming) {
      const previous = byId.get(record.id);
      byId.set(record.id, previous ? preserveKnownValues(previous, record) : record);
    }
    const merged = validateRecords([...byId.values()]);
    if (checkOnly) {
      console.log(`Validated ${incoming.length} property record(s) from ${inputPath}. No files changed.`);
    } else {
      await writeFile(outputPath, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
      console.log(`Imported ${incoming.length} property record(s) into ${path.relative(root, outputPath)}; existing records and known facts were preserved.`);
    }
  }
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
