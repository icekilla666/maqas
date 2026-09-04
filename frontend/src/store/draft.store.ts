import type { PostTag } from "@/types/api.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DraftState {
  title: string;
  content: string;
  tags: PostTag[];
  hashtags?: string;

  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setTags: (tags: PostTag[]) => void;
  setHashtags: (hashtags?: string) => void;

  resetDraft: () => void;
}

const initialState = {
  title: "",
  content: "",
  tags: [] as PostTag[],
  hashtags: "",
};

export const useDraftStore = create<DraftState>()(
  persist(
    (set) => ({
      ...initialState,

      setTitle: (title) => set({ title }),
      setContent: (content) => set({ content }),
      setTags: (tags) => set({ tags }),
      setHashtags: (hashtags) => set({ hashtags }),
      resetDraft: () => set(initialState),
    }),
    {
      name: "post-draft",
    },
  ),
);
