# ADR-002. Grocery data strategy

**Status:** Proposed on 2026-10-11. Not accepted. Depends on gate G-1.
**Evidence:** [data-sources.md](../specs/data-sources.md) and [data-source-matrix.md](../docs/research/data-source-matrix.md).

## Context

The product must show real grocery deals in a commercial web app. Public pages were read on 2026-10-11. No feed was licensed, sampled, or called. Unofficial scrapers exist and are not a strategy.

The launch story is Canada-wide and phased. The data strategy is the reverse order: one verified area first, then more areas only when the same gates pass.

## Decision

### DEC-DAT-001. Authorized snapshots or no basket

User-facing prices come from stored snapshots with `licence_status = authorized`. The product will not scrape retailer sites, will not call unofficial scraper APIs, and will not treat a public flyer page as permission to copy it.

### DEC-DAT-002. Prices and identity may be different sources

A product database can supply names, barcodes, and ingredients. A price feed supplies money, place, and time. One source does not have to do both. A product record never fills in a missing price.

### DEC-DAT-003. Averages are context

Statistics Canada monthly average prices may be shown as attributed context after the open-licence conditions are implemented. They are not line prices and not savings baselines (DEC-OPT-002).

### DEC-DAT-004. No eligibility, no member price

Until a licensed loyalty integration exists, member and coupon prices are stored only as excluded evidence. The MVP does not connect loyalty accounts.

### Preferred order of price access

1. A direct agreement with a banner or its authorized data partner for the pilot stores (SRC-006).
2. A Flipp or similar licence that explicitly covers this product's storage and display, if the grant is broader than "retailers building their own flyer experience" (SRC-005). This is unconfirmed.
3. For weekly flyers, an AI read of the retailer's own flyer page, if the rights review allows storage and display (SRC-007). See below. This path has not been tested.
4. Stop, and keep the app on fixtures for internal development (FR-025).

Open product data (SRC-002) is a candidate for identity only, after the share-alike review (DAT-OQ-002). Open Prices (SRC-003) stays out of the guaranteed total until a sample proves coverage and rights.

### Weekly flyers read from the retailer page

**Direction, recorded 2026-10-11. Not tested. Pending validation.**

Weekly flyers do not require a separate price-extraction API. The candidate method is to open the official flyer page for the user's store or postal code and have the model read the flyer the site is showing. The model turns that page into structured candidates: product name, price, package size, multi-buy terms, dates, and conditions.

This is a reading step, not a licence and not a verified price.

- The page URL, retrieval time, and the flyer region or store are stored with every candidate.
- A price enters the guaranteed total only after it is checked against that page and passes the same provenance rules as any other offer. A model guess is not evidence.
- If the flyer omits a validity end, package size, or condition, the candidate stays `uncertain`.
- Unit prices, totals, eligibility, and savings stay in deterministic code.
- Reading a public flyer page does not by itself allow commercial reuse. SRC-007 stays blocked until that review passes (DAT-OQ-009).
- Unofficial scraper APIs remain out of the strategy.

## Source selection criteria

A source can be marked `authorized` only when every row passes:

| Criterion | Rule |
| --- | --- |
| Right holder | Named organization and the contract or public licence URL on file |
| Permitted use | Storage, display to end users, and comparison in a commercial service are allowed |
| Images | Not required. Excluded unless a separate right is recorded |
| Geography | A sample lists real pilot stores or postal codes the project checked |
| Identity | GTIN or a stable source SKU on the sampled offers |
| Pack size | Parseable for the reference basket's packaged goods, or explicitly catch-weight |
| Price | Integer cents after ingest, currency CAD |
| Time | `observed_at` plus a validity window for promotions |
| Conditions | Membership, quantity, and limits preserved, not dropped |
| Refresh | Contractual or observed SLA recorded. DAT-A-002 is only a default |
| Cost | Quoted cost accepted for the pilot |
| Sample | At least one full refresh inspected by the project. A vendor brochure is not a sample |

## Licensing requirements

- The checklist in [data-sources.md](../specs/data-sources.md) is completed and stored outside the client bundle.
- Statistics Canada attribution is implemented before any average is shown.
- Open Food Facts attribution and share-alike are reviewed before any OFF row is stored beside a retailer price.
- Partner tokens follow [privacy-security.md](../specs/privacy-security.md).
- A licence for one banner does not cover another banner.
- This ADR does not record any completed checklist.

## Freshness and coverage thresholds

**Assumption DAT-A-003.** The pilot reference basket is 25 staple needs defined in the feasibility study, not invented in this ADR. The threshold is a launch rule:

| Measure | Proposed threshold | Status |
| --- | --- | --- |
| Needs in the reference basket with a current authorized price | 80% | Assumption. Change at G-1 if the licensor's catalog cannot support it. Below the threshold, the region stays disabled (SM-008). |
| Promotion rows with both `valid_from` and `valid_to` | 100% of rows that enter the guaranteed total | Required. Others stay `uncertain`. |
| Shelf observations newer than the stale window | 100% of regular prices in the guaranteed total | Required. Default window 72 hours (DAT-A-002), assumption. |
| Sample audit match versus snapshot | 95% hypothesis (SM-001) | Measured from phase 5. A single unexplained mismatch blocks G-5 until fixed. |

Coverage is measured per enabled region. A strong sample in one city does not enable another city.

## Fallback options

Specified in [data-sources.md](../specs/data-sources.md). Short form:

1. Still-valid snapshot.
2. Gap in the basket, with no estimated price.
3. A second authorized source, with conflicts marked uncertain.
4. Product identity from an authorized product database.
5. Attributed StatCan context, isolated from totals.
6. Coverage gate.

An unofficial scraper API is not a fallback. A model reading of an official weekly flyer is the SRC-007 candidate above. Its output is not a fallback price until the rights review and the page check both pass.

## Retailer rollout

| Stage | Enabled geography |
| --- | --- |
| Now | None |
| After G-1 | The stores or postal codes in the sample, named in `coverage_region` |
| Later | Additional regions only after the same sample and rights checks |

Banner families in the data-source document are a feasibility checklist. They are not enabled retailers.

## Unresolved feasibility questions

| ID | Question |
| --- | --- |
| DAT-OQ-001 | Will Flipp or a banner license this product, and for which geography? |
| DAT-OQ-002 | Can Open Food Facts data sit in the same database as closed price data under ODbL? |
| DAT-OQ-003 | Is 72 hours the right shelf-price window? |
| DAT-OQ-004 | Which loyalty rules exist in the pilot, once a banner is known? |
| DAT-OQ-005 | What is the reference basket? |
| DAT-OQ-006 | How are zone-level flyer prices labeled versus store-level shelf prices? |
| DAT-OQ-007 | Does the first licence allow caching for the plan-hash audit, and for how long? |
| DAT-OQ-008 | Are French source strings required for the first region (NFR-007)? |
| DAT-OQ-009 | Do the weekly-flyer terms for the pilot banners allow an AI read of the official flyer page to be stored and shown in this product? |

## Consequences

- The pilot can be small and still honest.
- Schedule depends on a third party. That is accepted.
- Internal demos use synthetic data and say so.
- Building an unofficial scraper, or enabling an AI flyer reader before DAT-OQ-009 passes, violates this ADR. After that review, a weekly-flyer reader may store only candidates that were checked against the official page.

## Decision

Proposed. The implementation default until G-1 is: schema and fixtures only, zero live retailer connectors.
