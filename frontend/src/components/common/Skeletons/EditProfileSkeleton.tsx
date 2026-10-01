import Skeleton from "@/components/ui/Skeleton/Skeleton";
import SkeletonView from "@/components/ui/Skeleton/SkeletonView";

const EditProfileSkeleton = () => (
  <SkeletonView label="Загрузка настроек профиля…">
    <div className="flex flex-col items-center gap-7">
      <Skeleton circle width={128} height={128} />
      <div className="flex flex-col mb-16 gap-2 w-full">
        {[0, 1, 2].map(index => (
          <div className="skeleton-stack skeleton-stack--tight" key={index}>
            <Skeleton width={index === 0 ? 80 : 48} height={12} />
            <Skeleton height={46} />
          </div>
        ))}
      </div>
      <Skeleton width="100%" height={44} />
    </div>
  </SkeletonView>
);

export default EditProfileSkeleton;
