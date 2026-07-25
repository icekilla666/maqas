export type RegisterData = {
  username: string;
  name: string;
  email: string;
  password: string;
  password_confirm: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type ProfileProps = {
  username?: string;
  name?: string;
  bio?: string;
};

export type ListUsersProps = {
  skip?: number;
  limit?: number;
};

export type AccountData = {
  id: string;
  username: string;
  name: string;
  avatar_url: string;
  status: string;
  email: string;
  level: string;
  bio: string;
  followers_count: number;
  followings_count: number;
  posts_count: number;
};

export type UserData = AccountData & {
  is_blocked: boolean;
  is_following: boolean;
};

export type BlackListUserData = Omit<
  AccountData,
  "email" | "bio" | "followers_count" | "followings_count" | "posts_count"
>;

export type FindUsers = BlackListUserData & {
  is_following: boolean;
};

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

export type PostUserData = {
  id: string;
  username: string;
  name: string;
  avatar_url: string | null;
  level: string;
  status: string;
};

export type PostOutShort = {
  id: string;
  title: string;
  preview: string;
  tags: PostTagData[];
  hashtags: PostHashtagData[] | null;
  image_url: string | null;
  created_at: string;
  user: PostUserData;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
};

export type PostOutFull = Omit<PostOutShort, "preview"> & {
  content: string;
};
