export type UserData = {
  id: number;
  username: string;
  name: string;
  email: string;
  password: string;
  password_confirm: string;
  role?: "user" | "admin";
};

// type FormData = Omit<UserData, 'id' | 'role'>
