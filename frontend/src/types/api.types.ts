export interface RegisterData {
  username: string;
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ProfileProps {
  username?: string;
  name?: string;
  bio?: string;
}

export interface FollowProps {
  skip?: number;
  limit?: number;
}
