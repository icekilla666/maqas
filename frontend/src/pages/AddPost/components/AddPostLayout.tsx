import AddPostTip from "./AddPostTip";
import AddPostEditor from "./AddPostEditor";
import AddPostAction from "./AddPostAction";
import { useState } from "react";
import type { AddPostProps } from "@/types/api.types";
import { useDraftStore } from "@/store/draft.store";
import { toast } from "sonner";

const AddPostLayout = () => {
  const {
    title,
    content,
    tags,
    hashtags,
    setTitle,
    setContent,
    setTags,
    setHashtags,
  } = useDraftStore();
  const [formData, setFormData] = useState<AddPostProps>({
    title: title ?? "",
    content: content ?? "",
    tags: tags ?? [],
    hashtags: hashtags ?? "",
    image: null,
  });

  const handleDraft = () => {
    setTitle(formData.title);
    setContent(formData.content);
    setTags(formData.tags);
    setHashtags(formData.hashtags);
    
    toast("Черновик сохранен")
  };

  return (
    <div className="add-post-layout">
      <AddPostEditor formData={formData} setFormData={setFormData} />
      <aside className="add-post-sidebar">
        <AddPostTip />

        <AddPostAction handleDraft={handleDraft} />
      </aside>
    </div>
  );
};

export default AddPostLayout;
