import type { PostDetails, PostPreview } from "@/types/api.types";
import UserItem from "../UsersList/UserItem";
import { normalizedDate } from "@/utils/normalizedDate";
import { CornerUpRight, Ellipsis, Heart, MessageSquare } from "lucide-react";
import PostAction, { type PostActionProps } from "./PostAction";

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
  const postActions: PostActionProps[] = [
    {
      icon: <Heart size={18} />,
      ariaLabel: post.is_liked ? "Убрать лайк" : "Поставить лайк",
      value: post.likes_count,
      onClick: () => {
        if (onLikeClick) {
          onLikeClick();
          return;
        }

        console.log("like");
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
                  key={action.ariaLabel}
                  value={action.value}
                  icon={action.icon}
                  onClick={action.onClick}
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
          {variant === "detail" && post.likes_count > 0 && (
            <button
              className="post-item__likers-link"
              onClick={(event) => {
                event.stopPropagation();
                onLikersClick?.();
              }}
              type="button"
            >
              {post.likes_count} отметок нравится
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostItem;
