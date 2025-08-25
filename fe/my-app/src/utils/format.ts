export const formatVNDCompact = (value: number): string => {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

export function formatNumber(value: string | number, locale = "en-US") {
  return new Intl.NumberFormat(locale).format(Number(value));
}
