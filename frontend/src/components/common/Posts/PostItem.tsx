import type { PostOutShort } from "@/types/api.types";

const PostItem = ({ ...props }: PostOutShort) => {
  return (
    <article className="post-item" key={props.id}>
      <header>
        
      </header>
    </article>
  );
};

export default PostItem;
