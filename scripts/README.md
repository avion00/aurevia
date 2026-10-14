# Property data import

The current property catalog is a local JSON MVP in `src/data/properties.json`. The importer supports two workflows: validate/upsert a curated JSON file, or inspect public HTML for image and video references on a property already in the catalog. It does not download third-party media, bypass access controls, or decide whether media may be republished.

```sh
npm run data:import -- --check
npm run data:import -- path\to\curated-properties.json
npm run data:import -- --fetch https://example.com/property/example
npm run data:import -- --fetch https://example.com/property/one https://example.com/property/two --check
```

`--check` validates without writing. JSON imports are upserts: existing records are retained, and an empty incoming field does not erase an existing value or image manifest entry. IDs and lowercase slugs must be unique; prices, currencies, numeric ranges, dates, source URLs and image manifest entries are validated. Deleting or changing a previously collected asset requires an intentional edit to `src/data/properties.json`.

Fetch mode checks the source's `robots.txt`, follows only a small number of redirects, uses request timeouts and a limited retry for server/network failures, and extracts visible source-labelled project price ranges, bedroom/bathroom ranges, tenure, completion date, building form, and public image/video references. The URL must match the property's primary source URL or one of its `sources` entries. It appends prices as source-specific records, never converts currencies, preserves a different primary/availability price, and does not overwrite non-empty structured facts. The command logs page access failures, extracted fields and newly found media references. If automated access is unavailable or blocked, use the curated JSON workflow.

Every collected image reference is stored in `images` as a manifest entry. Video references use the parallel `videos` manifest. Automatically found references are always saved with `permissionStatus: "unknown"`, `verificationStatus: "unverified"` and `downloadStatus: "not-downloaded"`. These entries are deliberately hidden on the site. The importer never labels public media as authorized merely because it is accessible, never downloads media, and never substitutes generated or unrelated stock imagery.

To publish an image, first check the rights holder's license or obtain permission and verify that the image actually depicts the matching development. Add a manifest entry with:

```json
{
  "id": "stable-image-id",
  "url": "/images/properties/riva-residence/exterior-01.jpg",
  "sourcePage": "https://source.example/property/riva-residence",
  "caption": null,
  "alt": "Riva Residence exterior",
  "sequence": 0,
  "downloadStatus": "downloaded",
  "permissionStatus": "authorized",
  "verificationStatus": "verified"
}
```

Local files must be placed under `public/images/properties/`; their public paths start with `/images/properties/`. Authorized remote URLs are accepted only when the rights holder permits remote use. A photo is displayed only when both permission and development verification are explicit. Unknown, unauthorized, missing or failed images remain visible only in the data manifest and are not used as substitutes.

Authorized video files may be stored under `public/videos/properties/` and referenced from `videos` with `/videos/properties/...` paths. Video entries use the same permission, verification, source attribution, caption, sequence and download-status fields; only authorized and verified videos are shown. The property gallery combines publishable photos and videos with thumbnail navigation, native video controls and an image lightbox.

For explicitly illustrative demo media, set `illustrative: true`, keep `verificationStatus: "unverified"`, and provide an accurate caption and alt text that state the media is not from the development. This permits rights-cleared generic demo media to display without claiming it depicts the property; the detail gallery and listing card visibly mark it as illustrative.

The current records were checked against their linked sources on 2026-10-14. Destination by LeadingRE publishes a USD project range and core specifications for both developments. Riva Residence also has a separate AED availability range from Impala Real Estate; the record keeps that current released-unit range distinct from the LeadingRE USD project range and records Impala's stated 2026-10-08 availability check. These are source-published claims, not guaranteed offers, and availability should be reconfirmed.

The accessible galleries exposed 19 Riva and 23 Timber Terrace image references from property-specific paths. The official Vakson project pages expose two Riva MP4 references (59,869,783 and 343,496,282 bytes) and two Timber Terrace MP4 references (both 11,150,272 bytes); equal size does not establish duplicate content. Each distinct video URL returned HTTP 200 with `video/mp4`, and each appears in the relevant project's page markup. Those official references remain hidden because the source sites do not grant reuse permission. To populate the demo, the catalog separately uses 12 locally stored Unsplash images per property under the [Unsplash License](https://unsplash.com/license), plus the locally stored Pexels video [The building where the apartment is located](https://www.pexels.com/video/the-building-where-the-apartment-is-located-16235833/) by HUAHIN PILOT LAND & REAL ESTATE DRONER under the [Pexels License](https://www.pexels.com/license/). Every demo asset is explicitly labeled illustrative and unverified as project photography; neither gallery represents these as actual Riva or Timber Terrace media. `src/data/developers.json` records the source-named Vakson association; the precise developer naming differs between the listing sources. The location directory includes both source-backed locations and directory-only entries; directory entries do not imply available listings.

The fetcher's supported field patterns are intentionally conservative. Review important source changes before publication, and use a curated JSON update when a page presents facts in a different or ambiguous format. Prices are never inferred or currency-converted by the importer.

## Future database and admin

The UI consumes typed property, developer and location records from `src/data/properties.ts`. A future API/database can replace that adapter without putting listing data in page components. Before adding publishing/admin features, configure authentication, image storage with rights review, server-side validation, audit history and a protected API. No private credentials belong in the frontend.
