import type { To } from "react-router-dom";
import BackLink from "./BackLink";

interface TitlePageProps {
  title: string;
  backTo?: To;
  backLabel?: string;
  className?: string;
  count?: number;
}

const TitlePage = ({ title, className = "", count, backTo, backLabel }: TitlePageProps) => {
  return (
    <div className={`title-page ${className}`.trim()}>
      {backTo !== undefined && <BackLink to={backTo} label={backLabel} />}
      <h1 className="font-medium">{title}</h1>
      {count !== undefined && <span className="opacity-50">{count}</span>}
    </div>
  );
};

export default TitlePage;
