import { convertMonthNumberToText } from "../convertMonthNumberToText";

export const getPreviousMonths = (month: number, numberOfMonths: number) => {
  const defaultIndex = "0";

  const options = [...Array(numberOfMonths)].map((_, i) => {
    const monthString = convertMonthNumberToText(month);
    month = month - 1;
    if (month <= 0) month = 12;
    return { displayText: monthString, value: i.toString() };
  });

  return {
    defaultValue: defaultIndex,
    options: options,
  };
};
