import { subHours, addMonths } from "date-fns";

export const getCookieExpiryDate = function (): Date {
  const expiryDate = addMonths(new Date(Date.now()), 3);
  const expiryDateMinusDaylightSavings = subHours(expiryDate, 1);
  return expiryDateMinusDaylightSavings;
};
