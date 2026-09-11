import EmptyState from "@/components/common/EmptyState";
import PostItem from "@/components/common/Posts/PostItem";
import PostLikersModal from "@/pages/Post/components/PostLikersModal";
import Loader from "@/components/ui/Loaders/Loader";
import { usePostQuery } from "@/lib/postsQueries";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostComments from "./components/PostComments";
import { useCommentsQuery } from "@/lib/commentsQueries";
import { useLikersQuery } from "@/lib/likesQueries";
import { useAnchorScroll } from "@/hooks/useAnchorScroll";

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading, isError } = usePostQuery(id);
  const { data: comments = [], isLoading: isCommentsLoading } =
    useCommentsQuery(id);
  const { data: likers = [] } = useLikersQuery(id);
  const [isLikersModalOpen, setIsLikersModalOpen] = useState(false);

  useAnchorScroll("comments", Boolean(post) && !isError && !isCommentsLoading);

  if (isLoading) {
    return (
      <section className="post-detail-page">
        <div className="container post-detail__loader">
          <Loader />
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
            post={post}
            variant="detail"
          />
          <PostComments
            key={post.id}
            postId={post.id}
            comments={comments}
            isLoading={isCommentsLoading}
          />
        </div>
      ) : (
        <EmptyState
          icon={<TriangleAlert />}
          text="Не удалось загрузить пост"
          variant="error"
        />
      )}
      <PostLikersModal
        likers={likers}
        onClose={() => setIsLikersModalOpen(false)}
        open={isLikersModalOpen}
      />
    </section>
  );
};

export default PostPage;
