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

export type PostOut = {
  id: string;
  title: string;
  content: string;
  tags: PostTagData[];
  hashtags: PostHashtagData[] | null;
  image_url: string | null;
  created_at: string;
  user: PostUserData;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
};

export type LikersData = BlackListUserData;

export type CommentData = {
  id: string;
  preview: string | null;
  is_deleted: boolean;
  replies_count: number;
  parent_id: string | null;
  created_at: string;
  is_owner: boolean;
  user: PostUserData;
};

export type PostFeed = {
  feed_type?: "all" | "following";
  search_query?: string;
  tags?: PostTag[];
  sort?: "old" | "new" | "popular";
};

export type AddPostProps = {
  title: string;
  content: string;
  tags: PostTag[];
  hashtags?: string;
  image: File | null;
};
