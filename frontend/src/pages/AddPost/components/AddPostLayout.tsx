import AddPostTip from "./AddPostTip";
import AddPostEditor from "./AddPostEditor";
import AddPostAction from "./AddPostAction";
import { useState } from "react";
import type { AddPostProps } from "@/types/api.types";
import { useDraftStore } from "@/store/draft.store";
import { useDraft } from "@/hooks/useDraft";
import { useCreatePostMutation } from "@/lib/postsQueries";

const AddPostLayout = () => {
  const { title, content, tags } = useDraftStore();
  const [formData, setFormData] = useState<AddPostProps>({
    title: title ?? "",
    content: content ?? "",
    tags: tags ?? [],
    image: null,
  });
  const { handleDraft } = useDraft(formData);
  const createPost = useCreatePostMutation();

  return (
    <div className="add-post-layout">
      <AddPostEditor
        createPost={createPost}
        formData={formData}
        setFormData={setFormData}
      />
      <aside className="add-post-sidebar">
        <AddPostTip />
        <AddPostAction
          isPending={createPost.isPending}
          handleDraft={handleDraft}
        />
      </aside>
    </div>
  );
};

export default AddPostLayout;
