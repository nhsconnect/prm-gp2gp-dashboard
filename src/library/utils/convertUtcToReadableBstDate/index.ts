import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export const convertUtcToReadableBstDate = (date: string): string => {
  return dayjs.utc(date).tz("Europe/London").format("D MMMM YYYY h:mm a");
};
