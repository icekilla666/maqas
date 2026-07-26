interface TitlePageProps {
  title: string;
  className?: string;
  count?: number;
}

const TitlePage = ({ title, className = "", count }: TitlePageProps) => {
  return (
    <div className={`title-page ${className}`.trim()}>
      <h1 className="font-medium">{title}</h1>
      {count && <span className="opacity-50">{count}</span>}
    </div>
  );
};

export default TitlePage;
