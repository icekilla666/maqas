import type { PostPreview } from "@/types/posts.types";
import PostItem from "./PostItem";
import { useNavigate } from "react-router-dom";
interface PostListProps {
  posts: PostPreview[];
  count?: number;
}
const PostsList = ({ posts, count }: PostListProps) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-2 mt-1.5">
      {count && <h2>Посты {posts.length}</h2>}
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          onClick={() => navigate(`/posts/${post.id}`, { state: { fromPostList: true } })}
          onCommentsClick={() => navigate(`/posts/${post.id}#comments`, { state: { fromPostList: true } })}
        />
      ))}
    </div>
  );
};

export default PostsList;
