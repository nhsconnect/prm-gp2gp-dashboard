import {convertMonthNumberToText} from "../convertMonthNumberToText";

export const getPreviousSixMonths = (number: number) => {
  const defaultValue = convertMonthNumberToText(number)

  const options = [...Array(6)].map((_) => {
    const monthString = convertMonthNumberToText(number);
    number = number - 1
    if (number <= 0)
      number = 12
    return {displayText: monthString, value: monthString}
  });

  return {
    defaultValue: defaultValue,
    options: options
  }
};