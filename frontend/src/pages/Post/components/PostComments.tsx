import CommentInput from "@/components/ui/Inputs/CommentInput";
import Loader from "@/components/ui/Loaders/Loader";
import type { CommentData } from "@/types/api.types";
import { X } from "lucide-react";
import CommentsList from "./CommentsList";

interface PostCommentsProps {
  comments: CommentData[];
  value: string;
  isLoading?: boolean;
  replyingTo: CommentData | null;
  onCancelReply: () => void;
  onChange: (value: string) => void;
  onReply: (comment: CommentData) => void;
  onSubmit: (value: string) => void;
}

const PostComments = ({
  comments,
  value,
  isLoading = false,
  replyingTo,
  onCancelReply,
  onChange,
  onReply,
  onSubmit,
}: PostCommentsProps) => {
  const rootCommentsCount = comments.filter((comment) => !comment.parent_id).length;

  return (
    <section className="post-comments">
      <div className="post-comments__header">
        <h2>Комментарии</h2>
        <span>{rootCommentsCount}</span>
      </div>

      <div className="post-comments__list-wrapper">
        {isLoading ? (
          <div className="post-comments__loader">
            <Loader width={34} />
          </div>
        ) : (
          <CommentsList comments={comments} onReply={onReply} />
        )}
      </div>

      <div className="post-comments__composer">
        {replyingTo && (
          <div className="post-comments__replying">
            <span>Ответ @{replyingTo.user.username}</span>
            <button
              aria-label="Отменить ответ"
              onClick={onCancelReply}
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <CommentInput
          onChange={onChange}
          onSubmit={onSubmit}
          placeholder={
            replyingTo
              ? `Ответить @${replyingTo.user.username}`
              : "Написать комментарий"
          }
          submitLabel={replyingTo ? "Отправить ответ" : "Отправить комментарий"}
          value={value}
        />
      </div>
    </section>
  );
};

export default PostComments;
