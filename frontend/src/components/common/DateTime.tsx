import { normalizedDate } from "@/utils/normalizedDate";

interface DateTimeProps {
  date: string;
  className?: string;
  onlyTime?: boolean;
}

const DateTime = ({ date, className = "", onlyTime = false }: DateTimeProps) => (
  <time className={`content-datetime ${className}`.trim()} dateTime={date}>
    {normalizedDate({ date, onlyTime, onlyDate: true, timeIfToday: true })}
  </time>
);

export default DateTime;
