import Skeleton from "@/components/ui/Skeleton/Skeleton";
import SkeletonView from "@/components/ui/Skeleton/SkeletonView";
import { PostSkeleton } from "./PostsSkeleton";

const AccountSkeleton = ({ own = false }: { own?: boolean }) => (
  <section className="wrapper">
    <div className="container">
      <SkeletonView label="Загрузка профиля…">
        <div className="skeleton-stack skeleton-stack--loose">
          <div className="skeleton-account">
            <div className="skeleton-row">
              <Skeleton circle width={90} height={90} />
              <div className="skeleton-grow skeleton-stack">
                <Skeleton width="70%" height={18} />
                <Skeleton width="48%" height={12} />
                <div className="skeleton-account-counts">
                  {[0, 1, 2].map(index => (
                    <div className="skeleton-stack skeleton-stack--tight" key={index}>
                      <Skeleton width={24} height={17} /><Skeleton height={10} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Skeleton width="85%" height={12} />
          </div>
          <div className={`skeleton-row ${own ? "skeleton-account-tabs" : ""}`}>
            <Skeleton width="50%" height={own ? 32 : 40} />
            <Skeleton width="50%" height={own ? 32 : 40} />
          </div>
          <PostSkeleton image /><PostSkeleton />
        </div>
      </SkeletonView>
    </div>
  </section>
);

export default AccountSkeleton;
