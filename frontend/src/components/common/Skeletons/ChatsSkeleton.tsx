import Skeleton from "@/components/ui/Skeleton/Skeleton";
import SkeletonView from "@/components/ui/Skeleton/SkeletonView";

const ChatsSkeleton = ({ count = 6, label = "Загрузка чатов…" }: { count?: number; label?: string }) => (
  <SkeletonView label={label}>
    <div className="chat-list skeleton-chat-list">
      {Array.from({ length: count }, (_, index) => (
        <div className="chat-list__item" key={index}>
          <Skeleton circle width={52} height={52} />
          <div className="skeleton-grow skeleton-stack">
            <div className="skeleton-row">
              <Skeleton width={`${40 + (index % 3) * 12}%`} />
              <Skeleton className="skeleton-end" width={32} height={10} />
            </div>
            <div className="skeleton-row">
              <Skeleton width={`${65 - (index % 3) * 12}%`} height={12} />
              {index % 2 === 0 && <Skeleton className="skeleton-end" circle width={18} height={18} />}
            </div>
          </div>
        </div>
      ))}
    </div>
  </SkeletonView>
);

export default ChatsSkeleton;
