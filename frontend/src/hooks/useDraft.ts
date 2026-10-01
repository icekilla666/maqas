import { useDraftStore } from "@/store/draft.store";
import type { AddPostProps } from "@/types/api.types";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

export const useDraft = (data: AddPostProps) => {
  const { setTitle, setContent, setTags } = useDraftStore();
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelDraftSave = useCallback(() => {
    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    draftTimerRef.current = null;
  }, []);

  useEffect(() => cancelDraftSave, [cancelDraftSave]);

  const handleDraft = () => {
    setTitle(data.title);
    setContent(data.content);
    setTags(data.tags);

    toast("Черновик сохранен");
  };

  const saveDraftWithDebounce = (draft: AddPostProps = data) => {
    cancelDraftSave();
    draftTimerRef.current = setTimeout(() => {
      setTitle(draft.title);
      setContent(draft.content);
      setTags(draft.tags);
      draftTimerRef.current = null;
    }, 5000);
  };

  return {
    handleDraft,
    saveDraftWithDebounce,
    cancelDraftSave,
  };
};
