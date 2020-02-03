import monthsNames from "../../data/monthsNames";

export const convertMonthNumberToText = (number) => {
  const months = monthsNames.months;
  return months[number - 1];
}