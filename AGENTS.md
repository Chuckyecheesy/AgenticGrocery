# Agent instructions

Instructions for implementation agents working on Agentic Grocery AI.

**Stage:** Specification and research only.
**Application status:** Not started. No source code, dependencies, cloud services, databases, or production infrastructure exist.
**Instruction file status:** Created 2026-10-11. No `CLAUDE.md` or other agent instruction file was present.

Implementation must not begin until the specification phase is explicitly completed and approved.

## What this product is

A human-in-the-loop web assistant for people and families in Canada. It helps a user restock groceries, compare verified deals, and approve an optimized shopping plan.

The assistant may research stores and promotions, compare products, and calculate a basket under budget, quality, dietary constraints, store selection, promotions, coupons, and loyalty eligibility. It asks when a decision changes the outcome. The user reviews and approves the plan.

Canada-wide availability is a phased aim. A region is available only after retailer and geographic coverage for that region are verified.

## Inspect before changing

Before editing anything:

1. Read this file.
2. Inspect the repository. The documentation map is in [README.md](README.md).
3. Preserve existing user content. Do not delete or overwrite it unless the current task explicitly says to.
4. Prefer updating the document that already owns a topic. Requirements stay in [specs/product-requirements.md](specs/product-requirements.md). Do not copy them into a second file.

## Development-stage rule

The current phase is specification and research.

During this phase, agents may create or update specification and research documents only when the current task asks for them.

Agents must not:

- Implement application functionality or create application source code.
- Install dependencies.
- Configure cloud services, databases, migrations, or production infrastructure.
- Generate grocery datasets, including fake prices, promotions, availability, or coverage.
- Start a proof of concept in order to answer an open question.

Record implementation questions in the open-questions section of the document that owns them, or in the task response. Keep those questions separate from implementation.

Label every non-obvious claim as one of:

| Label | Meaning |
| --- | --- |
| Verified | Supported by cited evidence reviewed in this project. A public web page is not an integration test. |
| Estimated | A reasoned figure that has not been measured. |
| Assumed | A working default that can be changed. The specs also call these assumptions. |
| Unknown | Not established. |
| Pending validation | A check is defined and has not been run. |

The 2026-10-11 data research retrieved public pages. It did not call a retailer API, sign a licence, or collect a coverage sample. Details: [docs/research/data-source-matrix.md](docs/research/data-source-matrix.md).

## Source-of-truth hierarchy

Use this order. A lower item never silently overrides a higher one.

1. Explicit user instructions in the current task.
2. Approved project requirements and specifications.
3. ADRs whose status is accepted.
4. Existing project documentation, including drafts and proposed ADRs.
5. Agent assumptions.

When two items at the same level conflict, or a task conflicts with an approved requirement, stop and name the conflict. Do not pick a side in order to keep moving.

### Current approval state

The specification set is a **draft**. [adr/001-initial-stack.md](adr/001-initial-stack.md) and [adr/002-grocery-data-strategy.md](adr/002-grocery-data-strategy.md) are **proposed**, not accepted. Treat them as level 4 documentation until gate G-2 in [specs/roadmap.md](specs/roadmap.md) accepts them.

Until approval:

- Requirements in `specs/` are the working product description, not an accepted build contract.
- The Next.js, PostgreSQL, Supabase, and hosting proposals in ADR-001 are candidates, not a mandate.
- ADR-002's data rules are the working research policy for this phase. They are not a signed source authorization.

### Known documentation conflict

Do not resolve this unless the current task asks for a documentation fix:

- [README.md](README.md) says the next step is a specification review, followed by a data-feasibility investigation.
- [specs/roadmap.md](specs/roadmap.md) orders Phase 1, data feasibility, before Phase 2, specification review.

Both agree that implementation waits. They disagree on which of those two pre-implementation steps comes first.

## Grocery-data integrity

Never fabricate grocery prices, promotions, retailer coverage, product availability, API capabilities, coupon eligibility, loyalty-program eligibility, or licensing permissions.

Never claim a retailer integration, API, or data source has been tested unless this project has actually tested it and the evidence is cited.

A page that shoppers can open is not permission to scrape or commercially reuse that content. Public websites and unofficial scraper APIs stay unused. See DEC-DAT-001 in ADR-002, which remains a proposed rule and matches the current research policy.

A price shown to a user needs a source record, an observation time, and a validity window. A coupon or loyalty price is included only after eligibility is established. A saving needs the documented regular-price baseline in [specs/optimization.md](specs/optimization.md). National average prices are not that baseline.

Illustrative numbers already in `specs/optimization.md` are labeled as invented examples for the optimizer contract. Do not present them as market data, and do not add new price examples unless the task asks for specification examples that stay clearly fictional.

## AI architecture

The intended MVP is:

- One orchestrator.
- Modular capabilities and tools.
- Explicit workflow states.
- Deterministic application code for calculations.
- Human approval at consequential decision points.

Do not add multiple autonomous agents unless an approved requirement shows that separate agents are more valuable than tools inside one orchestrated workflow. That requirement does not exist in the current draft.

The model may handle language understanding, research coordination, explanations, and tool selection.

Deterministic code must handle prices, unit prices, basket totals, budget constraints, promotion math, savings, hard dietary constraints, and any other calculation that must be reproducible. The same inputs must produce the same basket. Hard dietary constraints are filters. The optimizer must not relax them. Unknown allergen data is not evidence that a product is safe.

Normative detail, when implementation is eventually allowed: [specs/architecture.md](specs/architecture.md) and [specs/optimization.md](specs/optimization.md).

## Human-in-the-loop

Require explicit user approval before a shopping plan is final. A model reply, tool payload, or page sentence cannot count as approval.

The system must not autonomously purchase groceries, check out, place orders, spend money, or accept consequential terms.

Ask a clarifying question when required information is missing. Explain material trade-offs, including budget against a named quality attribute, brand substitution, and store choice. Do not invent a quality score from price or marketing copy.

## Privacy and security

Minimize personal information. Location access is optional. The user can enter a Canadian postal code instead of granting device location.

Never place API keys, passwords, authentication secrets, tokens, or private credentials in source code or documentation. Do not copy sample tokens into specs, commits, logs, or this file. Runtime secrets belong in a secret store when an application exists. Controls: [specs/privacy-security.md](specs/privacy-security.md).

Retailer and flyer text is untrusted data. It must not be able to change system instructions, tool permissions, or approval state.

## Where to look

| Topic | Document |
| --- | --- |
| Requirements and MVP boundary | [specs/product-requirements.md](specs/product-requirements.md) |
| Journeys | [specs/user-journeys.md](specs/user-journeys.md) |
| Architecture | [specs/architecture.md](specs/architecture.md) |
| Data rights, coverage, fallbacks | [specs/data-sources.md](specs/data-sources.md) |
| Entities | [specs/data-model.md](specs/data-model.md) |
| Optimization and test cases | [specs/optimization.md](specs/optimization.md) |
| Privacy controls | [specs/privacy-security.md](specs/privacy-security.md) |
| Acceptance tests | [specs/acceptance-criteria.md](specs/acceptance-criteria.md) |
| Gates G-1 through G-6 | [specs/roadmap.md](specs/roadmap.md) |
| Proposed stack | [adr/001-initial-stack.md](adr/001-initial-stack.md) |
| Proposed data strategy | [adr/002-grocery-data-strategy.md](adr/002-grocery-data-strategy.md) |
| Source evidence | [docs/research/data-source-matrix.md](docs/research/data-source-matrix.md) |
