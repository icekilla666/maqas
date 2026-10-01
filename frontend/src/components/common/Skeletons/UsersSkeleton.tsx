import Skeleton from "@/components/ui/Skeleton/Skeleton";
import SkeletonView from "@/components/ui/Skeleton/SkeletonView";

const UsersSkeleton = ({ count = 6, action = false, avatarsOnly = false }: {
  count?: number; action?: boolean; avatarsOnly?: boolean;
}) => (
  <SkeletonView label="Загрузка пользователей…">
    <div className={avatarsOnly ? "skeleton-avatars" : "user-list__items"}>
      {Array.from({ length: count }, (_, index) => avatarsOnly ? (
        <Skeleton key={index} circle width={52} height={52} />
      ) : (
        <div className="user-list__item skeleton-row" key={index}>
          <Skeleton circle width={46} height={46} />
          <div className="skeleton-grow skeleton-stack skeleton-stack--tight">
            <Skeleton width={`${44 + (index % 3) * 12}%`} />
            <Skeleton width={`${28 + (index % 2) * 12}%`} height={11} />
          </div>
          {action && <Skeleton circle width={24} height={24} />}
        </div>
      ))}
    </div>
  </SkeletonView>
);

export default UsersSkeleton;
