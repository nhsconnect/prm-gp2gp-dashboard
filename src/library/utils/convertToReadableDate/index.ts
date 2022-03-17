import dayjs from "dayjs";

export const convertToReadableDate = (date: string): string => {
  return dayjs(date).format("MMMM YYYY");
};
