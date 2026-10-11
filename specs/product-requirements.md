# Product requirements

**Status:** Draft for specification review
**Updated:** 2026-10-11
**Owns:** FR, NFR, HITL, PRV, US, SM identifiers

Related: [user journeys](user-journeys.md), [architecture](architecture.md), [optimization](optimization.md), [privacy and security](privacy-security.md), [acceptance criteria](acceptance-criteria.md), [data strategy](../adr/002-grocery-data-strategy.md).

## Problem statement

Household grocery shopping is repetitive and local. Prices and promotions change by banner, store, and week. Package sizes differ, so the lowest sticker price is often the wrong comparison. Loyalty offers and coupons apply only under conditions the shopper can miss or misread.

A person who wants to restock has to discover which stores are relevant, read flyers, normalize package sizes, respect dietary limits and a budget, and decide whether a substitution is acceptable. That work is slow, and a mistake is a wasted trip or a product the household cannot use.

Existing flyer apps, retailer sites, and loyalty programs each cover part of the task. None of them, in this product's scope, takes a plain-language restock request, uses only authorized data, shows its uncertainty, and hands back a shopping plan a person can approve.

## Product vision

Agentic Grocery is a web assistant for individuals and families in Canada. It helps them restock groceries, find real deals from authorized sources, and compare baskets.

The assistant researches and calculates on its own. It asks the user when a preference is missing, when a trade-off is material, or when the data is too weak to support a recommendation. The user approves the plan. The product does not buy anything.

Launch intent is Canada-wide, delivered as a phased rollout. A region becomes available only after retailer coverage and data rights for that region are verified. See [ADR-002](../adr/002-grocery-data-strategy.md).

**Assumption PRD-A-001.** The first user interface is English. A French interface is a release gate before any Quebec pilot, not a commitment of the first pilot if that pilot is outside Quebec.

## Target users and personas

The target user is an adult buying household groceries for themselves or their family. The product is not a food-service purchasing tool, a retailer pricing desk, or a children's product.

### Persona: Alex, budget-first individual

Alex shops for one or two people, watches the weekly total, and will switch brands when the unit price is better. Alex will not compromise on a stated allergy. Alex wants a short list for one nearby store and a clear statement of what was saved against which regular price.

### Persona: Jordan, family restock

Jordan shops for a household, repeats a familiar set of staples, and has little time to read every flyer. Jordan wants the assistant to remember sizes, brands to avoid, and dietary limits, and to ask before replacing a staple with a different product.

### Persona: Sam, quality-first shopper

Sam will pay more for specific attributes they have named, such as a brand, organic produce, or a higher-welfare label, and still wants to see the cost. Sam does not want the system to invent a quality ranking from price or marketing copy.

## User stories

| ID | Story | Requirements |
| --- | --- | --- |
| US-001 | As a new user, I want to create an account and a household profile so the assistant can remember how I shop. | FR-001, FR-002, FR-003 |
| US-002 | As a user, I want to choose budget, quality, or balanced shopping so recommendations match my priority. | FR-004 |
| US-003 | As a user, I want to refuse device location and enter a postal code so I can still find local options. | FR-005 |
| US-004 | As a user, I want relevant stores identified from authorized data so I am not sent outside the area I named. | FR-006, FR-024 |
| US-005 | As a user, I want to say that I am running out of groceries and have the assistant turn that into a concrete list. | FR-007, FR-008 |
| US-006 | As a user, I want deals researched from sources the product is allowed to use, with dates and conditions visible. | FR-009, FR-010 |
| US-007 | As a user, I want package sizes compared by unit price so a larger pack is not treated as cheaper without evidence. | FR-011 |
| US-008 | As a user, I want my dietary and other hard limits respected on every recommendation. | FR-012, FR-014 |
| US-009 | As a user, I want one optimized plan, then the chance to edit it, before anything is called final. | FR-013, FR-016, FR-017, FR-021 |
| US-010 | As a user, I want savings explained against a stated regular price, and omitted when that price is unknown. | FR-015 |
| US-011 | As a user, I want loyalty and coupon prices used only when I qualify. | FR-022 |
| US-012 | As a user, I want an honest stop when prices cannot be verified, including a way to retry or continue with labeled gaps. | FR-019, FR-020 |
| US-013 | As a user, I want the product to stop at the shopping plan and leave purchase to me. | FR-018 |
| US-014 | As a user, I want to delete my account and household data. | PRV-007 |

## Functional requirements

### FR-001 Account

The web app lets an adult create an account with an email address and sign in again on a later visit. The MVP uses a passwordless email link. The account is the owner of one household.

### FR-002 Household profile

The user can record household size as a number, optional display name, and the shopping preferences in FR-003. The MVP stores one household per account. The product does not collect names or ages of children.

### FR-003 Preference memory

The user can save and later change:

- priority mode (FR-004)
- optional weekly or trip budget in Canadian dollars
- hard constraints: allergens, excluded ingredients, excluded diets, and excluded brands
- soft preferences: preferred brands and named quality attributes
- default store count (one store unless the user enables a multi-store plan)
- staple items and usual quantities

Saved preferences are applied to the next plan. The user can override them for a single plan without deleting the saved values.

### FR-004 Priority mode

The user can select one mode: budget-first, quality-first, or balanced. Definitions and calculations are in [optimization.md](optimization.md). If the selected mode lacks a required input, the run pauses under HITL-002.

### FR-005 Location consent and postal code

Before any location read, the app asks permission in plain language. If the user refuses, or the browser denies the permission, the app asks for a Canadian postal code. The user may enter a postal code even when device location is available. The app accepts a full postal code (`A1A 1A1`). It stores the least precise value the active data source needs. Coordinate retention follows PRV-002.

A postal code that fails the Canadian format check is rejected with a correction prompt. The app does not guess a nearby code.

### FR-006 Store discovery

Given a permitted location or postal code, and an authorized store source for that area, the app lists candidate stores with banner, store name, and the area precision used. The user can pin preferred stores and hide a store. Discovery uses only sources whose licence status is `authorized` for that use. See FR-009 and FR-024.

### FR-007 Restock request

The user can start from a typed request, from saved staples, or from both. The orchestrator extracts needs (item intent, quantity, constraints mentioned in the text) into a structured list the user can see and edit before research is treated as complete.

### FR-008 Clarifying questions

The assistant asks a question when it needs a decision it cannot derive from saved preferences or the request. It does not ask for information it already has and that is still valid. Questions are specific: which constraint is missing, which products are ambiguous, or which trade-off needs a choice. The workflow waits for the answer. See HITL-001 and HITL-002.

### FR-009 Authorized data only

A price, promotion, store, or product attribute shown in a user-facing plan comes from a stored source record with:

- source identifier
- licence status `authorized` for the display and comparison use
- observation timestamp
- applicable start and end when the source provides them
- conditions and eligibility text supplied by the source

The production path rejects records that are synthetic, unlicensed, or scraped under an unreviewed terms-of-use position. Test fixtures may exist in the automated test suite and are not served as live offers. See [ADR-002](../adr/002-grocery-data-strategy.md).

### FR-010 Provenance and freshness

Each offer on a plan shows source name, observation time, validity window, and a freshness state: `current`, `expiring`, `stale`, or `uncertain`. Definitions are in [optimization.md](optimization.md). Stale and uncertain offers are visible as excluded evidence. They are omitted from the guaranteed basket total.

### FR-011 Product identity and unit price

The system stores sellable variants, package size, and identifiers available from the source (GTIN/UPC when present, otherwise the source's own SKU). Unit-price normalization follows [optimization.md](optimization.md). Two offers are ranked by unit price only when their quantity dimension matches (mass, volume, or count).

### FR-012 Hard constraints

Allergens, excluded ingredients, excluded diets, and excluded brands are hard constraints. A candidate that violates one is removed before ranking. The assistant does not suggest it as a substitute. If constraints eliminate every candidate for a need, the plan lists that need as unmet and asks the user how to proceed.

### FR-013 Basket optimization

Given structured needs, eligible offers, the priority mode, and constraints, deterministic code produces a basket: chosen variant, store, quantity, line total, unit price, and reasons. The same inputs produce the same basket. The language model does not choose prices or totals. Algorithm: [optimization.md](optimization.md). Component: `CMP-OPT` in [architecture.md](architecture.md).

### FR-014 Substitutions

A chosen item that is not an exact match to the user's named product is labeled with a substitution class (same identifier and different store, same brand and different size, or different brand within the generic need). Class definitions are in [optimization.md](optimization.md). A substitution that changes brand or quality attributes requires confirmation under HITL-003 before it is part of an approvable plan, unless the user has already allowed that class for that need.

### FR-015 Savings baseline

A savings amount is shown only with the baseline used. The baseline is the in-date regular price for the same variant at the same store, from an authorized source. If that regular price is absent, the line shows the promotional price and does not show a dollar saving. National average prices are not a personal savings baseline. Full rules: [optimization.md](optimization.md).

### FR-016 Plan review

Before approval, the user sees the plan: stores, lines, quantities, package sizes, unit prices, line totals, guaranteed total, excluded uncertain lines, unmet needs, constraints applied, substitutions, savings with baselines, and provenance. The user can see why a lower-priced candidate was rejected when it failed a hard constraint.

### FR-017 Explicit approval

The plan becomes final only after the signed-in user activates an approval control for that plan version. Approval is recorded with user, time, and a hash of the canonical plan contents (lines, prices, quantities, source snapshot identifiers). A model message, a tool payload, or page text cannot set the plan to approved. If underlying source data changes so the hash no longer matches, the previous approval does not apply and the user reviews the new version.

### FR-018 No purchase execution

The approved plan is a list the user can read and copy. The MVP has no checkout, payment, retailer cart handoff, or order placement.

### FR-019 Uncertainty handling

Missing package size, missing validity end, conflicting prices, or failed verification mark the affected offer `uncertain` or `stale` per [optimization.md](optimization.md). The guaranteed total includes only lines that pass the current-offer rules. The review screen states what was left out.

### FR-020 Source failure and partial coverage

If a required source times out or errors, the workflow retries within the limits in [architecture.md](architecture.md), then continues with the authorized evidence it has or stops in a blocked state. The user sees which source failed, whether a retry is available, and which needs have no fresh price. The app does not fill the gap with an estimated price.

### FR-021 Edit before approval

The user can change quantity, remove a line, reject a substitution, switch mode, or change budget on the review screen. Each edit creates a new plan version and runs the deterministic optimizer again. The prior version remains available in the session history until the user leaves or deletes the account.

### FR-022 Coupons and loyalty

A coupon price or member price is included in the guaranteed total only when all source conditions are satisfied and the user's eligibility is `eligible`. Otherwise the offer may be shown as not applied, with the missing condition, and the regular or non-member price is used when that price is current. Linking a loyalty account is out of the MVP until an authorized integration exists (see MVP exclusions). Until then, eligibility is `not_established` and member prices stay out of the total.

### FR-023 Approval and optimization records

The system stores each optimization run's inputs hash, mode, outputs, and the approval record from FR-017. Records support the tests in [acceptance-criteria.md](acceptance-criteria.md) and the deletion rule in PRV-007.

### FR-024 Coverage gate

If the user's location is outside a region with verified, authorized deal coverage, the app says the service is not available there yet and does not present a basket as shopable. Manual exploration of saved preferences is still allowed. The available-region list is configuration backed by the coverage review in [ADR-002](../adr/002-grocery-data-strategy.md), not a hardcoded claim of Canada-wide coverage.

### FR-025 Synthetic data isolation

Illustrative prices may appear in specifications and automated tests. The pilot and production interfaces serve an offer only when its source licence status is `authorized` and its environment flag is live. A test fixture identifier cannot pass that check.

## Non-functional requirements

| ID | Requirement |
| --- | --- |
| NFR-001 | Currency amounts used in totals are integer Canadian cents. Unit-price comparison uses exact rational arithmetic as specified in [optimization.md](optimization.md). Binary floating point is not used for money. |
| NFR-002 | Unit-price, promotion eligibility, tax-exclusion, constraint, and savings behavior have automated tests. The cases in [optimization.md](optimization.md) are the minimum set. |
| NFR-003 | A source outage degrades research (FR-020). It does not prevent sign-in, profile edits, or reading a previously approved plan. |
| NFR-004 | Each plan run has a workflow identifier present on logs for orchestration steps, source calls, optimizer runs, and approval. Logs omit email, raw location coordinates, loyalty identifiers, and full prompt bodies. |
| NFR-005 | **Target, not a measured SLA:** with healthy sources, a typical restock of up to 25 needs reaches a reviewable plan within three minutes. This number is an estimate to validate in the proof of concept. |
| NFR-006 | The web UI meets WCAG 2.2 AA for the onboarding, request, review, and approval flows. This is a build requirement, not a claim of an audit. |
| NFR-007 | A Quebec pilot requires a French user interface and French presentation of source text the product displays. English-only builds stay outside Quebec. |
| NFR-008 | Each plan has a configurable cap on model calls and input size. Over-cap runs stop and ask the user to narrow the request. The cap value is set after the model spike in [ADR-001](../adr/001-initial-stack.md). |
| NFR-009 | Repeating an optimizer request with the same inputs hash returns the stored result. Source fetches are idempotent per snapshot key. |
| NFR-010 | Secrets and partner tokens are unavailable to browser code. See [privacy-security.md](privacy-security.md). |
| NFR-011 | The user-facing app states prices as the source stated them. The MVP does not add or remove GST/HST, deposits, or environmental fees unless a later, verified tax table is introduced. The total label says taxes, deposits, and fees are not calculated. |

## MVP scope

### In scope

- Web application for the journeys in [user-journeys.md](user-journeys.md).
- Account, one household, saved preferences, three priority modes.
- Optional device location and manual postal code.
- Store discovery and offer comparison where an authorized source covers the pilot region.
- One orchestrator, modular connectors, deterministic optimization.
- Review, edit, and explicit approval of a shopping plan.
- Provenance, freshness, and source-failure behavior.
- English UI for a non-Quebec pilot, subject to PRD-A-001 and NFR-007.
- Automated tests for the optimization contract.

### Excluded from the MVP

- Checkout, payment, retailer account login for ordering, and order placement.
- Native iOS or Android applications.
- More than one autonomous agent, or any agent that can approve or purchase.
- Pantry sensors, receipt scanning, and automatic household inventory.
- Meal planning and recipes, except as text the user may type into a need.
- Linking PC Optimum, Scene+, or any other loyalty account.
- Applying member-only or coupon prices without eligibility (FR-022).
- Tax, deposit, and fee calculation (NFR-011).
- Travel-time or fuel-cost optimization. Distance may be shown only when an authorized source supplies it, as a label, not as a dollar saving.
- Public launch outside regions that pass the coverage gate (FR-024).
- French UI, until a Quebec pilot is scheduled (NFR-007).
- Scraping, unofficial price APIs, and use of retailer images without rights. See [data-sources.md](data-sources.md).

## Human-in-the-loop requirements

The orchestrator pauses in the `needs_input` state. It resumes from stored workflow state after the user answers. It does not continue with a guessed answer.

| ID | Pause and ask when |
| --- | --- |
| HITL-001 | The request names a product that maps to more than one form the household has not disambiguated (for example milk with no fat content, when that choice changes the candidates). |
| HITL-002 | Budget-first mode has no budget and no permission to optimize without a cap; quality-first mode has no named quality attribute; balanced mode is missing either input. |
| HITL-003 | The best feasible candidate is a brand or quality substitution the user has not pre-approved for that need. |
| HITL-004 | A multi-store plan would cover more needs than the best single store, and the user has not enabled multi-store shopping. |
| HITL-005 | Every fresh candidate for a need fails a hard constraint or is unavailable. |
| HITL-006 | The user is about to approve a plan that still contains excluded uncertain lines they might mistake for purchased items. Approval itself is a separate explicit act (FR-017). |
| HITL-007 | Device location is about to be read (FR-005, PRV-001). |
| HITL-008 | Saved preferences conflict with the current request (saved "no pork" versus a request that names pork). The current answer wins for this plan; the assistant asks whether to update the saved preference. |

The assistant proceeds without a question when preferences already answer that point, when the user named the product precisely, and when the only work left is arithmetic, formatting, or retrieval.

## Privacy and safety requirements

Normative privacy requirements are listed here. Controls are in [privacy-security.md](privacy-security.md).

| ID | Requirement |
| --- | --- |
| PRV-001 | Device location is off until the user grants permission for a stated purpose: finding stores and offers near them. Denial still allows a postal code. |
| PRV-002 | The system stores the coarsest location that sources require. Precise coordinates are kept only when the user opts in to save them; otherwise they are used in memory for the request and then discarded. |
| PRV-003 | Account data is limited to email, authentication identifiers, household preferences, optional location, plans, and consent records. The MVP does not collect payment cards, government identifiers, or precise health records. Dietary preferences are household shopping constraints, stored as such. |
| PRV-004 | A user can read the preferences, location values, and plans stored for the household. |
| PRV-005 | Access to household data is limited to that household's members. The MVP has one member, the account owner. |
| PRV-006 | Consent for location and for saving preferences is stored with time and the policy version presented. |
| PRV-007 | The user can delete the account. Deletion removes household, preference, location, plan, and approval records from the application database within 30 days, and removes them from primary stores without undue delay. Backups expire on the provider's backup cycle, which must be documented before pilot. |
| PRV-008 | Partner tokens, database credentials, and model keys are secret-store values. They are not written into the repository, logs, or these specification files. |
| PRV-009 | Retailer and flyer text is untrusted data. It cannot change system instructions, tool permissions, or approval state. |
| PRV-010 | The product gives legal and nutrition information only as copied source attributes with provenance. It does not provide a medical clearance that a product is safe for a condition. |

**Assumption PRD-A-002.** Privacy design follows the principles of limiting collection, identifying purposes, and providing access and deletion. Counsel still needs to review PIPEDA and, before a Quebec launch, Quebec Law 25. This document is not a legal opinion.

## Success metrics

Metrics are evaluated on the pilot population after the coverage gate is open. Targets marked as hypotheses are reviewed after the first pilot month; they are not launch claims.

| ID | Metric | Target |
| --- | --- | --- |
| SM-001 | Share of audited guaranteed-line prices that match the cited source snapshot | 95% or higher in a weekly sample of at least 50 lines, once volume allows. Hypothesis until the sample design is fixed. |
| SM-002 | Hard-constraint violations on approved plans | 0 |
| SM-003 | Approved plans with a matching approval record and plan hash | 100% |
| SM-004 | Median time from a complete request to a reviewable plan, sources healthy, 25 needs or fewer | Under 3 minutes. Hypothesis (NFR-005). |
| SM-005 | Approved plans in which every saving has a baseline, and no ineligible coupon is in the total | 100% |
| SM-006 | Guaranteed totals that include a stale or uncertain line | 0 |
| SM-007 | Model cost per completed plan | At or under the cap set in the ADR-001 spike |
| SM-008 | Share of reference-basket needs with a current authorized price in the pilot region | At or above the coverage threshold in ADR-002 before public pilot |

SM-002, SM-003, SM-005, and SM-006 are release gates. SM-001, SM-004, SM-007, and SM-008 are measured and can block a wider rollout without blocking internal testing.

## Open questions

| ID | Question |
| --- | --- |
| PRD-OQ-001 | Which province or metro area is the first pilot, given where the first authorized feed is actually valid? |
| PRD-OQ-002 | Is English-only acceptable for that first pilot (PRD-A-001)? |
| PRD-OQ-003 | Should a later version support multiple adults in one household? |
| PRD-OQ-004 | What budget period do users expect: one trip, one week, or a month? The data model allows a labeled money cap; the default label is still open. |
| PRD-OQ-005 | Do users need a downloadable or shareable list (plain text, or a retailer app deep link) in the first pilot, or is on-screen review enough? |
| PRD-OQ-006 | Which dietary vocabularies are required at pilot (allergens only, or also vegetarian, halal, and kosher as certifier-backed labels)? Certification display waits on source fields. |

## Traceability

Acceptance criteria for every FR, NFR gate, HITL rule, and PRV rule are in [acceptance-criteria.md](acceptance-criteria.md). Optimization rules referenced above are normative in [optimization.md](optimization.md).
