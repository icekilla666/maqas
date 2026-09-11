import { normalizedDate } from "@/utils/normalizedDate";

interface DateTimeProps {
  date: string;
  className?: string;
}

const DateTime = ({ date, className = "" }: DateTimeProps) => (
  <time className={`content-datetime ${className}`.trim()} dateTime={date}>
    {normalizedDate({ date, onlyDate: true, timeIfToday: true })}
  </time>
);

export default DateTime;
