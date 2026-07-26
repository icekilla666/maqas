import type { PostOut } from "@/types/api.types";
import UserItem from "../UsersList/UserItem";
import { normalizedDate } from "@/utils/normalizedDate";
import { Ellipsis, Heart, MessageSquare, Send } from "lucide-react";
import PostAction, { type PostActionProps } from "./PostAction";

interface PostItempost {
  post: PostOut;
  onClick?: () => void;
}

const PostItem = ({ post, onClick }: PostItempost) => {
  const postActions: PostActionProps[] = [
    {
      icon: <Heart size={16} />,
      value: post.likes_count,
      onClick: () => console.log("like"),
    },
    {
      icon: <MessageSquare size={16} />,
      value: post.likes_count,
      onClick: () => console.log("comm"),
    },
    {
      icon: <Send size={16} />,
      onClick: () => console.log("send"),
    },
  ];
  const normalizedTime = normalizedDate({
    date: post.created_at,
    onlyTime: true,
  });
  return (
    <article className="post-item" onClick={onClick}>
      <header className="flex justify-between items-center mb-1.5">
        <UserItem user={post.user} showName={false} />
        <span className="text-second text-xs opacity-50">
          {normalizedTime} pm
        </span>
      </header>
      <div className="flex flex-col gap-3">
        {post.image_url && (
          <div className="post-item__poster">
            <img src={post.image_url} alt={post.title} />
          </div>
        )}
        <div className="post-item__text flex flex-col gap-1.5">
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
        <div className="flex gap-1 items-center flex-wrap">
          {post.tags.map((t) => (
            <span key={t.tag} className="post-item__tag bg-grey/70">
              {t.tag}
            </span>
          ))}
        </div>
        <div className="post-item__actions">
          <div className="flex items-center gap-3">
            {postActions.map((action) => (
              <PostAction
                value={action.value}
                icon={action.icon}
                onClick={action.onClick}
              />
            ))}
          </div>
          <button onClick={() => console.log("menu")}>
            <Ellipsis size={24} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default PostItem;
