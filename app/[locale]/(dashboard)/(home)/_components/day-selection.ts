const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Tehran",
  weekday: "short",
});

const weekdayNames = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

export function getTodayTaskDay(date = new Date()) {
  const day = weekdayNames.indexOf(weekdayFormatter.format(date));
  if (day < 0) throw new RangeError("Unrecognized weekday");
  return day;
}
