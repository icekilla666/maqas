import type { ReactNode } from "react";
import type { BlackListUserData } from "./users.types";

export type HomeSort = "popular-desc" | "popular-asc" | "new" | "old";

export type PostTag =
  | "спорт"
  | "искусство"
  | "музыка"
  | "кино"
  | "игры"
  | "книги"
  | "наука"
  | "технологии"
  | "бизнес"
  | "путешествия"
  | "еда"
  | "мода"
  | "фотография"
  | "фитнес"
  | "здоровье"
  | "семья"
  | "отношения"
  | "юмор"
  | "лайфхаки"
  | "новости"
  | "политика";

export type PostTagData = {
  tag: PostTag;
};

export type PostHashtagData = {
  hashtag: string;
};

export type PostUserData = BlackListUserData;

type PostBase = {
  id: string;
  title: string;
  tags: PostTagData[];
  hashtags: PostHashtagData[] | null;
  image_url: string | null;
  created_at: string;
  user: PostUserData;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
};

export type PostPreview = PostBase & {
  preview: string;
};

export type PostDetails = PostBase & {
  content: string;
};

export type LikersData = BlackListUserData;

export type PostFeed = {
  feed_type?: "all" | "following";
  search_query?: string;
  tags?: PostTag[];
  sort?: "old" | "new" | "popular" | "popular_asc";
};

export type AddPostProps = {
  title: string;
  content: string;
  tags: PostTag[];
  image: File | null;
};

export type CreatedPost = PostDetails;

export type PostActionProps = {
  icon: ReactNode;
  ariaLabel: string;
  value?: number;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
};
