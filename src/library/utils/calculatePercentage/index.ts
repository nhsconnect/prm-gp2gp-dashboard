export const calculatePercentage = (portion: number, total: number): string => {
  const percentage = (portion / total) * 100;
  return percentage.toFixed(1);
};
