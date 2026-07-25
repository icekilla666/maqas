import type { PostOutShort } from "@/types/api.types";
import PostItem from "./PostItem";

const PostsList = ({ posts }: { posts: PostOutShort[] }) => {
  return (
    <div className="flex flex-col gap-2">
      {posts.map((post) => (
        <PostItem key={post.id} {...post} />
      ))}
    </div>
  );
};

export default PostsList;
