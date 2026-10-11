export function assertInteger(value: number, label: string): void {
  if (!Number.isInteger(value)) {
    throw new Error(`${label} must be an integer`);
  }
}

export function assertIntegerCents(value: number, label: string): void {
  assertInteger(value, label);
  if (value < 0) {
    throw new Error(`${label} must be zero or a positive number of cents`);
  }
}

/**
 * Compare unit prices by cross-multiplication.
 * Negative when A is cheaper per base unit, positive when B is cheaper, zero when equal.
 * Display-rounded unit prices are not an input.
 */
export function compareUnitPrice(
  priceACents: number,
  baseA: number,
  priceBCents: number,
  baseB: number,
): -1 | 0 | 1 {
  assertIntegerCents(priceACents, "price_a_cents");
  assertIntegerCents(priceBCents, "price_b_cents");
  assertPositiveBase(baseA, "base_a");
  assertPositiveBase(baseB, "base_b");

  const left = priceACents * baseB;
  const right = priceBCents * baseA;
  assertSafeInteger(left, "price_a * base_b");
  assertSafeInteger(right, "price_b * base_a");

  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}

/**
 * Price per `per` base units, rounded half away from zero to the nearest cent.
 * The caller keeps the pack line total separate from this display value.
 */
export function displayCentsPer(priceCents: number, quantityBase: number, per: number): number {
  assertIntegerCents(priceCents, "price_cents");
  assertPositiveBase(quantityBase, "quantity_base");
  assertPositiveBase(per, "per");

  const numerator = priceCents * per;
  assertSafeInteger(numerator, "price_cents * per");

  const quotient = Math.trunc(numerator / quantityBase);
  const remainder = numerator % quantityBase;
  const doubledRemainder = Math.abs(remainder) * 2;

  if (doubledRemainder >= quantityBase) {
    return quotient + 1;
  }
  return quotient;
}

function assertPositiveBase(value: number, label: string): void {
  assertInteger(value, label);
  if (value <= 0) {
    throw new Error(`${label} must be a positive integer`);
  }
}

function assertSafeInteger(value: number, label: string): void {
  if (!Number.isSafeInteger(value)) {
    throw new Error(`${label} is outside the safe integer range`);
  }
}
