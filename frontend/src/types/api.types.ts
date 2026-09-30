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
  blocked_by_user: boolean;
  blocked_user: boolean;
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

export type SendCommentsProps = {
  id?: string;
  parent_id: string | null;
  content?: string;
};

export type CommentData = {
  id: string;
  content: string | null;
  is_deleted: boolean;
  is_edited: boolean;
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
  image: File | null;
};

export type CreatedPost = PostDetails;

export type ChatUserData = {
  id: string;
  username: string;
  name: string;
  avatar_url: string | null;
  level: string;
  status: string;
};

export type LastMessage = {
  content: string | null;
  created_at: string;
  image_url: string | null;
  is_owner: boolean;
  is_read?: boolean;
};

export type ChatShortData = {
  id: string;
  is_blocking: boolean | null;
  is_blocked: boolean | null;
};

export type ChatData = {
  id: string;
  unread_count: number;
  target_user: ChatUserData;
  last_message: LastMessage | null;
};

export type ChatMessageData = {
  id: string;
  chat_id: string;
  content: string | null;
  image_url: string | null;
  is_read: boolean;
  created_at: string;
  parent_id: string | null;
  sender: ChatUserData;
  is_owner: boolean | null;
};

export type CreateChatMessageProps = {
  chat_id: string;
  content?: string | null;
  parent_id?: string | null;
  image?: File | null;
};

export type UpdateChatMessageProps = {
  message_id: string;
  content?: string | null;
  image?: File | null;
  image_removed: boolean;
};
