const PRICE_MULTIPLIER = 1000;

function parsePriceValue(value: string | number | undefined): number {
  if (typeof value === 'number') return value;
  if (value === undefined || value === null) return Number.NaN;

  const normalized = String(value).trim().replace(',', '.');
  if (!normalized) return Number.NaN;

  return Number(normalized);
}

export function scalePrice(value: string | number | undefined): number {
  const numericValue = parsePriceValue(value);
  if (Number.isNaN(numericValue)) return 0;

  // Keep integer input as final Rupiah value.
  if (Number.isInteger(numericValue)) return numericValue;

  // Legacy decimal input (e.g. 99.99) is converted to Rupiah scale.
  return Math.round(numericValue * PRICE_MULTIPLIER);
}

export function toEditablePrice(value: string | number | undefined): string {
  const numericValue = parsePriceValue(value);
  if (Number.isNaN(numericValue)) return '';
  return String(scalePrice(numericValue));
}

export function toDisplayPrice(value: string | number | undefined): number {
  return scalePrice(value);
}
