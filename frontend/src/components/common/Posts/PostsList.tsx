import type { PostPreview } from "@/types/api.types";
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
          onClick={() => navigate(`/posts/${post.id}`)}
        />
      ))}
    </div>
  );
};

export default PostsList;
