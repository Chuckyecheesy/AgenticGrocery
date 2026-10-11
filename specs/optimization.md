# Basket optimization

**Status:** Draft for specification review
**Updated:** 2026-10-11

This is the normative specification for `CMP-OPT`. Requirements FR-011 through FR-015, FR-019, and FR-022 point here. Examples use invented products and **illustrative prices**. They are not observations from a retailer.

## Decision DEC-OPT-001. Integer money and exact comparison

- Persisted prices and line totals are integer cents of CAD.
- Unit-price ordering compares rationals. For two offers, compare `price_cents / quantity_base` by cross-multiplication in integers: `price_a * base_b` versus `price_b * base_a`.
- The display unit price is a separate rounding step and is never fed back into comparison or into the total.
- Display rounding for "per 100 base units" is half away from zero to the nearest cent.
- Binary floating point is not used on this path (NFR-001).

## Decision DEC-OPT-002. Savings baseline

A saving is:

`regular_price_cents - paid_price_cents`

for the **same variant at the same store**, when the regular offer is `current` and authorized. The UI names that regular offer as the baseline.

If the regular offer is missing, stale, or from another store, the saving is omitted. The promotional price may still be the price paid. A Statistics Canada average is not a baseline. A model's estimate is not a baseline.

## Priority modes

Inputs to every mode:

- needs, each with a quantity and a substitution policy
- hard constraints
- named quality attributes (may be empty)
- offers that are authorized and pinned to snapshots
- `budget_cents` or an explicit unbounded flag
- `max_stores`
- the clock used for validity

Hard filters run before ranking in every mode:

1. Drop offers that are not `current`.
2. Drop offers that violate a hard constraint when the attribute is known.
3. Drop loyalty and coupon prices whose eligibility is not `eligible`.
4. Drop offers whose package dimension is `unknown` from unit-price ranking. They can still fill a need when the user named that exact variant and no size comparison is required.

### Budget-first

**Required input.** A budget cap, or an explicit user choice to run without a cap (HITL-002).

**Objective.** Cover the needs with the minimum guaranteed total in cents.

**Selection.** For each need, consider candidates the substitution policy allows. Choose the set of candidates, assigned to at most `max_stores` stores, with the lowest sum of line totals. Default `max_stores` is 1.

**Over cap.** If the cheapest feasible total exceeds the cap, return the cheapest feasible plan, set `within_budget = false`, and pause for a user decision. Do not drop a hard constraint to come under the cap.

**Ties.** At equal total cents: prefer the plan that uses more pre-approved preferred brands; then the plan with fewer class-2 substitutions; then the plan whose included offers have the later `observed_at`. No other tie break exists.

### Quality-first

**Required input.** At least one named quality attribute (HITL-002). Price is not a quality attribute.

**Selection.** For each need, keep candidates that satisfy the attributes that apply to that need's category. Among them, choose the lowest line total using the budget-first tie breaks. Show the total. A budget, if the user also set one, does not remove quality matches; if the total exceeds it, set `within_budget = false` and pause.

**No match.** If the quality set is empty for a need, the need is unmet. A non-matching substitute is proposed only as a question (HITL-003), not as an included line.

### Balanced

**Required input.** At least one named quality attribute, and a budget cap or an explicit unbounded flag (HITL-002).

**Selection.** Prefer the lowest-cost plan whose included lines satisfy the named attributes and the hard constraints.

**Conflict.** If that plan exceeds the cap, or if an attribute cannot be met, return both:

- the best plan that keeps the attributes, with its total
- the cheapest plan that drops only the soft attributes, with its total and the attributes lost

Do not pick between them in code. The user chooses (HITL-002). Hard constraints remain in both plans.

**Assumption OPT-A-001.** The MVP does not use a weighted score. Weights hide the trade-off this mode exists to show. A weighted mode would be a new requirement.

## Product equivalence and unit price

| Class | Definition | Included without an extra question? |
| --- | --- | --- |
| 0 | Same GTIN or same source variant, any authorized store | Yes |
| 1 | Same brand and product, different package size, same dimension | Yes, and the UI shows both sizes and unit prices |
| 2 | Different brand, same user-stated generic need, constraints satisfied | Only if the need allows brand substitution or the user confirms (HITL-003) |
| 3 | Different category or form than the need | No, unless the user edits the need |

Same GTIN means the same identifier scheme and value. The optimizer does not declare two GTINs equivalent by name similarity. Name similarity may be used by the orchestrator to **ask** the user, not to auto-merge.

### Normalization

| Source quantity | `dimension` | `quantity_base` |
| --- | --- | --- |
| Grams, kilograms | `mass` | grams |
| Millilitres, litres | `volume` | millilitres |
| A count, such as 12 eggs | `count` | each |
| Unparseable text | `unknown` | null |

Comparable offers share a dimension. A per-each offer is not ranked against a per-gram offer. Produce sold both ways stays in separate comparison groups, and the UI says so.

Display basis:

- mass: price per 100 g
- volume: price per 100 ml
- count: price per 1 each

Line total uses the offer's pack price and the number of packs required, not the rounded unit price.

### Multi-buy

When the promotion states "N for P" and the single-pack regular or non-deal price `S` is current:

- Let `q` be the number of packs the user needs.
- Deal groups = `floor(q / N)`, remainder = `q mod N`.
- Line total = `deal groups * P + remainder * S`.

If `S` is unknown and the remainder is not zero, the line is `uncertain` and excluded from the guaranteed total. If the user quantity is below `N`, the deal is not applied and `S` is used; if `S` is unknown, the line is unmet or uncertain rather than charged as a fraction of the multi-buy.

## Budget and dietary constraints

- Budget applies to the guaranteed total of included lines. Unmet needs are listed beside it and are not given a synthetic price.
- Hard constraints remove candidates before cost is considered.
- If the source did not provide the attribute a constraint needs (allergen not declared), the candidate is `uncertain` for that need, not included, and the reason is `attribute_unknown`. The product does not treat silence as "free from this allergen" (PRV-010).
- A user request that contradicts a saved hard constraint pauses under HITL-008.

## Store selection and travel

- Default is one store: the user's pinned store if it yields a feasible plan, otherwise the single store with the lowest guaranteed total among authorized stores in the place's coverage.
- If another store covers more needs, the result can include that alternative as a comparison. Switching the user to it, or splitting the list, requires HITL-004 when `max_stores` is 1.
- Distance is displayed only when the source provided coordinates for both the place precision in use and the store. It is a label. It is not converted to dollars.
- The MVP does not subtract travel cost from savings (MVP exclusion).

## Coupon and loyalty eligibility

A `loyalty` or `coupon` offer contributes to a line total only when an `eligibility_decision` for this plan version is `eligible` and every `coupon_requirement` matches.

Otherwise the optimizer uses the current `regular` offer. The unused member offer is returned in `excluded_offer` with reason `eligibility_not_established` or `ineligible`. Copy for the UI states that the member price was not applied.

Stacking: if `stackable` is false, at most one coupon applies to a line. The MVP applies none until eligibility exists, so stacking does not arise in the first release.

## Uncertainty

| Condition | Freshness or reason | In guaranteed total? |
| --- | --- | --- |
| Now inside `[valid_from, valid_to]`, snapshot inside SLA, price present | `current`. If `valid_to` is within 24 hours, also flag `expiring` for display. | Yes, when other rules pass |
| `valid_to` in the past | `stale` | No |
| Shelf price `observed_at` older than the shelf window (DAT-A-002, proposed 72 hours) and no valid promotion window covers now | `stale` | No |
| Missing `valid_to` on a promotion | `uncertain` | No |
| Missing package size when a size comparison is required | `uncertain` | No |
| Two current authorized prices for the same variant, store, and price type disagree | `uncertain` | No |
| Source run failed and no prior current snapshot exists | need unmet, source error attached | No |
| Attribute required by a hard constraint is absent | `attribute_unknown` | No |

The guaranteed total is the sum of included line totals. It is omitted entirely, not shown as zero, when there are no included lines.

Taxes, bottle deposits, and environmental fees are outside the total (NFR-011).

## Worked examples

Illustrative figures. Banners are "Example Grocer" and "Second Grocer", not real stores.

### Example 1. Unit price beats the lower sticker price

Need: 1 pack of yogurt, brand substitution allowed, budget-first.

| Offer | Pack | Price | Comparison |
| --- | --- | --- | --- |
| A | 500 g | 375 cents | `375 / 500` |
| B | 750 g | 480 cents | `480 / 750` |

Cross-multiply: `375 * 750 = 281250`, `480 * 500 = 240000`. B is cheaper per gram. Display per 100 g: A is 75 cents, B is 64 cents. Chosen line: B, line total 480 cents. Saving is computed only if B has a current regular price at that store.

### Example 2. Budget conflict does not break an allergy

Need: one cereal. Hard constraint: peanut. Budget remaining: 300 cents.

| Offer | Price | Allergen attribute |
| --- | --- | --- |
| Crunch | 250 cents | contains peanut |
| Plain oats | 420 cents | peanut not present |

Crunch is removed before ranking. Plain oats is the only candidate and exceeds the remaining cap. Result: `within_budget = false`, one included line at 420 cents, question to the user. Crunch is not returned as a suggestion.

### Example 3. Member price not applied

Same variant, same store:

| Price type | Cents | Eligibility |
| --- | --- | --- |
| regular | 599 | n/a |
| loyalty | 499 | `not_established` |

Paid price is 599. Excluded offer records the 499 with reason `eligibility_not_established`. Saving versus regular is not shown, because the paid price is the regular price.

### Example 4. Multi-buy with a remainder

Deal: 2 for 500 cents. Single price S = 279 cents. User quantity = 3 packs.

Line total = 500 + 279 = 779 cents. The UI shows one deal group and one single pack.

If S were missing, the line would be uncertain because one pack is outside the deal.

### Example 5. Balanced mode surfaces the choice

Attribute: organic produce. Need: 1 kg equivalent of apples, here as a 1000 g bag so the pack matches. Cap: 400 cents.

| Offer | Attribute | Price |
| --- | --- | --- |
| Organic bag | organic | 549 cents |
| Conventional bag | not organic | 299 cents |

The optimizer returns two plans and does not mark either approved: keep-attribute at 549 cents, or drop-attribute at 299 cents. Hard constraints, if any, apply to both.

### Example 6. Missing regular price

Promo price 250 cents, no regular offer ingested. The line may be included at 250 cents if the promo is `current`. The saving field is null. The UI does not say the user saved money.

## Deterministic test cases

These are the minimum automated tests (NFR-002). Inputs are fixtures. Expected totals are exact cents. Each test fixes the clock.

| ID | Case | Expect |
| --- | --- | --- |
| TC-OPT-001 | Example 1 numbers | Chooses B. Display per 100 g is 64 cents for B and 75 cents for A. Comparison does not use those rounded values. |
| TC-OPT-002 | 2 L at 399 cents versus 1 L at 210 cents, volume dimension | 2 L wins. `399/2000` versus `210/1000`: `399 * 1000 = 399000`, `210 * 2000 = 420000`. |
| TC-OPT-003 | 6-count at 400 cents versus 500 g at 350 cents | No unit-price winner. Both remain if substitution rules allow, with `not_comparable` set. The mode's other rules decide; the test asserts they were not cross-ranked. |
| TC-OPT-004 | Unparseable size "family pack" and a parsed competitor | Unparsed offer excluded from unit ranking with `uncertain`. |
| TC-OPT-005 | Example 2 | Peanut item absent from included and from suggestions. `within_budget = false`. Total 420. |
| TC-OPT-006 | Allergen attribute missing on an otherwise cheapest item | Excluded with `attribute_unknown`. |
| TC-OPT-007 | User allows that allergen in the request and confirms HITL-008 | Saved rule overridden for this version only. |
| TC-OPT-008 | Budget-first, two plans with total 800 | Tie breaks follow preferred brand, then fewer class-2 substitutions, then newer `observed_at`. |
| TC-OPT-009 | Quality-first with zero quality attributes | No basket. Run returns `needs_input`. |
| TC-OPT-010 | Quality-first, two organic options | Cheaper organic option wins. A cheaper conventional option is not included. |
| TC-OPT-011 | Example 5 | Two alternative plans, neither auto-selected. |
| TC-OPT-012 | `max_stores = 1`, two stores each missing a different need | Best single store returned. The other store is an alternative that requires HITL-004 before it becomes the plan. |
| TC-OPT-013 | Example 3 | Total uses 599. Loyalty row excluded. No saving displayed. |
| TC-OPT-014 | Coupon `min_quantity = 2`, user quantity 1, eligibility `eligible` | Coupon not applied. Regular price used. |
| TC-OPT-015 | Coupon eligibility `not_established` | Coupon not applied even if quantity qualifies. |
| TC-OPT-016 | Example 4 | Total 779. |
| TC-OPT-017 | Multi-buy quantity 3, N = 2, S missing | Line not in the guaranteed total. |
| TC-OPT-018 | Example 6 | Included at 250. Saving null. |
| TC-OPT-019 | Regular price from store A, promo at store B | No saving on the store B line. |
| TC-OPT-020 | Promo `valid_to` yesterday | Excluded as `stale`. |
| TC-OPT-021 | Promo with null `valid_to` | Excluded as `uncertain`. |
| TC-OPT-022 | Two current regular prices, 199 and 229, same variant and store | Both excluded as `uncertain`. Need unmet or covered by another store's single current price. |
| TC-OPT-023 | Three lines of 100, 250, and 300 cents | Guaranteed total 650. |
| TC-OPT-024 | Same inputs and optimizer version | Identical `result_json` and `content_hash`. |
| TC-OPT-025 | No included lines | Total field absent, not 0. |
| TC-OPT-026 | Class-2 substitute, policy closed | Not included until a confirmation flag is in the input. |
| TC-OPT-027 | Display rounding 1.5 L at 399 cents per 100 ml | Exact comparison basis `399/1500`. Display per 100 ml is 27 cents (`26.6` rounds half away from zero). Line total remains 399. |

## Open questions

| ID | Question |
| --- | --- |
| OPT-OQ-001 | Should `expiring` within 24 hours force a confirmation, or only a label? Proposed: label only. |
| OPT-OQ-002 | Is the shelf stale window 72 hours (DAT-A-002) or the licensor's own timestamp? |
| OPT-OQ-003 | How should catch-weight items (price per kg at the register) be represented when the flyer gives a unit price and no pack total? Proposed: they can be shown as unit prices and cannot enter the guaranteed pack total until a weight is known. |
| OPT-OQ-004 | Are in-store multi-buy limits ("limit 4") enforced? Proposed: show the limit text and cap quantity only when the source provides a structured limit. |
