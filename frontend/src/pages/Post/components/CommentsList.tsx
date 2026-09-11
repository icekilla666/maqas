import type { CommentPreview } from "@/types/api.types";
import CommentItem from "./CommentItem";

interface CommentsListProps {
  comments: CommentPreview[];
  onReply: (comment: CommentPreview) => void;
  onEdit: (comment: CommentPreview) => void;
}

const CommentsList = ({ comments, onReply, onEdit }: CommentsListProps) => {
  const rootComments = comments.filter((comment) => !comment.parent_id);

  if (!rootComments.length) {
    return (
      <div className="comments-list__empty">
        <p>Комментариев пока нет</p>
      </div>
    );
  }

  return (
    <ul className="comments-list">
      {rootComments.map((comment) => (
        <CommentItem
          comment={comment}
          key={comment.id}
          onReply={onReply}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
};

export default CommentsList;
