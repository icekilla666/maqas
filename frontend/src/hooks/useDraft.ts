import { useDraftStore } from "@/store/draft.store";
import type { AddPostProps } from "@/types/api.types";
import { useRef } from "react";
import { toast } from "sonner";

export const useDraft = (data: AddPostProps) => {
  const { setTitle, setContent, setTags } = useDraftStore();
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDraft = () => {
    setTitle(data.title);
    setContent(data.content);
    setTags(data.tags);

    toast("Черновик сохранен");
  };

  const saveDraftWithDebounce = () => {
    if (draftTimerRef.current) {
      clearTimeout(draftTimerRef.current);
    }

    draftTimerRef.current = setTimeout(() => {
      handleDraft();
    }, 5000);
  };

  return {
    handleDraft,
    saveDraftWithDebounce,
  };
};
