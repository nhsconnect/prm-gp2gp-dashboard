import monthsNames from "../../../data/content/monthsNames.json";

export const convertMonthNumberToText = (number: number): string => {
  const months = monthsNames.months;
  return months[number - 1];
};
