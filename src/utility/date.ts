function dateAsString(date: Date) {
  const year = date.getFullYear();
  const month = ('00'+ (date.getMonth() + 1)).slice(-2);
  const day = ('00'+ (date.getDate())).slice(-2);
  return `${year}-${month}-${day}`;
}

function toTime(date: Date, time: string) {
  const toTime = new Date(date);
  toTime.setHours(
    Number.parseInt(time.slice(0, 2)),
    Number.parseInt(time.slice(3)),
    0, 0);
  return toTime;
}

export {dateAsString, toTime}