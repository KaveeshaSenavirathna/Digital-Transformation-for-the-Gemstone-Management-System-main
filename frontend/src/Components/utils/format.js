export function formatPrice(value) {
  if (value === null || value === undefined) return "0.00";
  const num = Number(value);
  if (Number.isNaN(num)) return "0.00";
  const safe = Math.max(0, num);
  return safe.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
