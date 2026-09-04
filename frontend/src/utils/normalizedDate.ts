interface normalizedDateProps {
  date: string;
  onlyTime?: boolean;
  onlyDate?: boolean;
  relativeToday?: boolean;
}

const TIME_ZONE = "Europe/Moscow";

const calendarDayFormatter = new Intl.DateTimeFormat("ru-RU", {
  timeZone: TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const yearFormatter = new Intl.DateTimeFormat("ru-RU", {
  timeZone: TIME_ZONE,
  year: "numeric",
});

export const normalizedDate = ({
  date,
  onlyTime,
  onlyDate,
  relativeToday,
}: normalizedDateProps) => {
  const newDate = new Date(date);

  if (onlyTime) {
    return newDate.toLocaleString("ru-RU", {
      timeZone: TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (onlyDate) {
    const now = new Date();
    const isToday =
      calendarDayFormatter.format(newDate) === calendarDayFormatter.format(now);

    if (relativeToday && isToday) return "сегодня";

    const isCurrentYear =
      yearFormatter.format(newDate) === yearFormatter.format(now);

    return newDate.toLocaleDateString("ru-RU", {
      timeZone: TIME_ZONE,
      day: "numeric",
      month: "long",
      year: isCurrentYear ? undefined : "numeric",
    });
  }

  return newDate.toLocaleString("ru-RU", {
    timeZone: TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
