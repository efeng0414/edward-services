import moment from "moment";

type TimezonePayload = {
  dateObj: string;
  timeZone: string;
};

export const timeConversion = ({ dateObj, timeZone }: TimezonePayload) =>
  // @ts-ignore
  dateObj.toLocaleString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZoneName: "long",
    hour: "numeric",
    minute: "numeric",
    time: "numeric",
    timeZone: timeZone || "America/Toronto",
    hour12: false
  });

export const getMonthDayYear = (date: string) => {
  // @ts-ignore
  const newDate = timeConversion({ dateObj: new Date(date) });
  const month = moment(newDate).format("MMMM");
  const day = moment(newDate).format("Do");
  const year = moment(newDate).format("YYYY");
  const hour = moment(newDate).format("HH:MM A");

  return `${day} ${month} ${year} at ${hour}`;
};
