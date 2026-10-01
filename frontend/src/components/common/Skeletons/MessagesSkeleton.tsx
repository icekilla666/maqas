import Skeleton from "@/components/ui/Skeleton/Skeleton";
import SkeletonView from "@/components/ui/Skeleton/SkeletonView";

const MessagesSkeleton = () => (
  <SkeletonView label="Загрузка сообщений…">
    <div className="skeleton-messages">
      <Skeleton className="skeleton-message-date" width={80} height={22} />
      {[58, 42, 68, 48, 62, 38].map((width, index) => (
        <div key={index} className={`skeleton-message skeleton-stack ${index % 3 === 1 ? "skeleton-message--own" : ""}`} style={{ width: `${width}%` }}>
          <Skeleton height={12} />
          {index % 2 === 0 && <Skeleton width="75%" height={12} />}
          <Skeleton className="skeleton-end" width={38} height={8} />
        </div>
      ))}
    </div>
  </SkeletonView>
);

export default MessagesSkeleton;
