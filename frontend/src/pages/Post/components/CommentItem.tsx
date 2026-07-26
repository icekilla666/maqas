import Avatar from "@/components/common/Avatar/Avatar";
import type { CommentData } from "@/types/api.types";
import { normalizedDate } from "@/utils/normalizedDate";
import { Reply } from "lucide-react";

interface CommentItemProps {
  comment: CommentData;
  replies?: CommentData[];
  level?: 0 | 1;
  onReply: (comment: CommentData) => void;
}

const CommentItem = ({
  comment,
  replies = [],
  level = 0,
  onReply,
}: CommentItemProps) => {
  const normalizedTime = normalizedDate({
    date: comment.created_at,
    onlyTime: true,
  });
  const commentText = comment.is_deleted
    ? "Комментарий удален"
    : comment.preview;

  return (
    <li
      className={`comment-item ${
        level === 1 ? "comment-item--reply" : ""
      }`.trim()}
    >
      <div className="comment-item__body">
        <div className="comment-item__avatar">
          <Avatar
            avatar={comment.user.avatar_url}
            size={32}
            width={32}
            username={comment.user.username}
          />
        </div>
        <div className="comment-item__content">
          <div className="comment-item__top">
            <span className="comment-item__username">
              {comment.user.username}
            </span>
            {comment.is_owner && <span className="comment-item__badge">вы</span>}
            <span className="comment-item__time">{normalizedTime}</span>
          </div>
          <p
            className={`comment-item__text ${
              comment.is_deleted ? "comment-item__text--deleted" : ""
            }`.trim()}
          >
            {commentText}
          </p>
          {!comment.is_deleted && (
            <button
              className="comment-item__reply-button"
              onClick={() => onReply(comment)}
              type="button"
            >
              <Reply size={14} />
              <span>Ответить</span>
            </button>
          )}
        </div>
      </div>

      {level === 0 && replies.length > 0 && (
        <ul className="comment-item__replies">
          {replies.map((reply) => (
            <CommentItem
              comment={reply}
              key={reply.id}
              level={1}
              onReply={onReply}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default CommentItem;
