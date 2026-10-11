# Agentic Grocery AI

Human-in-the-loop grocery assistant for people and families in Canada. The product helps a user restock household groceries, compare real offers from authorized sources, and approve an optimized shopping plan.

A user can start with a request such as: "I'm running out of groceries. Help me restock." The system researches stores and promotions, calculates prices and savings with deterministic code, asks for decisions that change the outcome, and stops at an explicit approval. It does not check out or purchase.

**Status:** Specification phase. No application has been implemented.

**Research date:** 2026-10-11. External facts in the data documents come from public pages retrieved that day. No retailer API was called, no licence was signed, and no coverage sample was collected.

## Goals

- Produce a working MVP that uses real, authorized grocery deal data for a verified Canadian pilot area.
- Remember household preferences and ask clarifying questions when a decision changes the basket.
- Compare stores and products using unit prices, constraints, and documented savings baselines.
- Keep price math, promotion eligibility, and totals in testable application code.
- Show where each price came from, when it was observed, and when it expires.
- Require a person to approve the shopping plan before it is final.

## Non-goals

- Autonomous checkout, payment, or order placement.
- A native mobile app for the first release.
- Multiple autonomous agents.
- Reusing flyer content without a licence. An AI reading of an official weekly flyer page is a candidate method, not a granted right. See [adr/002-grocery-data-strategy.md](adr/002-grocery-data-strategy.md).
- Invented prices, invented quality scores, or savings without a documented baseline.
- Applying a coupon or loyalty price before eligibility is established.
- Canada-wide availability before retailer and geographic coverage are verified.
- Inferring a shopping cadence before the user confirms it.
- Meal planning and in-store aisle guidance in the first release.

## Current development stage

| Stage | State |
| --- | --- |
| Product and technical specification | Draft, in this repository |
| Data-source feasibility | Open. This is the critical blocker. |
| Specification review | Not started |
| Application implementation | Not started |
| Pilot | Not started |

The next step is a specification review, followed by a data-feasibility investigation. Implementation waits on those gates. See [specs/roadmap.md](specs/roadmap.md).

## Documentation map

| Document | Contents |
| --- | --- |
| [specs/product-requirements.md](specs/product-requirements.md) | Problem, vision, personas, stories, requirements, MVP boundary, privacy, metrics |
| [specs/user-journeys.md](specs/user-journeys.md) | Onboarding, restock, priority modes, location, failures, approval |
| [specs/architecture.md](specs/architecture.md) | Components, flows, orchestration, errors, hosting, simplicity rationale |
| [specs/data-sources.md](specs/data-sources.md) | Canadian source strategy, coverage, rights, freshness, fallbacks |
| [specs/data-model.md](specs/data-model.md) | Entities, relationships, indexes |
| [specs/optimization.md](specs/optimization.md) | Priority modes, unit prices, constraints, savings, tests |
| [specs/privacy-security.md](specs/privacy-security.md) | Consent, retention, auth, secrets, injection, deletion |
| [specs/acceptance-criteria.md](specs/acceptance-criteria.md) | Traceable tests for every MVP requirement |
| [specs/roadmap.md](specs/roadmap.md) | Feasibility through pilot, with release gates |
| [adr/001-initial-stack.md](adr/001-initial-stack.md) | Proposed stack, alternatives, costs, open validations |
| [adr/002-grocery-data-strategy.md](adr/002-grocery-data-strategy.md) | Source criteria, licensing, coverage thresholds, fallbacks |
| [docs/research/data-source-matrix.md](docs/research/data-source-matrix.md) | Candidate-by-candidate research notes |

Requirements live in the product requirements document. Other documents refer to those identifiers instead of copying them.

## How to read the labels

| Label | Meaning |
| --- | --- |
| Verified | Supported by a cited public source during the 2026-10-11 research pass. Not the same as an integration test. |
| Assumption | A working default chosen so the spec is implementable. It can be changed at review. |
| Estimate | A reasoned figure that has not been measured. |
| Open question | Unresolved. Listed in the document that owns it. |

## Product principles

- One orchestrator coordinates modular capabilities. Specialized code and data connectors do the rest.
- The model interprets language and explains a result. It does not calculate prices, invent offers, or approve a plan.
- A price shown to a user is tied to a source record, a timestamp, and a validity window.
- Hard constraints, including dietary restrictions, are filters. The optimizer cannot relax them.
- Location is optional. A postal code is always available as the alternative.
- Credentials stay in the runtime secret store, never in source or in these documents.
