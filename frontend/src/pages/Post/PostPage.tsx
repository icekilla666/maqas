import BackLink from "@/components/common/BackLink";
import EmptyState from "@/components/common/EmptyState";
import PostItem from "@/components/common/Posts/PostItem";
import PostLikersModal from "@/pages/Post/components/PostLikersModal";
import CommentsSkeleton from "@/components/common/Skeletons/CommentsSkeleton";
import { PostSkeleton } from "@/components/common/Skeletons/PostsSkeleton";
import SkeletonView from "@/components/ui/Skeleton/SkeletonView";
import { usePostQuery } from "@/lib/postsQueries";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostComments from "./components/PostComments";
import { useCommentsQuery } from "@/lib/commentsQueries";
import { useLikersQuery } from "@/lib/likesQueries";
import { useAnchorScroll } from "@/hooks/useAnchorScroll";
import { HOME_PAGE } from "@/utils/constants";

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading, isError, error } = usePostQuery(id);
  const commentsQuery = useCommentsQuery(id);
  const { data: comments = [], isLoading: isCommentsLoading, error: commentsError } =
    commentsQuery;
  const likersQuery = useLikersQuery(id);
  const { data: likers = [], error: likersError } = likersQuery;
  const [isLikersModalOpen, setIsLikersModalOpen] = useState(false);

  useAnchorScroll("comments", Boolean(post) && !isError && !isCommentsLoading);

  if (isLoading) {
    return (
      <section className="post-detail-page">
        <div className="post-detail">
          <BackLink to={HOME_PAGE} label="Вернуться в ленту" />
          <SkeletonView label="Загрузка публикации…"><PostSkeleton detail image /></SkeletonView>
          <div className="post-comments"><CommentsSkeleton /></div>
        </div>
      </section>
    );
  }
  return (
    <section className="post-detail-page">
      {post && !isError ? (
        <div className="post-detail">
          <PostItem
            onCommentsClick={() => navigate({ hash: "#comments" })}
            onLikersClick={() => setIsLikersModalOpen(true)}
            onDeleted={() => navigate(HOME_PAGE, { replace: true })}
            post={post}
            variant="detail"
          />
          <PostComments
            key={post.id}
            postId={post.id}
            comments={comments}
            pagination={commentsQuery}
            isLoading={isCommentsLoading}
            error={commentsError}
          />
        </div>
      ) : (
        <>
        <BackLink to={HOME_PAGE} label="Вернуться в ленту" />
        <EmptyState
          icon={<TriangleAlert />}
          text="Не удалось загрузить пост"
          error={error}
          variant="error"
        />
        </>
      )}
      <PostLikersModal
        likers={likers}
        pagination={likersQuery}
        error={likersError}
        onClose={() => setIsLikersModalOpen(false)}
        open={isLikersModalOpen}
      />
    </section>
  );
};

export default PostPage;
