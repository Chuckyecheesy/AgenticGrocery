# Data sources

**Status:** Draft for specification review
**Updated:** 2026-10-11
**Research method:** Public web pages retrieved on 2026-10-11. No API was called, no contract was requested, and no store sample was counted.

Candidate-level notes are in [data-source-matrix.md](../docs/research/data-source-matrix.md). Selection rules are in [ADR-002](../adr/002-grocery-data-strategy.md). Product behavior is FR-009, FR-010, FR-020, and FR-024.

## What the product needs from a source

| Need | Used for | Can a national average satisfy it? |
| --- | --- | --- |
| Store identity and service area | Discovery and the coverage gate | No |
| Sellable variant, package size, identifier | Matching and unit price | No |
| Current regular price at a store or banner area | Basket total and savings baseline | No |
| Promotion price, window, and conditions | Deals | No |
| Coupon or loyalty conditions | Eligibility (FR-022) | No |
| Product attributes (brand, ingredients, allergens) | Hard constraints and named quality attributes | Partly, from a product database |
| Category-level average price | Labeled context only | Yes, with attribution |

A pilot requires an authorized source for the first three price rows in at least one geographic area. Product attributes can come from a separate authorized product database. Average prices cannot fill in a missing shelf price.

## Candidate Canadian sources

Detailed evidence and links: [matrix](../docs/research/data-source-matrix.md).

| ID | Candidate | Role it could play | Pilot price source? |
| --- | --- | --- | --- |
| SRC-001 | Statistics Canada table 18-10-0245-01, monthly average retail prices | Labeled national or provincial context | No |
| SRC-002 | Open Food Facts product database | Names, brands, ingredients, barcodes where contributors added them | No |
| SRC-003 | Open Food Facts Open Prices | Crowd-sourced price observations | Not until coverage, freshness, and licence are validated |
| SRC-004 | GS1 Canada ECCnet and Content API | Licensed product identity and attributes for subscribers | No prices found in this research |
| SRC-005 | Flipp FlyerKit | Structured circulars for a partner token, including postal-code lookup as documented for retailers | Only if Flipp grants this product a licence. Not assumed. |
| SRC-006 | Direct data agreement with a banner or its e-commerce operator | Store-level prices and promotions | Preferred path. No agreement exists. |
| SRC-007 | Public retailer websites and flyer pages | What a shopper can see in a browser | Not a granted API. Commercial reuse is not assumed. |
| SRC-008 | Unofficial scrapers and reseller APIs | Observed third-party products that copy retailer sites | Not eligible |

### Retailer and regional coverage

Canada-wide coverage is a rollout aim, not a current data fact. Banner footprints below are **commonly marketed identities**, listed so the feasibility work has a checklist. This project has not verified store counts, postal-code coverage, or which banners share a price file.

| Operator family | Banners to confirm in feasibility | Coverage note |
| --- | --- | --- |
| Loblaw Companies | Loblaws, Real Canadian Superstore, No Frills, Zehrs, Fortinos, Your Independent Grocer, Provigo, Maxi, Atlantic Superstore, Wholesale Club, T&T | Often described as national through different banners. Store-level truth is unverified here. PC Express is the online shopping brand; supplier content tools are not a price API for this product. |
| Empire | Sobeys, Safeway, FreshCo, Foodland, IGA (where Empire operates it), Farm Boy, Longo's, Thrifty Foods | Voilà is Empire's online grocery service. A third-party scraper described regional catalogues. That description is not a licence and not a coverage test. |
| Metro Inc. | Metro, Food Basics, Super C, Adonis | Metro publishes a consumer flyer page. A public page is not an API grant. |
| Walmart Canada | Walmart supercentres and other formats that sell groceries | National presence is well known. Grocery assortment by store is unverified here. |
| Costco Canada | Costco warehouses | Membership pricing is not a general public price. Treat as a later, separate eligibility problem. |
| Others to inventory | Save-On-Foods, Co-op, Giant Tiger, regional independents | Expected gaps until a licensed source names them. |

**Assumption DAT-A-001.** The first pilot will cover one metro area and the banners that the first authorized feed actually includes. It will not claim the operator families above as available.

Loyalty programs marketed alongside these banners include PC Optimum (Loblaw) and Scene+ (Empire). Metro's loyalty program name and rules were not confirmed in this pass. Member prices stay out of totals until FR-022 eligibility is true. No loyalty API was reviewed.

## Public, licensed, and authenticated data

| Class | Meaning for this product | Examples from the research pass |
| --- | --- | --- |
| Public open data | Published with a licence that allows the intended use, subject to attribution or share-alike | Statistics Canada Open Licence for SRC-001. Open Food Facts ODbL for SRC-002. |
| Licensed partner data | Available under a contract, token, or subscriber relationship | Flipp FlyerKit tokens issued by a Flipp contact (SRC-005). GS1 Canada subscriber access (SRC-004). A future retailer agreement (SRC-006). |
| Authenticated user data | Available only in a signed-in shopper's own session | Loyalty offer wallets, personalized coupons. Out of MVP scope to connect. |
| Public on a website | Visible to a browser, copyright and terms still apply | Retailer flyer pages (SRC-007). Visibility is not permission to copy into this product. |
| Unofficial copy | A third party collected the data without this project reviewing a right to reuse it | Scraper APIs (SRC-008). |

Connector records store the class. Only `authorized` records, which require the open-data conditions to be met or a licence to be on file, can feed a user-facing plan (FR-009).

## Freshness and reliability

| Source type | What this research established | What it did not |
| --- | --- | --- |
| SRC-001 | Monthly table. The table page shown in search results listed a release date of 2026-10-07. Statistics Canada warns that average prices are affected by product mix and are a weak comparison over time or across provinces. | Not a weekly deal feed. |
| SRC-002 | Product records change as contributors edit them. The API is rate limited (15 product reads per minute per IP, 10 searches per minute per IP) and asks for a custom User-Agent. | No service level for grocery completeness in Canada. |
| SRC-003 | Separate crowd-sourced price project with observation dates. | Canadian density, moderation delay, and fitness for a basket were not measured. |
| SRC-005 | FlyerKit documentation, as transcribed by a third-party catalog, describes publication validity dates and availability dates. | Latency, retailer completeness, and whether a non-retailer may obtain a token. |
| SRC-006 | Nothing measured. | Entirely pending a partner. |

Proposed product rules, to confirm with whatever source is licensed:

- A promotion is `current` only when the current time is inside its validity window and the snapshot is inside the source refresh SLA.
- A price with no validity end is `uncertain` and stays out of the guaranteed total (FR-019).
- **Assumption DAT-A-002.** Shelf prices without a promotion window are stale after 72 hours. Flyer snapshots are refreshed at least daily during a pilot. Both numbers are review items, not measured source guarantees.

## Usage rights and licensing checks

Before a connector is enabled outside local synthetic tests, the feasibility checklist in ADR-002 is complete:

1. The right holder is identified.
2. The licence or open terms allow storage, comparison, and display to our users in a commercial service.
3. Attribution, share-alike, and redistribution duties are written down.
4. Images are either excluded or separately licensed. Product photos are unnecessary for the MVP.
5. The terms do not forbid automated access, if the access method is automated.
6. Counsel or a responsible owner signs the checklist. This specification does not record that signature.

Known duties from the public terms read on 2026-10-11:

- **Statistics Canada Open Licence** allows commercial use with required attribution. Adapted material must not be presented as a Statistics Canada endorsement. Postal products are outside that open licence statement. Source: [Statistics Canada Open Licence](https://www.statcan.gc.ca/en/terms-conditions/open-licence).
- **Open Food Facts** database is under the Open Database License; contents under the Database Contents License; images under CC BY-SA. Share-alike may conflict with keeping a mixed proprietary price database closed. Legal review is required before OFF rows are merged with retailer data. Source: [ca.openfoodfacts.org/data](https://ca.openfoodfacts.org/data) and the [API introduction](https://openfoodfacts.github.io/openfoodfacts-server/api/).
- **Flipp FlyerKit** access, as described in the transcribed v4.0 documentation, is a partner token from a Flipp technical contact. There is no public price list and no self-service signup. A token for retailers to power their own sites is not a token for this product.
- **GS1 Canada** describes ECCnet as a subscriber and trading-partner registry. Content API registration is via GS1 Canada. No public price sheet was found.

## Loyalty and coupon limitations

- A member price is a different price type from the shelf price. It enters the guaranteed total only when the user is eligible under the source conditions (FR-022).
- The MVP does not connect loyalty accounts, so eligibility is `not_established`. The UI can say that a source mentioned a member price and that it was not applied.
- Coupon conditions that must be modeled when a licensed feed includes them: geography, dates, minimum quantity or spend, item identifiers, one-time use, membership, and stackability. Missing conditions mean the coupon is not applied.
- Personalized offers that exist only inside a retailer's logged-in session are not available to the MVP.
- The product never describes a coupon as available to the user when eligibility is `not_established` or `ineligible`.

## Source evaluation methodology

Each candidate is scored on evidence, not on reputation:

| Criterion | Pass condition |
| --- | --- |
| Rights | Checklist above is signed for the intended use. |
| Geography | The feed lists the pilot postal codes or stores, demonstrated with a sample, not a national slogan. |
| Fields | Price, identifier or SKU, package size, store or area, observation time, and validity window are present for the sample. |
| Freshness | Refresh meets DAT-A-002 or a better contractual SLA. |
| Coverage | Share of a fixed reference basket with a current price meets the ADR-002 threshold in the pilot area. |
| Cost | Licence and traffic cost fit the MVP budget. Unknown cost is a fail for pilot launch, not a fail for continued negotiation. |
| Reliability | A two-week sample shows error rate and schema stability acceptable for FR-020. |
| Independence | The project can store a snapshot and explain it later. A UI that only deep-links out, with no stored price, cannot support a guaranteed total. |

Status values: `not_reviewed`, `research_only`, `sample_failed`, `rights_blocked`, `authorized`.

On 2026-10-11 every candidate is `research_only` or, for SRC-007 and SRC-008, `rights_blocked` for implementation purposes until a review says otherwise. None is `authorized`. None has been integration-tested by this project.

## Fallback strategies

When the preferred price feed is missing, the product does the following, in order:

1. Serve the plan from the last snapshot that is still inside its validity window, with observation time shown.
2. If the snapshot is expired, omit those lines from the guaranteed total and show the gap (FR-020).
3. Use a second authorized source for the same store and variant if one exists. Conflicting current prices become `uncertain` rather than a silent average.
4. Use SRC-002, once rights are cleared, to identify a product. Do not invent a price from the product record.
5. Show an SRC-001 average only in a clearly labeled context module, with Statistics Canada attribution, and never as the line price or the savings baseline.
6. If the region has no authorized price source, show the coverage gate (FR-024).

The product does not fall back to scraping, to an unofficial scraper API, or to a model-generated price.

Local development falls back to synthetic fixtures that FR-025 forbids in the pilot UI.

## Open questions

| ID | Question |
| --- | --- |
| DAT-OQ-001 | Will any banner or Flipp license a pilot feed to this product, and for which postal codes? |
| DAT-OQ-002 | Does ODbL share-alike rule out mixing Open Food Facts with a closed retailer price table? |
| DAT-OQ-003 | Is the 72-hour shelf-price window (DAT-A-002) acceptable to users and to the first licensor? |
| DAT-OQ-004 | Which loyalty program rules apply in the first pilot region? |
| DAT-OQ-005 | Can the reference basket be defined from public StatCan categories, or does it need a separate household staple list? |
| DAT-OQ-006 | Are flyer prices zone-level while shelf prices are store-level, and how should the UI say that? |
