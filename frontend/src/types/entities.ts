export type UserData = {
  id: number;
  username: string;
  name: string;
  email: string;
  password: string;
  password_confirm: string;
  role?: "user" | "admin";
};

export type AccountData = {
  id: string;
  username: string;
  name: string;
  avatar_url: string;
  status: string;
  email: string;
  bio: string;
  followers_count: number;
  followings_count: number;
};

// type FormData = Omit<UserData, 'id' | 'role'>
