export const calculatePercentage = (
  portion: number,
  total: number
): number | null => {
  if (total === 0) return null;

  const percentage = (portion / total) * 100;
  return Number(percentage.toFixed(1));
};
