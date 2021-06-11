export const addPercentageSign = (number: number | null): string => {
  if (number == null) return "n/a";
  return `${number}%`;
};
