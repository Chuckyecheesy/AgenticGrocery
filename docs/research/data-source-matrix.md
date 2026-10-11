# Data-source matrix

**Status:** Research notes, 2026-10-11
**Method:** Public web search and public pages. No API calls, no accounts, no store samples, no legal review.
**How to read this:** "Reported" means a public page said it. "Not validated" means this project did not test it. Costs that were not published are "not published", not zero.

Strategy that uses these notes: [ADR-002](../../adr/002-grocery-data-strategy.md).

## Summary

| ID | Candidate | Role | Geographic coverage found | Licence as read | Freshness found | Cost found | Validation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SRC-001 | Statistics Canada table 18-10-0245-01 | Context averages | Canada, provinces, some population centres. Not stores. | Open licence, commercial use with attribution | Monthly. Page snippet listed release 2026-10-07. | No fee stated for the open table | Not validated beyond the public pages |
| SRC-002 | Open Food Facts products | Identity and attributes | Contributor-submitted, Canada subset exists | ODbL, DbCL, CC BY-SA images | Contributor edits. No grocery SLA. | No fee. Rate limits apply. | Not validated |
| SRC-003 | Open Prices | Crowd price observations | Not measured | Not confirmed in this pass | Observation dates exist in the API docs | No fee found | Not validated. Not a pilot price source. |
| SRC-004 | GS1 Canada ECCnet | Product registry for subscribers | Canada trading partners named in marketing | Subscriber / trading partner | "Perpetually updated" in marketing. No SLA measured. | Not published. Contact required. | Not validated |
| SRC-005 | Flipp FlyerKit | Partner flyer API | Postal-code parameter documented. Retailer list not granted to us. | Partner token from a Flipp contact. No self-serve signup. | Validity and availability dates documented. | Not published | Not validated. Not authorized for this product. |
| SRC-006 | Direct retailer agreement | Shelf and promo prices | Unknown until a partner answers | None on file | Unknown | Unknown | Not started |
| SRC-007 | Retailer public websites | What shoppers see | Banner-specific, unverified | Not granted by this research | Unknown | n/a | Rights blocked for copying |
| SRC-008 | Unofficial scraper APIs | Copies of retailer sites | Claims vary by vendor | No right for this product | Vendor claims, untested | Vendor price lists exist and were not adopted | Rejected |

## SRC-001 Statistics Canada monthly average retail prices

| Field | Note |
| --- | --- |
| Candidate | Table 18-10-0245-01, Monthly average retail prices for selected products. Also the Food Price Data Hub. |
| Retailer and geographic coverage | Canada, provinces and territories as the table geography allows, plus population-centre breakdowns where published. Not a named store. The hub text says prices come from transaction data of grocery retailers and are current dollars. |
| Available data fields | Product category, geography, reference month, average price. The hub snippet on 2026-10-11 showed August 2026 national examples such as milk 2 litres at $5.49 and eggs 1 dozen at $4.83. Those are category averages, not an offer. Statistics Canada cautions that mix and quality changes limit comparisons over time and across provinces. |
| Access method | Web Data Service JSON, full-table CSV/ZIP, and SDMX, as described on Statistics Canada's developer tips page. |
| Licensing status | [Statistics Canada Open Licence](https://www.statcan.gc.ca/en/terms-conditions/open-licence): worldwide, royalty-free, including commercial use, with required source attribution. Adapted products must not imply endorsement. The FAQ says postal products are outside the open licence. |
| Price and promotion freshness | Monthly averages. Not weekly flyers. Not valid-from/valid-to promotions. |
| Estimated cost | No fee found for the published table. Traffic cost is our own. |
| Validation status | `research_only`. Endpoints were not called by this project. |
| Known limitations | Cannot price a basket, cannot prove a deal, cannot be a savings baseline. |

Sources: [table](https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1810024501), [developer tips](https://www.statcan.gc.ca/en/developers/tips), [Food Price Data Hub](https://www.statcan.gc.ca/en/topics-start/food-price), [open licence](https://www.statcan.gc.ca/en/terms-conditions/open-licence).

## SRC-002 Open Food Facts product database

| Field | Note |
| --- | --- |
| Candidate | Open Food Facts, including the Canada site. |
| Retailer and geographic coverage | Products contributors have added, filterable by country tag. Not a store locator. Completeness for Canadian grocery aisles was not measured. |
| Available data fields | Barcode, name, brand, ingredients, nutrients, allergens, categories, images. Contributor fields vary by product. |
| Access method | Read API `GET /api/v2/product/{code}` and search. Bulk CSV, JSONL, and Parquet exports are the documented path for large reads. Writes require an account. |
| Licensing status | Database: Open Database License. Contents: Database Contents License. Images: CC BY-SA, with a warning that some graphics may have other rights. Share-alike is an open legal question for a mixed commercial database (DAT-OQ-002). |
| Price and promotion freshness | This product database is not a price feed. |
| Estimated cost | No plan fee found. Documented rate limits: 15 product reads per minute per IP, 10 searches per minute per IP. A custom User-Agent is requested. Bulk files avoid using the API as a dump. |
| Validation status | `research_only`. No product was fetched. |
| Known limitations | Missing products, uneven attributes, image rights, share-alike, rate limits. Silence on an allergen is not a safety claim. |

Sources: [Canada data page](https://ca.openfoodfacts.org/data), [API introduction](https://openfoodfacts.github.io/openfoodfacts-server/api/).

## SRC-003 Open Prices

| Field | Note |
| --- | --- |
| Candidate | Open Food Facts Open Prices, documented at `prices.openfoodfacts.org`. |
| Retailer and geographic coverage | Crowd-sourced locations, including OpenStreetMap ids. Canadian density was not counted. |
| Available data fields | Reported by secondary API documentation: product code, price, currency, location, date, proof, discount flags. Treat the field list as reported, not certified. |
| Access method | HTTP API under `/api/v1/prices`. Not called. |
| Licensing status | Not confirmed against the Open Prices terms in this pass. Do not assume the product-database ODbL automatically covers prices. |
| Price and promotion freshness | Each row has an observation date if the documented schema is accurate. No moderation SLA was reviewed. |
| Estimated cost | No fee found. |
| Validation status | `research_only`. Unfit for guaranteed totals until a sample and a licence read exist. |
| Known limitations | Sparse coverage, proof quality, lag, possible mismatch with current shelf prices, unresolved licence. |

Sources: [Open Food Facts API introduction](https://openfoodfacts.github.io/openfoodfacts-server/api/) for the product API limits; Open Prices field notes came from public API documentation indexed on 2026-10-11, including the prices history reference. A direct terms fetch for Open Prices is still **pending**.

## SRC-004 GS1 Canada ECCnet

| Field | Note |
| --- | --- |
| Candidate | ECCnet Registry, Item Centre, ECCnet Content API. |
| Retailer and geographic coverage | GS1 Canada marketing says the registry connects suppliers with Canadian retailers including Sobeys, Loblaw, Metro, Walmart Canada, and Costco. That is a trading-partner claim, not a store-count measurement. |
| Available data fields | GTINs, listing attributes, bilingual content, images, and nutrition content where the relevant module is used. This pass did not find consumer shelf prices in the public GS1 Canada description. |
| Access method | Subscription. Content API registration is described as email to `info@gs1ca.org` or phone. Not contacted. |
| Licensing status | Subscriber and trading-partner terms. Not open data. |
| Price and promotion freshness | Not a deal feed based on the pages read. |
| Estimated cost | Not published on the pages retrieved. |
| Validation status | `research_only`. |
| Known limitations | May be unavailable to a consumer application that is not a trading partner. Even with access, it may not contain promotions. |

Sources: [ECCnet Registry](https://gs1ca.org/new-item-setup/eccnet-registry/), [Content Access](https://gs1ca.org/content-access/), [Grocery checklist](https://gs1ca.org/grocery/checklist/).

## SRC-005 Flipp FlyerKit

| Field | Note |
| --- | --- |
| Candidate | FlyerKit API, versions described publicly up to v4.0. |
| Retailer and geographic coverage | Documentation transcribed by a third-party catalog says publications can be queried by merchant identifier and Canadian postal code, and that a store-near-postal-code operation exists. The merchant list available to a token is partner-specific. This project has no token and no merchant list. |
| Available data fields | Reported: publications, validity dates, availability dates, pages, categories, products, coupons matched on a product, nearby stores. Confirm against Flipp's own document before any build. |
| Access method | `access_token` query parameter issued by a Flipp technical contact. The catalog records no developer portal and no self-service signup. `developer.flipp.com` was reported as nonexistent. |
| Licensing status | Partner entitlement. A retailer using FlyerKit on its own site is not this product. No contract is in place. Status for implementation: not authorized. |
| Price and promotion freshness | Validity dates are part of the documented publication model. Actual update lag was not measured. The catalog reported no published rate limit. |
| Estimated cost | Not published. Catalog review of Flipp's platform pages found partnership contact forms and no rate card. |
| Validation status | `research_only`. The live API was not called. A third-party note that an unauthenticated sample returned HTTP 422 is not our test. |
| Known limitations | Token scope unknown. Query-string tokens are a logging risk if ever used (see privacy controls). French locales are mentioned in the transcribed docs (`en-CA`, `fr-CA`) and were not tested. |

Sources: Flipp's documentation URL as cited by the catalog, `https://api.flipp.com/flyerkit/v4.0/documentation`, summarized via [APIs.io FlyerKit](https://apis.io/apis/flipp-wishabi/flipp-flyerkit-api/) and the linked API Evangelist OpenAPI transcription. Prefer Flipp's own page when a person repeats this review.

## SRC-006 Direct retailer or e-commerce agreement

| Field | Note |
| --- | --- |
| Candidate | A contract with Loblaw, Empire / Voilà, Metro, Walmart Canada, or another banner, or with a data partner they name. |
| Retailer and geographic coverage | Not known. Banner names to ask about are listed in [data-sources.md](../../specs/data-sources.md). |
| Available data fields | Unknown until a data dictionary is provided. The product needs the field list in ADR-002. |
| Access method | Not started. Supplier content portals (for example Salsify's PC Express content flow) are for product content submission, not for this app to read consumer prices. |
| Licensing status | None. |
| Price and promotion freshness | Unknown. |
| Estimated cost | Unknown. |
| Validation status | `not_reviewed` commercially. No email was sent. |
| Known limitations | Sales cycles may be longer than a software spike. A single banner would still be a valid pilot if the UI says so (RD-OQ-003). |

Public consumer flyer pages, such as Metro's flyer, show that shoppers can view weekly flyers. They do not show a developer licence. Example observed in search: `https://www.metro.ca/en/flyer/`.

## SRC-007 Retailer public websites

| Field | Note |
| --- | --- |
| Candidate | Loblaw banner sites, PC Express, Voilà, Metro, Walmart Canada, and similar. |
| Retailer and geographic coverage | Each site covers its own banners. This project did not map postal codes. |
| Available data fields | Whatever the site shows a shopper. Undocumented JSON used by those sites is still the retailer's data. |
| Access method | Browser. Automated access was not attempted and is not approved. |
| Licensing status | `rights_blocked` for this product until a counsel review of the specific terms says otherwise. Visibility is not a licence. |
| Price and promotion freshness | Not measured. |
| Estimated cost | Not a permitted integration, so cost is not estimated. |
| Validation status | Not tested. Do not describe this project as having called retailer endpoints. |
| Known limitations | Terms of use, copyright in flyer creative, image rights, blocking, and schema changes. Reverse-engineered endpoints in blog posts and unofficial clients are not a specification. |

## SRC-008 Unofficial third-party scrapers

| Field | Note |
| --- | --- |
| Candidate | Hosted actors and APIs advertised to scrape Canadian grocery sites or flyer aggregators. Examples appeared in search results for Loblaw banners, Voilà, and multi-chain flyer deals. Names are omitted here so this file is not an integration guide. |
| Retailer and geographic coverage | Vendors claim multi-banner or postal-code coverage. Those claims were not tested. One vendor page stated that Loblaw publishes no public pricing API. That statement matches this project's finding that no official public price API was identified. |
| Available data fields | Vendors advertise shelf price, sale price, unit price, store, and sometimes loyalty labels. |
| Access method | Paid third-party HTTP APIs that collect from retailer sites. |
| Licensing status | `rights_blocked`. A scraper subscription does not create a right for Agentic Grocery to display the data. Vendor pages reviewed place terms-of-use compliance on the caller. |
| Price and promotion freshness | Vendor claims such as live or weekly data. Not measured. |
| Estimated cost | At least one vendor page advertised a per-thousand-product price. The figure is not repeated here because this source is rejected and the price was not verified by a purchase. |
| Validation status | Rejected for the MVP. Not called. |
| Known limitations | Legal and contractual exposure, schema breakage, incomplete loyalty eligibility, and conflict with DEC-DAT-001. |

## Loyalty and coupon sources

No loyalty API was reviewed. The matrix does not treat these as available:

| Program | What is known from general marketing knowledge | Validation |
| --- | --- | --- |
| PC Optimum | Widely marketed with Loblaw banners. Member prices require a member. | Rules and API not read. Eligibility cannot be assumed. |
| Scene+ | Widely marketed with Empire banners. | Rules and API not read. |
| Metro loyalty | Program name and rules were not confirmed on 2026-10-11. | Open. |
| Personalized coupons | Exist inside retailer accounts. | Out of MVP. Not requested. |

## Retailer coverage checklist

Use this in the G-1 sample. Every cell starts unchecked.

| Banner family | Example banners to confirm | Official price API found | Licensed feed | Sample postal codes tested |
| --- | --- | --- | --- | --- |
| Loblaw | Loblaws, No Frills, Real Canadian Superstore, Provigo, Maxi, Zehrs, Fortinos, Independent, Atlantic Superstore, Wholesale Club, T&T | No | No | None |
| Empire | Sobeys, Safeway, FreshCo, IGA, Foodland, Farm Boy, Longo's, Thrifty Foods, Voilà | No | No | None |
| Metro | Metro, Food Basics, Super C, Adonis | No | No | None |
| Walmart Canada | Walmart | No | No | None |
| Costco Canada | Costco | No | No | None |
| Western and other | Save-On-Foods, Co-op, Giant Tiger | No | No | None |

Corporate ownership of a banner, especially IGA, can vary by region. Confirm the operator before a contract. Store counts are intentionally absent.

## Research still pending

| Item | Why it is pending |
| --- | --- |
| Open Prices licence page | Not fetched as a primary terms document |
| Flipp's own documentation HTML | Relied on a third-party transcription of the v4.0 docs |
| Any retailer developer terms | Not collected; do not guess from memory |
| StatCan WDS call for a known vector | Would prove access, still would not prove a deal feed |
| Open Food Facts Canada product count | Would be a live query; not required to reject it as a price source |
| Counsel review | Not a web research task |

## Research conclusion

The only source with a clearly readable open licence that this pass identified is Statistics Canada average prices, and those averages cannot run the product. Open Food Facts is a possible identity source with share-alike risk. Every real price path still needs a licence and a sample. Until that sample exists, coverage of Canadian grocers in this product is none.
