import { ChevronLeft } from "lucide-react";
import { Link, useLocation, useNavigate, type To } from "react-router-dom";

const BackLink = ({ to, label = "Назад", className = "", returnToPostList = false }: {
  returnToPostList?: boolean;
  to: To;
  label?: string;
  className?: string;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
  <Link
    to={to}
    className={`back-link ${className}`.trim()}
    aria-label={label}
    onClick={event => {
      event.stopPropagation();
      if (returnToPostList && location.state?.fromPostList && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
        event.preventDefault();
        navigate(-1);
      }
    }}
  >
    <ChevronLeft size={24} aria-hidden="true" />
  </Link>
  );
};

export default BackLink;
