export type PackageDimension = "mass" | "volume" | "count" | "unknown";

export type NormalizedPackage = {
  dimension: PackageDimension;
  quantityBase: number | null;
};

const MASS_OR_VOLUME =
  /^(\d+)(?:\.(\d+))?\s*(g|kg|ml|l)$/i;
const COUNT = /^(\d+)\s*(?:eggs|count|ct|each)$/i;

/**
 * Parses a package label into an integer base quantity.
 * Unparseable text stays unknown. This function does not guess a size.
 */
export function normalizePackage(packageText: string): NormalizedPackage {
  const text = packageText.trim();
  const measured = MASS_OR_VOLUME.exec(text);
  if (measured) {
    const whole = measured[1] ?? "";
    const fraction = measured[2];
    const unit = (measured[3] ?? "").toLowerCase();
    const quantityBase = toBaseUnits(whole, fraction, unit);
    if (quantityBase === null) {
      return unknownPackage();
    }
    const dimension = unit === "g" || unit === "kg" ? "mass" : "volume";
    return { dimension, quantityBase };
  }

  const count = COUNT.exec(text);
  if (count) {
    return { dimension: "count", quantityBase: Number(count[1]) };
  }

  return unknownPackage();
}

function toBaseUnits(whole: string, fraction: string | undefined, unit: string): number | null {
  const digits = `${whole}${fraction ?? ""}`;
  if (!/^\d+$/.test(digits)) {
    return null;
  }
  const numerator = Number(digits);
  const denominator = 10 ** (fraction?.length ?? 0);
  const scale = unit === "kg" || unit === "l" ? 1000 : 1;
  const product = numerator * scale;
  if (!Number.isSafeInteger(product) || product % denominator !== 0) {
    return null;
  }
  const quantityBase = product / denominator;
  if (!Number.isInteger(quantityBase) || quantityBase <= 0) {
    return null;
  }
  return quantityBase;
}

function unknownPackage(): NormalizedPackage {
  return { dimension: "unknown", quantityBase: null };
}
