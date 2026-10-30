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
