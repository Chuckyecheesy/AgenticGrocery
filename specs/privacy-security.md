# Privacy and security

**Status:** Draft for specification review
**Updated:** 2026-10-11

Requirements are PRV-001 through PRV-010, FR-017, FR-018, and NFR-004, NFR-008, and NFR-010 in [product-requirements.md](product-requirements.md). This document specifies controls. It is not a legal opinion or a penetration test.

## Location consent

| Control | Rule |
| --- | --- |
| Ask first | The browser location API is called only after the user accepts the purpose statement (HITL-007, PRV-001). |
| Denial | A denial is stored as a consent record and the postal-code form is shown. The prompt is not repeated in that session. |
| Minimum precision | If the active source needs a postal code, store the postal code. Store latitude and longitude only when the user opts in (PRV-002). |
| Processors | A geocoder is a subprocessor. It is named in the notice before coordinates are sent. Until ARC-OQ-004 is resolved, postal-code entry is sufficient for the pilot. |
| Display | Store results describe the precision used ("based on postal code M5V 2T6"). |

## Data minimization and retention

Collected for the MVP:

- email and authentication subject
- household label, size, preferences, constraints, staples
- consent records
- postal code, and coordinates only under PRV-002
- shopping plans, optimization results, approvals
- operational logs as limited by NFR-004

Not collected:

- payment instruments
- government identifiers
- children's names or ages
- loyalty passwords or full loyalty profiles
- medical records. Diet and allergen fields are shopping constraints only (PRV-010).

| Data | Proposed retention |
| --- | --- |
| Active account data | Until deletion |
| Unapproved drafts | 90 days (DM-OQ-003, assumption) |
| Approved plans | Until deletion, so the user can read them (PRV-004) |
| Connector snapshots that contain no personal data | For the source's validity window plus 90 days, for audit of SM-001 |
| Debug prompt bodies | Off in pilot. If enabled in a proof of concept, 7 days in a restricted store |
| Backups | Provider cycle, documented before pilot (PRV-007) |

Dietary constraints and postal codes are personal information in this design and receive the same access control as the rest of the household record.

## Authentication and authorization

- Sign-in is an email magic link (FR-001). Sessions are http-only, secure cookies. The session secret is not readable by script.
- Passwordless links expire. The expiry value is set by the auth provider and recorded in the pilot configuration.
- Every household query is scoped by the signed-in user's household (PRV-005).
- The connector role can write source tables and cannot read `user_account` email or preference rows.
- The application role can read authorized offers and can read household rows only through the ownership check.
- Administrative access to production personal data is named-person, time-limited, and logged. The MVP does not include a broad admin UI.

**Assumption SEC-A-001.** One user per household, so sharing and member roles are unnecessary. PRD-OQ-003 reopens this.

## Secrets and API-key management

- Model keys, database URLs, auth secrets, and partner tokens live in the host secret store.
- They are injected as environment variables at runtime.
- They are absent from the repository, from fixtures, from client bundles, and from specification files (PRV-008, NFR-010).
- Flipp-style tokens, if a licence is ever granted, are passed server-side. A token that a vendor's own documentation says must stay secret is never placed in a query string logged by the browser or by a CDN access log. If a provider only supports a query parameter, the connector calls it from the server and strips the parameter from stored URLs.
- Local development uses throwaway secrets in an untracked local env file. The file is listed in `.gitignore` when the application repository is created. That ignore rule is an implementation task, not something this phase can satisfy with an application.

## Secure external integrations

| Integration | Control |
| --- | --- |
| Model provider | Server-side only. Household data sent is limited to the current need list and the optimizer JSON required for the task. The provider's data-retention setting is chosen at the spike and recorded. |
| Authorized retailer or flyer API | Connector uses the partner credential. Responses are validated against the ingest schema before insert. |
| Open data HTTP | Identify the app with a descriptive User-Agent where the publisher asks for one. Respect published rate limits. |
| Geocoder | Disabled until named in the privacy notice. |
| Email delivery | Transactional sign-in mail only. |
| Unofficial scrapers | No integration (SRC-008). |

Transport is TLS. Webhooks, if a source later requires them, use a shared secret and a signature check. None are required for the MVP.

## Prompt injection and untrusted source data

Retailer text, coupon conditions, product names, and user-pasted flyer text are data.

- They are stored in columns the optimizer does not execute.
- Tool arguments from the model are schema-checked. Unknown tools are rejected ([architecture.md](architecture.md)).
- The model cannot call approval, payment, or credential tools, because those tools do not exist.
- The explanation prompt tells the model to treat offer text as quotation and to use only numbers present in the optimizer JSON. The UI does not parse the explanation for totals.
- A need name that contains instruction-like text is still a string label. It does not change system instructions.
- Ingest strips or rejects unexpected HTML script content before display. The UI encodes text.

## Approval of consequential actions

| Action | Gate |
| --- | --- |
| Read device location | Consent control |
| Save a hard constraint or overwrite one | User confirmation, HITL-008 when it conflicts |
| Include a class-2 substitution | Pre-approval on the need or HITL-003 |
| Split across stores | `max_stores` or HITL-004 |
| Mark the plan final | Approval control and hash check (FR-017) |
| Purchase, pay, or place an order | Not implemented (FR-018) |
| Delete the account | A second confirmation, then PRV-007 |

The approval command is authenticated, bound to `plan_version_id`, and rejected when `content_hash` differs from the stored version. Model output is not an input to that command.

## Data deletion

1. The user submits delete-account and confirms.
2. The account is disabled immediately so new sessions fail.
3. Household, preferences, places, plans, runs, approvals, and consent rows are deleted from the primary database without undue delay and in all cases within 30 days (PRV-007).
4. Logs that contain a workflow id are deleted or purged of the linkage on the same schedule. Logs that never stored personal fields may remain as aggregates.
5. The user is told that provider backups expire on the documented cycle.
6. Authorized product and offer catalogs that are not personal are kept.

A pre-pilot check verifies a deleted email can no longer read the old plan.

## Security testing before pilot

These are planned tests, not results. Nothing has been tested, because the application does not exist.

| Test | Pass condition |
| --- | --- |
| Household isolation | User A cannot read user B's plan by changing an id. |
| Approval spoofing | A crafted explanation or tool result leaves status unapproved. |
| Hash mismatch | Edited price after review cannot be approved under the old hash. |
| Secret scan | Repository and built client assets contain no partner token or model key. |
| Fixture leak | `environment = test` offers are absent from the pilot query. |
| Ingest abuse | Offer text with markup is displayed as text. |
| Rate and cap | Exceeding NFR-008 stops the run. |
| Deletion | PRV-007 checklist above. |
| Dependency review | Production dependencies reviewed at implementation time. |

A third-party penetration test is not a gate for an internal proof of concept. It is a gate before a public pilot that stores personal data for people outside the team (roadmap gate G-6).

## Open questions

| ID | Question |
| --- | --- |
| SEC-OQ-001 | Which subprocessors, including host, database, email, model, and optional geocoder, will be named in the privacy notice? |
| SEC-OQ-002 | Is a Canadian region available from the chosen database host (ARC-OQ-001)? |
| SEC-OQ-003 | What backup retention does the chosen host actually provide? |
| SEC-OQ-004 | Does counsel require French privacy text or additional consent for a later Quebec pilot (NFR-007, PRD-A-002)? |
| SEC-OQ-005 | Should allergen fields be encrypted at the application layer, or is database access control enough for the pilot? Proposed: access control is enough until counsel disagrees. |
