import monthsNames from "../../data/content/monthsNames";
import capitalize from "lodash/capitalize";

export const convertMonthNumberToText = number => {
  const months = monthsNames.months;
  return months[number - 1];
};

export const convertToTitleCase = string => {
  const acronyms = ["NHS", "CCG", "GP"];

  return string
    .split(" ")
    .map(word => (acronyms.includes(word) ? word : capitalize(word)))
    .join(" ");
};
