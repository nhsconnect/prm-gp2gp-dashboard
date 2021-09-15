export const calculatePercentage = (portion: number, total: number): string => {
  if (total === 0) return "n/a";

  const percentage = (portion / total) * 100;
  return `${percentage.toFixed(1)}%`;
};
