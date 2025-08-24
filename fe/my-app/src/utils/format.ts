export const formatVNDCompact = (value: number): string => {
  return (
    new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value)
  );
};
