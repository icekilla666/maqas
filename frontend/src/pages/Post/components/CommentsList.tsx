import type { CommentData } from "@/types/api.types";
import CommentItem from "./CommentItem";

interface CommentsListProps {
  comments: CommentData[];
  onReply: (comment: CommentData) => void;
}

const CommentsList = ({ comments, onReply }: CommentsListProps) => {
  const rootComments = comments.filter((comment) => !comment.parent_id);
  const repliesByParent = comments.reduce<Record<string, CommentData[]>>(
    (acc, comment) => {
      if (!comment.parent_id) return acc;

      acc[comment.parent_id] = [...(acc[comment.parent_id] ?? []), comment];
      return acc;
    },
    {},
  );

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
          replies={repliesByParent[comment.id] ?? []}
        />
      ))}
    </ul>
  );
};

export default CommentsList;
