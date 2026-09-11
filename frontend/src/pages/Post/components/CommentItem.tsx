import Avatar from "@/components/common/Avatar/Avatar";
import { useRepliesComment } from "@/lib/commentsQueries";
import type { CommentPreview } from "@/types/api.types";
import { normalizedDate } from "@/utils/normalizedDate";
import { ChevronDown, Reply } from "lucide-react";
import { useId, useState } from "react";

interface CommentItemProps {
  comment: CommentPreview;
  replies?: CommentPreview[];
  level?: 0 | 1;
  onReply: (comment: CommentPreview) => void;
}

const CommentItem = ({ comment, level = 0, onReply }: CommentItemProps) => {
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);
  const repliesId = useId();
  const isReplies = level === 0 && comment.replies_count > 0;
  const { data: replies = [] } = useRepliesComment(comment.id);

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
            size={24}
            width={32}
            username={comment.user.username}
          />
        </div>
        <div className="comment-item__content">
          <div className="comment-item__top">
            <span className="comment-item__username">
              {comment.user.username}
            </span>
            {comment.is_owner && (
              <span className="comment-item__badge">вы</span>
            )}
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
          {isReplies && (
            <button
              className="comment-item__replies-toggle"
              type="button"
              aria-expanded={isRepliesOpen}
              aria-controls={repliesId}
              onClick={() => setIsRepliesOpen((previous) => !previous)}
            >
              <span className="comment-item__replies-line" aria-hidden="true" />
              <span>{isRepliesOpen ? "Скрыть ответы" : "Показать ответы"}</span>
              <span className="comment-item__replies-count">
                {comment.replies_count}
              </span>
              <ChevronDown size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {isReplies && (
        <ul
          id={repliesId}
          className="comment-item__replies"
          hidden={!isRepliesOpen}
        >
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
