import type { AddPostProps, PostTag } from "@/types/api.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DraftState {
  title: string;
  content: string;
  tags: PostTag[];
  publicationUnconfirmed: boolean;
  beginPublication: (data: Pick<AddPostProps, "title" | "content" | "tags">) => void;
  setPublicationUnconfirmed: (value: boolean) => void;

  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setTags: (tags: PostTag[]) => void;

  resetDraft: () => void;
}

const initialState = {
  title: "",
  content: "",
  tags: [] as PostTag[],
  publicationUnconfirmed: false,
};

export const useDraftStore = create<DraftState>()(
  persist(
    (set) => ({
      ...initialState,
      // Маркер сохраняется до ответа: перезагрузка не разрешает повторный POST.
      beginPublication: ({ title, content, tags }) => set({
        title, content, tags, publicationUnconfirmed: true,
      }),
      setPublicationUnconfirmed: (publicationUnconfirmed) => set({ publicationUnconfirmed }),

      setTitle: (title) => set({ title }),
      setContent: (content) => set({ content }),
      setTags: (tags) => set({ tags }),
      resetDraft: () => set(initialState),
    }),
    {
      name: "post-draft",
    },
  ),
);
