import Avatar from "@/components/common/Avatar/Avatar";
import {
  useCommentDeleteMutation,
  useFullComment,
  useRepliesComment,
} from "@/lib/commentsQueries";
import type { CommentPreview } from "@/types/api.types";
import DateTime from "@/components/common/DateTime";
import { ChevronDown, Pencil, Reply, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import ItemMenu from "@/components/common/ItemMenu";
import type { ActionMenuItem } from "@/components/ui/ActionMenu/ActionMenu";
import ModalActions from "@/components/ui/Modals/ModalActions";

interface CommentItemProps {
  comment: CommentPreview;
  replies?: CommentPreview[];
  level?: 0 | 1;
  onReply: (comment: CommentPreview) => void;
  onEdit: (comment: CommentPreview) => void;
}

const CommentItem = ({ comment, level = 0, onReply, onEdit }: CommentItemProps) => {
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);
  const [isFullComment, setIsFullComment] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const deleteComment = useCommentDeleteMutation();
  const repliesId = useId();
  const isReplies = level === 0 && comment.replies_count > 0;
  const { data: full } = useFullComment(comment.id, isFullComment);
  const { data: replies = [] } = useRepliesComment(comment.id, isReplies);
  const commentText = comment.is_deleted
    ? "Комментарий удален"
    : isFullComment
      ? (full?.content ?? comment.preview)
      : comment.preview;

  const actions: ActionMenuItem[] = [
    {
      text: "Ответить",
      icon: <Reply size={17} />,
      onClick: () => onReply(comment),
    },
    ...(comment.is_owner
      ? [
          {
            text: "Редактировать",
            icon: <Pencil size={17} />,
            onClick: () => onEdit(comment),
          },
          {
            text: "Удалить комментарий",
            icon: <Trash2 size={17} />,
            onClick: () => setIsDeleteOpen(true),
            className: "text-red",
          },
        ]
      : []),
  ];

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

            <div className="comment-item__aside">
              <DateTime
                date={comment.created_at}
                className="comment-item__time"
              />
              {!comment.is_deleted && (
                <ItemMenu
                  reportTarget="comment"
                  actions={actions}
                  ariaLabel="Меню комментария"
                  className="comment-item__menu"
                />
              )}
            </div>
          </div>
          <p
            className={`comment-item__text ${
              comment.is_deleted ? "comment-item__text--deleted" : ""
            }`.trim()}
          >
            {commentText}
            {!isFullComment &&
              comment.preview &&
              comment.preview.length > 40 && (
                <>
                  {"… "}
                  <button
                    className="comment-item__read-more"
                    type="button"
                    onClick={() => setIsFullComment(true)}
                  >
                    Читать дальше
                  </button>
                </>
              )}
          </p>
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
              onEdit={onEdit}
            />
          ))}
        </ul>
      )}
      {isDeleteOpen && comment.is_owner && !comment.is_deleted && (
        <ModalActions
          open
          text="Удалить комментарий?"
          confirmText={deleteComment.isPending ? "Удаление…" : "Удалить"}
          cancelText="Отмена"
          isPending={deleteComment.isPending}
          onCancel={() => setIsDeleteOpen(false)}
          onConfirm={() =>
            deleteComment.mutate(comment.id, {
              onSuccess: () => setIsDeleteOpen(false),
            })
          }
        />
      )}
    </li>
  );
};

export default CommentItem;
