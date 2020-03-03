import monthsNames from "../../data/content/monthsNames";
import capitalize from "lodash/capitalize";

export const convertMonthNumberToText = number => {
  const months = monthsNames.months;
  return months[number - 1];
};

export const convertToTitleCase = string => string.replace(/\w+/g, capitalize);
