import monthsNames from "../../../data/content/monthsNames";

export const convertMonthNumberToText = number => {
  const months = monthsNames.months;
  return months[number - 1];
};
