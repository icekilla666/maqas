import CommentInput from "@/components/ui/Inputs/CommentInput";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/ui/Loaders/Loader";
import {
  useCommentSendMutation,
  useCommentUpdateMutation,
} from "@/lib/commentsQueries";
import type { CommentData } from "@/types/api.types";
import { Pencil, TriangleAlert, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CommentsList from "./CommentsList";

interface PostCommentsProps {
  postId: string;
  comments: CommentData[];
  isLoading?: boolean;
  error?: unknown;
}

type ComposerTarget = {
  type: "reply" | "edit";
  comment: CommentData;
};

const PostComments = ({
  postId,
  comments,
  isLoading = false,
  error,
}: PostCommentsProps) => {
  const [value, setValue] = useState("");
  const [target, setTarget] = useState<ComposerTarget | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sendComment = useCommentSendMutation();
  const updateComment = useCommentUpdateMutation();
  const isSubmitting = sendComment.isPending || updateComment.isPending;
  const isEditing = target?.type === "edit";
  const replyingTo = target?.type === "reply" ? target.comment : null;

  useEffect(() => {
    if (!target) return;
    inputRef.current?.focus({ preventScroll: true });
    inputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [target]);

  const resetComposer = () => {
    setTarget(null);
    setValue("");
  };

  const handleReply = (comment: CommentData) => {
    if (isSubmitting) return;
    if (isEditing) setValue("");
    setTarget({ type: "reply", comment });
  };

  const handleEdit = (comment: CommentData) => {
    if (isSubmitting || !comment.is_owner || comment.is_deleted || comment.content === null) return;
    setTarget({ type: "edit", comment });
    setValue(comment.content);
  };

  const handleSubmit = (content: string) => {
    if (isSubmitting || !content.trim()) return;
    if (target?.type === "edit") {
      updateComment.mutate(
        { comment_id: target.comment.id, content },
        { onSuccess: resetComposer },
      );
    } else {
      sendComment.mutate(
        { id: postId, parent_id: replyingTo?.id ?? null, content },
        { onSuccess: resetComposer },
      );
    }
  };

  return (
    <section id="comments" className="post-comments anchor-section">
      <div className="post-comments__header">
        <h2>Комментарии</h2>
      </div>

      <div className="post-comments__list-wrapper">
        {isLoading ? (
          <div className="post-comments__loader">
            <Loader width={34} />
          </div>
        ) : error ? (
          <EmptyState icon={<TriangleAlert />} text="Не удалось загрузить комментарии" error={error} isError />
        ) : (
          <CommentsList
            comments={comments}
            onReply={handleReply}
            onEdit={handleEdit}
          />
        )}
      </div>

      <div className="post-comments__composer">
        {target && (
          <div className="post-comments__replying">
            <span className="post-comments__composer-status" role="status">
              {isEditing && <Pencil size={14} aria-hidden="true" />}
              {isEditing
                ? "Редактирование комментария"
                : `Ответ @${replyingTo?.user.username}`}
            </span>
            <button
              aria-label={isEditing ? "Отменить редактирование" : "Отменить ответ"}
              disabled={isSubmitting}
              onClick={() => {
                if (isSubmitting) return;
                if (isEditing) resetComposer();
                else setTarget(null);
              }}
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <CommentInput
          inputRef={inputRef}
          onChange={setValue}
          onSubmit={handleSubmit}
          disabled={isSubmitting}
          placeholder={
            isEditing
              ? "Редактировать комментарий"
              : replyingTo
                ? `Ответить @${replyingTo.user.username}`
                : "Написать комментарий"
          }
          submitLabel={
            isEditing
              ? "Сохранить изменения"
              : replyingTo
                ? "Отправить ответ"
                : "Отправить комментарий"
          }
          value={value}
        />
      </div>
    </section>
  );
};

export default PostComments;
