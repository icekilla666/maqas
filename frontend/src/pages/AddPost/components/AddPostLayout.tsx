import AddPostTip from "./AddPostTip";
import AddPostEditor from "./AddPostEditor";
import AddPostAction from "./AddPostAction";
import { useState } from "react";
import type { AddPostProps } from "@/types/api.types";
import { useDraftStore } from "@/store/draft.store";
import { useDraft } from "@/hooks/useDraft";
import { useCreatePostMutation } from "@/lib/postsQueries";
import { useIsMutating } from "@tanstack/react-query";
import { postsKeys } from "@/utils/constants";

const AddPostLayout = () => {
  const { title, content, tags, publicationUnconfirmed } = useDraftStore();
  const [formData, setFormData] = useState<AddPostProps>({
    title: title ?? "",
    content: content ?? "",
    tags: tags ?? [],
    image: null,
  });
  const { handleDraft } = useDraft(formData);
  const createPost = useCreatePostMutation();
  const isPublishing = useIsMutating({ mutationKey: postsKeys.createPost() }) > 0;
  const [previousUnconfirmed, setPreviousUnconfirmed] = useState(publicationUnconfirmed);

  if (previousUnconfirmed !== publicationUnconfirmed) {
    setPreviousUnconfirmed(publicationUnconfirmed);
    // Запрос мог начаться до повторного открытия редактора. При его завершении
    // берём актуальный черновик: после успеха он уже очищен в мутации.
    if (previousUnconfirmed && !publicationUnconfirmed && createPost.isIdle) {
      setFormData((previous) => ({ title, content, tags, image: previous.image }));
    }
  }

  return (
    <div className="add-post-layout">
      <AddPostEditor
        createPost={createPost}
        formData={formData}
        setFormData={setFormData}
        disabled={isPublishing || publicationUnconfirmed}
      />
      <aside className="add-post-sidebar">
        <AddPostTip />
        <AddPostAction
          isPending={isPublishing}
          isUnconfirmed={publicationUnconfirmed}
          handleDraft={handleDraft}
        />
      </aside>
    </div>
  );
};

export default AddPostLayout;
