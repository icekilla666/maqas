import { ChevronLeft } from "lucide-react";
import { Link, type To } from "react-router-dom";

const BackLink = ({ to, label = "Назад", className = "" }: {
  to: To;
  label?: string;
  className?: string;
}) => (
  <Link
    to={to}
    className={`back-link ${className}`.trim()}
    aria-label={label}
    onClick={event => event.stopPropagation()}
  >
    <ChevronLeft size={24} aria-hidden="true" />
  </Link>
);

export default BackLink;
