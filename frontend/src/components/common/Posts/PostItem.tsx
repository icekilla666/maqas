import type { PostDetails, PostPreview } from "@/types/api.types";
import UserItem from "../UsersList/UserItem";
import { normalizedDate } from "@/utils/normalizedDate";
import { CornerUpRight, Ellipsis, Heart, MessageSquare } from "lucide-react";
import PostAction from "./PostAction";
import type { PostActionProps } from "@/types/entities";
import { usePostLikeMutation } from "@/lib/likesQueries";

interface PostItemProps {
  post: PostPreview | PostDetails;
  onClick?: () => void;
  onCommentsClick?: () => void;
  onLikeClick?: () => void;
  onLikersClick?: () => void;
  variant?: "card" | "detail";
}

const PostItem = ({
  post,
  onClick,
  onCommentsClick,
  onLikeClick,
  onLikersClick,
  variant = "card",
}: PostItemProps) => {
  const setPostLike = usePostLikeMutation();
  const pendingLike =
    setPostLike.isPending && setPostLike.variables.id === post.id
      ? setPostLike.variables
      : undefined;
  const isLiked = pendingLike?.nextIsLiked ?? post.is_liked;
  const likeCount = pendingLike?.nextLikesCount ?? post.likes_count;

  const postActions: PostActionProps[] = [
    {
      icon: <Heart size={18} />,
      ariaLabel: isLiked ? "Убрать лайк" : "Поставить лайк",
      value: likeCount,
      className: isLiked ? "liked" : "",
      disabled: setPostLike.isPending,
      onClick: () => {
        if (setPostLike.isPending) return;

        if (onLikeClick) {
          onLikeClick();
          return;
        }

        setPostLike.mutate({
          id: post.id,
          nextIsLiked: !post.is_liked,
          nextLikesCount: Math.max(
            0,
            post.likes_count + (post.is_liked ? -1 : 1),
          ),
        });
      },
    },
    {
      icon: <MessageSquare size={18} />,
      ariaLabel: "Комментарии",
      value: post.comments_count,
      onClick: () => {
        if (onCommentsClick) {
          onCommentsClick();
          return;
        }

        console.log("comm");
      },
    },
    {
      icon: <CornerUpRight size={18} />,
      ariaLabel: "Поделиться постом",
      onClick: () => console.log("send"),
    },
  ];

  const normalizedTime = normalizedDate({
    date: post.created_at,
    onlyTime: true,
  });

  const normalizedPostDate = normalizedDate({
    date: post.created_at,
    onlyDate: true,
    relativeToday: true,
  });

  const postContent = "preview" in post ? post.preview : post.content;

  return (
    <article
      className={`post-item post-item--${variant} ${
        onClick ? "post-item--clickable" : ""
      }`.trim()}
      onClick={onClick}
    >
      <header className="flex justify-between items-center mb-1.5">
        <UserItem user={post.user} showName={false} />
        <time className="post-item__datetime" dateTime={post.created_at}>
          <span className="post-item__date">{normalizedPostDate}</span>
          <span className="post-item__time">{normalizedTime}</span>
        </time>
      </header>
      <div className="flex flex-col gap-3">
        {post.image_url && (
          <div className="post-item__poster">
            <img src={post.image_url} alt={post.title} />
          </div>
        )}
        <div className="post-item__text flex flex-col gap-1.5">
          <h2>{post.title}</h2>
          <p className="post-item__content break-all">{postContent}</p>
        </div>
        <div className="flex gap-1 items-center flex-wrap">
          {post.tags.map((t) => (
            <span key={t.tag} className="post-item__tag bg-grey/70">
              {t.tag}
            </span>
          ))}
        </div>
        <div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {postActions.map((action) => (
                <PostAction
                  ariaLabel={action.ariaLabel}
                  className={action.className}
                  key={action.ariaLabel}
                  value={action.value}
                  icon={action.icon}
                  onClick={action.onClick}
                  disabled={action.disabled}
                />
              ))}
            </div>
            <button
              aria-label="Меню поста"
              onClick={(event) => {
                event.stopPropagation();
                console.log("menu");
              }}
              type="button"
            >
              <Ellipsis size={24} />
            </button>
          </div>
          {variant === "detail" && likeCount > 0 && (
            <button
              className="post-item__likers-link"
              onClick={(event) => {
                event.stopPropagation();
                onLikersClick?.();
              }}
              type="button"
            >
              {likeCount} отметок нравится
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostItem;
