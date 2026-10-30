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
  is_read: boolean;
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
  is_edited?: boolean;
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
