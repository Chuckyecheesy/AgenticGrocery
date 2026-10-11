# ADR-001. Initial stack

**Status:** Proposed on 2026-10-11. Not accepted. Acceptance is gate G-2 in [roadmap.md](../specs/roadmap.md).
**Deciders:** Not yet assigned (RD-OQ-001).

## Context

The MVP is a web application with accounts, a workflow, authorized grocery snapshots, and deterministic basket math. Infrastructure and API cost should stay low. The application has not been started. Vendor prices below are intentionally not quoted: public price pages change, and this research pass did not lock a plan.

Personal data will include email, household preferences, and postal codes. Where that data lives is unresolved (ARC-OQ-001).

## Proposal

| Layer | Proposal | Role |
| --- | --- | --- |
| Web application | Next.js with TypeScript | UI, server request boundary, orchestrator, optimizer, connectors in one repository |
| Database | PostgreSQL | System of record in [data-model.md](../specs/data-model.md) |
| Database hosting and auth | Supabase, if a suitable region exists | Managed Postgres, email-link auth, row-level security |
| Model | One tool-calling model behind `CMP-MODEL` | Language and explanations only. Vendor chosen after a spike. |
| Money and optimization | TypeScript module `CMP-OPT` | No model, no floats |
| Jobs | One scheduled command that runs connectors | Platform cron or an in-process scheduler |
| Host | A long-running Node host | Avoid serverless timeouts for research turns and refreshes until a spike proves otherwise |
| Tests | Automated unit tests for TC-OPT and ingest rules | NFR-002 |

This is the smallest set that meets the requirements if the region and host checks pass. It is one codebase, one database, one model adapter, and one cron.

## Alternatives considered

### Frontend and application runtime

| Option | Why it was considered | Why it is not the proposal |
| --- | --- | --- |
| Next.js and TypeScript | One language for UI and server, server-side secret boundary, wide hosting support | Chosen as the proposal |
| React client plus a separate API | Clear process split | Extra service to deploy and secure for no current scaling need |
| Python API and a separate frontend | Strong data-script ecosystem | Two languages before any connector complexity requires them. Revisit if a licensed feed ships only as a Python SDK. |

### Database and auth

| Option | Why it was considered | Why it is not the proposal |
| --- | --- | --- |
| Supabase Postgres and Supabase Auth | Meets the data model, supports row-level security, includes email-link auth | Proposal, conditional on region and terms |
| Neon or another Postgres, plus Auth.js | Less bundled lock-in | More auth code to build and review for a lean MVP |
| SQLite | Simple local development | Weak fit for concurrent pilot writes, row-level security, and hosted backups |
| MySQL | Common managed option | The model uses constraints and JSON that PostgreSQL fits directly. No requirement favors MySQL. |

Supabase is a convenience choice, not a data-rights choice. If its regions or data-processing terms fail SEC-OQ-001 or ARC-OQ-001, use managed PostgreSQL and a small auth library instead. The schema stays the same.

### Model

| Option | Assessment |
| --- | --- |
| A single provider with tool calling | Matches DEC-ARC-001. The spike compares reliability of `ask_user` and structured needs, Canadian English, and cost per plan. |
| Several agents or an agent framework | Rejected for the MVP in DEC-ARC-001. |
| No model, forms only | Meets math and approval, and fails the plain-language restock story (FR-007). Forms remain the fallback if the model spike fails a run: the user edits needs directly. |

Vendor names are omitted until the spike so this ADR does not pretend a model was evaluated.

### Hosting and jobs

| Option | Assessment |
| --- | --- |
| Long-running Node host (examples: Fly.io, Railway, a small container) | Proposal. Research turns and daily ingests can run without a function timeout. Cost is an estimate until a plan is selected. |
| Serverless Next.js host (example: Vercel) | Strong preview deploys. Weaker fit if plan runs or ingests exceed the platform's function limit. Remains a candidate if the spike shows runs finish inside that limit. |
| Separate queue and worker fleet | Deferred by DEC-ARC-003. The workflow table is enough for one worker later. |

### Optimization library

Custom TypeScript is proposed because the rules are product-specific (eligibility, baselines, hard constraints) and must be tested exactly. A general solver is extra machinery for a basket of about 25 needs. Revisit only if multi-store assignment becomes an actual combinatorial problem in production data.

## Costs and trade-offs

| Cost | What is known | Trade-off |
| --- | --- | --- |
| Data licence | Unknown. Likely the largest cost if a retailer or Flipp charges. | A cheap stack does not make an unlicensed feed acceptable. |
| Model calls | Unknown until the spike. Capped by NFR-008. | Explanations can be shortened or skipped without changing totals. |
| Database and host | Unknown until a plan and region are selected. A single small Postgres fits the MVP. | Supabase bundles auth and database, which reduces services and increases vendor coupling. |
| Engineering time | One TypeScript codebase is the main saving. | A later Python connector would be a second runtime. Accepted until a feed forces it. |
| Lock-in | Auth and row-level security idioms may be Supabase-specific. | The schema is portable SQL. The mitigation is to keep SQL standard and isolate the auth adapter. |

No total cost of ownership is stated, because that figure would be invented.

## Consequences

- Browser code does not receive source credentials.
- The optimizer is importable in tests without a network connection.
- Swapping the model provider changes `CMP-MODEL` only.
- Adding a licensed source adds a connector and a `source` row.
- If the long-running host is rejected, timeouts must be re-tested before G-3.

## Decisions that still need validation

| ID | Validation |
| --- | --- |
| ARC-OQ-001 | Database region and host data-processing terms |
| ARC-OQ-002 | One process versus a worker, measured |
| ARC-OQ-003 | Model vendor, tool-calling quality, and cost cap |
| ARC-OQ-004 | Whether a geocoder is in the pilot |
| SEC-OQ-001 | Subprocessor list |
| SEC-OQ-005 | Application-level encryption of allergen fields |
| Stack price check | Current Supabase, host, and model price pages at implementation time |

## Decision

Proposed, not accepted. Implement only after G-2, and keep phase 3 inside synthetic data until G-1 and G-3 pass.
