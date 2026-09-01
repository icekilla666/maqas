interface normalizedDateProps {
  date: string;
  onlyTime?: boolean;
}

export const normalizedDate = ({ date, onlyTime }: normalizedDateProps) => {
  const newDate = new Date(date);
  return onlyTime
    ? newDate.toLocaleString("ru-RU", {
        timeZone: "Europe/Moscow",
        hour: "2-digit",
        minute: "2-digit",
      })
    : newDate.toLocaleString("ru-RU", {
        timeZone: "Europe/Moscow",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};
