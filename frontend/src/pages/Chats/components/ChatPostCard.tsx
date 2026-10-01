import { useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { FileText, ArrowUpRight } from "lucide-react";
import { usePostQuery } from "@/lib/postsQueries";
import Skeleton from "@/components/ui/Skeleton/Skeleton";
import SkeletonView from "@/components/ui/Skeleton/SkeletonView";

interface ChatPostCardProps {
  postId: string;
  onContentLoad: () => void;
}

const ChatPostCard = ({ postId, onContentLoad }: ChatPostCardProps) => {
  const { data: post, isPending, isError, error, refetch, isFetching } =
    usePostQuery(postId);
  const unavailable =
    isAxiosError(error) && [403, 404, 410].includes(error.response?.status ?? 0);

  // Данные карточки приходят после сообщений и могут изменить высоту истории.
  useLayoutEffect(() => {
    onContentLoad();
  }, [post, isPending, isError, onContentLoad]);

  if (isPending) {
    return (
      <SkeletonView label="Загрузка публикации…" className="chat-post-card">
        <div className="chat-post-card__body skeleton-stack">
          <Skeleton width="40%" height={10} />
          <Skeleton height={18} />
          <Skeleton height={12} />
          <Skeleton width="70%" height={12} />
        </div>
      </SkeletonView>
    );
  }

  if (isError || !post) {
    return (
      <div className="chat-post-card chat-post-card--placeholder">
        <FileText size={24} />
        <span>
          {unavailable ? "Публикация недоступна" : "Не удалось загрузить публикацию"}
        </span>
        {!unavailable && (
          <button
            type="button"
            className="chat-post-card__retry"
            disabled={isFetching}
            onClick={() => void refetch()}
          >
            {isFetching ? "Загрузка…" : "Повторить"}
          </button>
        )}
      </div>
    );
  }

  return (
    <Link
      to={`/posts/${postId}`}
      className="chat-post-card"
      draggable={false}
      aria-label={`Открыть публикацию: ${post.title}`}
    >
      <span className="chat-post-card__label">
        <FileText size={14} />Публикация<ArrowUpRight size={14} />
      </span>
      {post.image_url && (
        <img
          className="chat-post-card__image"
          src={post.image_url}
          alt=""
          draggable={false}
          onLoad={onContentLoad}
          onError={(event) => {
            event.currentTarget.hidden = true;
            onContentLoad();
          }}
        />
      )}
      <span className="chat-post-card__body">
        <span className="chat-post-card__author">
          {post.user.name || post.user.username}
        </span>
        <strong className="chat-post-card__title">{post.title}</strong>
        {post.content && (
          <span className="chat-post-card__text">{post.content}</span>
        )}
      </span>
    </Link>
  );
};

export default ChatPostCard;
