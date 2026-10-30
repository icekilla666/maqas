import type { PostUserData } from "./posts.types";

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
