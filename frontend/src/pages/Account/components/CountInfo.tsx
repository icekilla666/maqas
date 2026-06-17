import type { CountType } from "@/types/entities";

interface CountInfoProps {
  followers: number;
  followings: number;
  publications: number;
  onClick: (type: CountType) => void;
}

const CountInfo = ({
  followers,
  followings,
  publications,
  onClick,
}: CountInfoProps) => {
  const rowCounts = [
    {
      type: "followers" as const,
      label: "подписчики",
      value: followers ?? 0,
    },
    {
      type: "followings" as const,
      label: "подписок",
      value: followings ?? 0,
    },
    {
      type: "publications" as const,
      label: "публикаций",
      value: publications ?? 0,
    },
  ];
  return rowCounts.map((row) => (
    <article
      onClick={() => onClick(row.type)}
      key={row.type}
      className="account__row flex flex-col items-start gap-1"
    >
      <p className="account__count text-xs text-second">{row.value}</p>
      <p className="account__count-label text-xs text-second font-medium">
        {row.label}
      </p>
    </article>
  ));
};

export default CountInfo;
