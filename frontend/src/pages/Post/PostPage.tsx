import EmptyState from "@/components/common/EmptyState";
import PostItem from "@/components/common/Posts/PostItem";
import PostLikersModal from "@/pages/Post/components/PostLikersModal";
import Loader from "@/components/ui/Loaders/Loader";
import { usePostQuery } from "@/lib/postsQueries";
import type { CommentData } from "@/types/api.types";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import PostComments from "./components/PostComments";
import { useCommentsQuery } from "@/lib/commentsQueries";
import { useLikersQuery } from "@/lib/likesQueries";

const PostPage = () => {
  const { id } = useParams();
  const { data: post, isLoading, isError } = usePostQuery(id);
  const { data: comments = [], isLoading: isCommentsLoading } =
    useCommentsQuery(id);
  const { data: likers = [] } = useLikersQuery(id);
  const [isLikersModalOpen, setIsLikersModalOpen] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [replyingTo, setReplyingTo] = useState<CommentData | null>(null);

  const handleCommentSubmit = (content: string) => {
    console.log("comment submit", {
      postId: id,
      parentId: replyingTo?.id ?? null,
      content,
    });

    setCommentValue("");
    setReplyingTo(null);
  };

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
            onLikersClick={() => setIsLikersModalOpen(true)}
            post={post}
            variant="detail"
          />
          <PostComments
            comments={comments}
            isLoading={isCommentsLoading}
            onCancelReply={() => setReplyingTo(null)}
            onChange={setCommentValue}
            onReply={setReplyingTo}
            onSubmit={handleCommentSubmit}
            replyingTo={replyingTo}
            value={commentValue}
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
