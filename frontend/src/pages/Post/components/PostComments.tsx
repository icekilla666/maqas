import CommentInput from "@/components/ui/Inputs/CommentInput";
import Loader from "@/components/ui/Loaders/Loader";
import {
  useCommentSendMutation,
  useCommentUpdateMutation,
} from "@/lib/commentsQueries";
import { queryClient } from "@/lib/queryClient";
import { commentsApi } from "@/services/comments.api";
import type { CommentPreview } from "@/types/api.types";
import { commentsKeys } from "@/utils/constants";
import { Pencil, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import CommentsList from "./CommentsList";

interface PostCommentsProps {
  postId: string;
  comments: CommentPreview[];
  isLoading?: boolean;
}

type ComposerTarget = {
  type: "reply" | "edit";
  comment: CommentPreview;
};

const PostComments = ({
  postId,
  comments,
  isLoading = false,
}: PostCommentsProps) => {
  const [value, setValue] = useState("");
  const [target, setTarget] = useState<ComposerTarget | null>(null);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const editRequest = useRef(0);
  const sendComment = useCommentSendMutation();
  const updateComment = useCommentUpdateMutation();
  const isSubmitting = sendComment.isPending || updateComment.isPending;
  const isEditing = target?.type === "edit";
  const replyingTo = target?.type === "reply" ? target.comment : null;

  useEffect(() => {
    return () => {
      editRequest.current += 1;
    };
  }, []);

  useEffect(() => {
    if (!target || isEditLoading) return;
    inputRef.current?.focus({ preventScroll: true });
    inputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [target, isEditLoading]);

  const resetComposer = () => {
    editRequest.current += 1;
    setTarget(null);
    setValue("");
    setIsEditLoading(false);
  };

  const handleReply = (comment: CommentPreview) => {
    if (isSubmitting) return;
    editRequest.current += 1;
    if (isEditing) setValue("");
    setIsEditLoading(false);
    setTarget({ type: "reply", comment });
  };

  const handleEdit = async (comment: CommentPreview) => {
    if (isSubmitting || !comment.is_owner || comment.is_deleted) return;
    const request = ++editRequest.current;
    setTarget({ type: "edit", comment });
    setValue("");
    setIsEditLoading(true);

    try {
      // Для редактирования нужен полный текст, а не обрезанный preview.
      const full = await queryClient.fetchQuery({
        queryKey: commentsKeys.fullComment(comment.id),
        queryFn: () => commentsApi.getFullComment(comment.id),
        staleTime: 0,
      });
      // Не подставляем старый ответ после отмены или выбора другого комментария.
      if (request !== editRequest.current) return;
      if (!full.is_owner || full.is_deleted || full.content === null) {
        resetComposer();
        toast.error("Комментарий недоступен для редактирования");
        return;
      }
      setValue(full.content);
      setIsEditLoading(false);
    } catch {
      if (request !== editRequest.current) return;
      resetComposer();
      toast.error("Не удалось загрузить текст комментария");
    }
  };

  const handleSubmit = (content: string) => {
    if (isSubmitting || isEditLoading || !content.trim()) return;
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
                ? isEditLoading
                  ? "Загрузка комментария…"
                  : "Редактирование комментария"
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
          disabled={isEditLoading || isSubmitting}
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
