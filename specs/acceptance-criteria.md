# Acceptance criteria

**Status:** Draft for specification review
**Updated:** 2026-10-11

Each criterion is testable by an automated test, an API check, or a scripted pilot audit. Optimization fixtures TC-OPT-001 through TC-OPT-028 in [optimization.md](optimization.md) are part of this set. Nothing here has been executed.

## Traceability

| Requirement | Criteria |
| --- | --- |
| FR-001 | AC-001, AC-002 |
| FR-002 | AC-003 |
| FR-003 | AC-004, AC-060 |
| FR-004 | AC-005, AC-006 |
| FR-005 | AC-007, AC-008, AC-009 |
| FR-006 | AC-010, AC-011 |
| FR-007 | AC-012 |
| FR-008 | AC-013 |
| FR-009 | AC-014, AC-015 |
| FR-010 | AC-016 |
| FR-011 | AC-017, TC-OPT-001, TC-OPT-002, TC-OPT-003, TC-OPT-004 |
| FR-012 | AC-018, TC-OPT-005, TC-OPT-006 |
| FR-013 | AC-019, TC-OPT-024 |
| FR-014 | AC-020, TC-OPT-026 |
| FR-015 | AC-021, TC-OPT-018, TC-OPT-019 |
| FR-016 | AC-022, AC-061 |
| FR-017 | AC-023, AC-024, AC-025 |
| FR-018 | AC-026, AC-062 |
| FR-019 | AC-027, TC-OPT-020, TC-OPT-021, TC-OPT-022, TC-OPT-025 |
| FR-020 | AC-028, AC-029 |
| FR-021 | AC-030 |
| FR-022 | AC-031, TC-OPT-013, TC-OPT-014, TC-OPT-015 |
| FR-023 | AC-032 |
| FR-024 | AC-033 |
| FR-025 | AC-015 |
| NFR-001 | AC-034, TC-OPT-027 |
| NFR-002 | AC-035 |
| NFR-003 | AC-036 |
| NFR-004 | AC-037 |
| NFR-005 | AC-052 (pilot metric, not a build test) |
| NFR-006 | AC-038 |
| NFR-007 | AC-039 |
| NFR-008 | AC-040 |
| NFR-009 | AC-041, TC-OPT-024 |
| NFR-010 | AC-042 |
| NFR-011 | AC-043 |
| HITL-001 | AC-013 |
| HITL-002 | AC-006, TC-OPT-009, TC-OPT-011 |
| HITL-003 | AC-020 |
| HITL-004 | TC-OPT-012 |
| HITL-005 | AC-044 |
| HITL-006 | AC-022 |
| HITL-007 | AC-007 |
| HITL-008 | TC-OPT-007 |
| PRV-001 | AC-007 |
| PRV-002 | AC-045 |
| PRV-003 | AC-046 |
| PRV-004 | AC-047 |
| PRV-005 | AC-048 |
| PRV-006 | AC-049 |
| PRV-007 | AC-050 |
| PRV-008 | AC-042 |
| PRV-009 | AC-051 |
| PRV-010 | TC-OPT-006 |
| SM-001 | AC-053 |
| SM-002 | AC-054 |
| SM-003 | AC-032 |
| SM-004 | AC-052 |
| SM-005 | AC-055 |
| SM-006 | AC-027 |
| SM-007 | AC-056 |
| SM-008 | AC-057 |

## Functional tests

### AC-001 Sign-in

Given a new email, when the user requests a link and opens it, then a session is created and an empty household exists.

### AC-002 Return visit

Given a signed-out browser, when the user opens a fresh link, then the same household and saved preferences load.

### AC-003 Household fields

Given onboarding, when the user enters a display name and household size, then those values persist. The form has no field for a child's name.

### AC-004 Preference round trip

Given a saved peanut constraint, budget, and staple, when a new plan starts, then the plan input contains those values. When the user overrides the budget for one plan and does not confirm a profile update, then the saved budget is unchanged.

### AC-060 Usual package size

Given a staple whose usual package size is "2 L" and that size is not marked required, when a plan is built, then the need shows "2 L" and a different parsed size of the same product may appear only as a labeled class-1 substitution. Given the user marks "2 L" required for that staple, when optimization runs, then other sizes of that staple are not included. TC-OPT-028 passes.

### AC-005 Mode selection

Given the three modes, when the user selects one, then `preference_profile.priority_mode` and the next run use that mode.

### AC-006 Missing mode inputs

Given budget-first with no cap and no unbounded flag, when a run starts, then status becomes `needs_input` and no total is stored. The same holds for quality-first with no quality attribute, and balanced missing either input.

### AC-007 Location consent

Given a user who has not answered, when the page loads, then no geolocation call is made. Given a denial, when the user continues, then the postal-code field is shown and no second browser prompt is fired in that session.

### AC-008 Postal code validation

Given `M5V 2T6`, when submitted, then it is stored in normalized form if a full code is required. Given `M5V` or `12345`, when submitted, then the plan does not start and the format error is shown.

### AC-009 Postal code without coordinates

Given consent denied and a valid postal code, when stores are queried, then the query uses the postal code and the place row has null coordinates.

### AC-010 Store list source

Given a mix of authorized and `rights_blocked` stores for a postal code, when discovery runs, then only authorized stores in an enabled coverage region are returned.

### AC-011 Hidden store

Given the user hides a store, when discovery runs again, then that store is absent from the default list.

### AC-012 Restock structure

Given the text "I'm running out of groceries" and two saved staples, when interpretation finishes, then the user sees those staples as editable needs before offers are treated as final.

### AC-013 Clarification

Given milk saved only as "milk" and two fat levels in the catalog that the user has not equated, when the run reaches that need, then it asks which one and does not include both as silent substitutes. Given the same need already stored as "2% milk", when a run starts, then it does not ask again.

### AC-014 Unlicensed offer rejected

Given an offer with `licence_status = research_only`, when a pilot plan is built, then that offer is not an included line and is not shown as a shopable price.

### AC-015 Fixture isolation

Given an offer with `environment = test`, when the pilot query for guaranteed lines runs, then the result is empty of that offer.

### AC-016 Provenance on screen

Given an included line, when review renders, then source name, `observed_at`, validity window, and freshness are present.

### AC-017 Unit price and totals

TC-OPT-001, TC-OPT-002, TC-OPT-003, TC-OPT-004, and TC-OPT-023 pass. The basket total equals the sum of included line totals in cents.

### AC-018 Dietary exclusion

TC-OPT-005 and TC-OPT-006 pass. The rejected peanut product is absent from suggestion payloads.

### AC-019 Determinism

TC-OPT-024 passes for two processes or two sequential calls.

### AC-020 Substitution confirmation

Given a class-2 candidate and a closed substitution policy, when optimization runs, then the candidate is not included (TC-OPT-026). Given the user confirms that candidate, when the run repeats, then it may be included and the line carries class 2.

### AC-021 Savings baseline

TC-OPT-018 and TC-OPT-019 pass. A line with a saving also stores the regular offer id used as baseline.

### AC-022 Review contents

Given a result with included lines, one unmet need, and one stale offer, when review renders, then the three groups are separate, the stale offer is outside the total, and the approval control is available only for the included version.

### AC-061 Explanation amounts

Given an optimization result whose guaranteed total is 650 cents, when an explanation string states a different total, then the review total remains 650 cents and the explanation is not parsed to replace it.

### AC-062 No purchase tool

Given a model transcript that requests a tool named `purchase` or `checkout`, when the orchestrator handles the transcript, then the tool call is rejected. This criterion belongs to FR-018 only. A model request to mark the plan approved is AC-024.

### AC-023 Approval record

Given review, when the user activates approve, then an `approval_record` stores user id, time, and the version `content_hash`, and status is `approved`.

### AC-024 Approval is not a model action

Given a model explanation that says the plan is approved, or a model request for a tool named `approve`, when no approval command has run, then the tool call is rejected if one was made and the status remains `review`.

### AC-025 Stale approval

Given an approved version, when a new snapshot changes an included price and a new version is created, then the old approval does not apply to the new hash and the new version is unapproved.

### AC-026 No purchase path

Given an approved plan, when the UI and the route list are inspected, then there is no checkout, payment, or order endpoint.

### AC-027 Freshness gate

TC-OPT-020, TC-OPT-021, TC-OPT-022, and TC-OPT-025 pass. No guaranteed total contains a stale or uncertain line (SM-006).

### AC-028 Source retry

Given a connector timeout, when the run executes, then the connector attempts at most three calls (initial plus two retries) and then records `source_run_error`. Lines from other current snapshots remain eligible.

### AC-029 Total absence on total failure

Given every required source failed and no current snapshot exists, when the run ends, then status is `blocked` and the response has no zero total.

### AC-030 Edit creates a version

Given a review version, when the user changes a quantity, then a new `plan_version` exists, the optimizer has run on the new quantity, and the previous version is unchanged.

### AC-031 Loyalty and coupons

TC-OPT-013, TC-OPT-014, and TC-OPT-015 pass. The UI string for a non-applied member price does not call that price the user's price.

### AC-032 Records present

Given an approved plan, when the database is read, then both `optimization_run` and `approval_record` exist and share the version id (FR-023, SM-003).

### AC-033 Coverage gate

Given an enabled region list that excludes the submitted postal code, when the user requests a basket, then the response states the area is not available and contains no included lines.

### AC-044 Unmet need

Given every candidate for a need fails a hard constraint, when optimization finishes, then the need is `unmet` and the run asks how to proceed (HITL-005).

## Constraint, money, and provenance tests

### AC-034 Money representation

Given a price of $3.99, when stored, then the column value is the integer 399. A search of the optimizer module shows no binary floating-point money type. TC-OPT-027 passes for display rounding.

### AC-035 Optimization suite

The automated suite includes every TC-OPT case and fails the build on any mismatch.

### AC-043 Taxes excluded

Given included lines totaling 650 cents, when the review model is returned, then the guaranteed total is 650 cents and the payload states that taxes, deposits, and fees are not calculated.

### AC-053 Price audit sample

For a pilot week, draw at least 50 guaranteed lines or all of them if fewer exist. Recompute each against its snapshot. The match rate is reported against SM-001. A mismatch is a defect even if the hypothesis threshold is later revised.

### AC-054 Constraint audit

For every approved plan in the pilot window, re-evaluate hard constraints against stored attributes. The violation count must be 0 (SM-002).

### AC-055 Savings audit

For every included line in an approved plan, either the saving is null or the baseline offer id is the same variant and store, current at approval time, and the arithmetic matches DEC-OPT-002 (SM-005).

## Human approval tests

Covered by AC-023, AC-024, AC-025, and AC-032. Additional check:

### AC-058 Double submit

Given two identical approve commands for the same version, when both complete, then one approval row exists and the status is `approved`.

## Source failure and recovery tests

Covered by AC-028 and AC-029. Additional check:

### AC-059 Partial catalog

Given store A with current prices for two of three needs and a failed source for the third, when the run completes, then two lines may be included, the third need is unmet with a source error, and no estimated price is stored.

## Security and privacy tests

### AC-036 Degraded sources

Given the offer connector down, when the user signs in and opens an already approved plan, then sign-in and the stored plan succeed.

### AC-037 Log redaction

Given a completed run, when pilot logs are scanned, then they contain the workflow id and omit email, raw coordinates, and authorization headers.

### AC-038 Accessibility

Keyboard-only use can complete onboarding, enter a postal code, answer a clarification, review a plan, and approve it. Visible focus and form labels exist on those screens. This is a manual script until an audit tool is wired in. NFR-006 remains unmet until that script passes. This criterion does not claim a WCAG audit has occurred.

### AC-039 Language gate

Given a build marked English-only, when coverage configuration is validated, then no enabled region is in Quebec.

### AC-040 Model cap

Given a cap of N model calls, when the orchestrator would exceed N, then the run stops in `blocked` or `needs_input` and does not dispatch the next call.

### AC-041 Idempotent ingest

Given the same snapshot payload twice, when ingest runs, then offer keys are not duplicated and the second run reports an update or a no-op.

### AC-042 Secrets

Given the pilot client bundle and the repository, when scanned for the configured secret patterns, then no model key, database password, or partner token is present.

### AC-045 Coordinate retention

Given location used for one request without the save-coordinates option, when the request ends, then `place.latitude` and `place.longitude` are null.

### AC-046 Collection limit

Given the account schema, when reviewed, then there is no column for payment card, government id, or child name.

### AC-047 Access

Given a signed-in user, when they open the profile and plan history, then the stored preferences, postal code, and plans for their household are visible.

### AC-048 Isolation

Given two households, when user A requests user B's plan id, then the response is not found or forbidden and contains none of user B's lines.

### AC-049 Consent log

Given a granted and a denied location choice, when consent is saved, then both records store purpose, state, policy version, and time.

### AC-050 Deletion

Given a confirmed deletion, when the primary-database check runs, then household-owned rows for that user are gone and a new session for that login fails.

### AC-051 Injection

Given an offer name that contains instruction text and a script tag, when review renders and the optimizer runs, then the total is unchanged, the status is not approved, and the page shows the name as text.

## Pilot performance and quality metrics

These are measurement procedures for the pilot. They are not evidence that a target has been met.

### AC-052 Latency sample

Record start and review timestamps for plans with at most 25 needs and no source failure. Report the median against the 3-minute hypothesis (SM-004, NFR-005). A miss is reviewed. It does not by itself fail a unit test.

### AC-056 Model cost

Sum provider-reported cost for model calls on each completed plan. Report against the cap from the ADR-001 spike (SM-007). If the provider does not report cost, record token counts and the price sheet used.

### AC-057 Coverage sample

For the pilot reference basket and the enabled postal codes, compute the share of needs with at least one `current` authorized price. Compare with the ADR-002 threshold (SM-008). The pilot stays closed while the share is below the threshold.

## Open questions

| ID | Question |
| --- | --- |
| AC-OQ-001 | Which accessibility checker and browser set are required for AC-038? |
| AC-OQ-002 | Who samples the 50 lines for AC-053, and how are they stored? |
