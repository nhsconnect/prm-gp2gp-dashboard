import { convertMonthNumberToText } from "../convertMonthNumberToText";

export const getPreviousMonths = (
  month: number,
  year: number,
  numberOfMonths: number
) => {
  const defaultIndex = 0;

  const options = [...Array(numberOfMonths)].map((_, index) => {
    const monthYearString = `${convertMonthNumberToText(month)} ${year}`;
    month = month - 1;
    if (month <= 0) {
      month = 12;
      year = year - 1;
    }
    return { displayText: monthYearString, value: index };
  });

  return {
    defaultValue: defaultIndex,
    options: options,
  };
};
