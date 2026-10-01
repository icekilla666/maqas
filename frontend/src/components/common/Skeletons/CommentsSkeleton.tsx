import Skeleton from "@/components/ui/Skeleton/Skeleton";
import SkeletonView from "@/components/ui/Skeleton/SkeletonView";

const CommentsSkeleton = ({ count = 3 }: { count?: number }) => (
  <SkeletonView label="Загрузка комментариев…">
    <div className="skeleton-stack">
      {Array.from({ length: count }, (_, index) => (
        <div className="comment-item__body" key={index}>
          <Skeleton circle width={32} height={32} />
          <div className="skeleton-grow skeleton-stack">
            <div className="skeleton-row">
              <Skeleton width="35%" height={12} />
              <Skeleton className="skeleton-end" width={32} height={10} />
            </div>
            <Skeleton width="95%" height={12} />
            <Skeleton width={index % 2 ? "48%" : "72%"} height={12} />
          </div>
        </div>
      ))}
    </div>
  </SkeletonView>
);

export default CommentsSkeleton;
