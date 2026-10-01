import Skeleton from "@/components/ui/Skeleton/Skeleton";
import SkeletonView from "@/components/ui/Skeleton/SkeletonView";

export const PostSkeleton = ({ image = false, detail = false }: { image?: boolean; detail?: boolean }) => (
  <div className={`post-item skeleton-stack ${detail ? "post-item--detail" : ""}`}>
    <div className="skeleton-row">
      <Skeleton circle width={36} height={36} />
      <Skeleton width="35%" />
      <Skeleton className="skeleton-end" width={44} height={10} />
    </div>
    {image && <Skeleton className="skeleton-post-image" height="auto" />}
    <Skeleton width="65%" height={20} />
    <div className="skeleton-stack skeleton-stack--tight">
      <Skeleton />
      <Skeleton width="92%" />
      <Skeleton width="72%" />
      {detail && <><Skeleton /><Skeleton width="85%" /><Skeleton width="60%" /></>}
    </div>
    <div className="skeleton-row">
      <Skeleton width={64} height={22} /><Skeleton width={80} height={22} />
    </div>
    <div className="skeleton-row">
      <Skeleton width={38} height={18} /><Skeleton width={38} height={18} />
      <Skeleton width={24} height={18} /><Skeleton className="skeleton-end" width={24} height={18} />
    </div>
  </div>
);

const PostsSkeleton = ({ count = 3 }: { count?: number }) => (
  <SkeletonView label="Загрузка публикаций…">
    <div className="flex flex-col gap-2 mt-1.5">
      {Array.from({ length: count }, (_, index) => <PostSkeleton key={index} image={index === 0} />)}
    </div>
  </SkeletonView>
);

export default PostsSkeleton;
