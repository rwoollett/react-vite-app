export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export type CurrentUser = Pick<User, "id" | "email">;
export interface CurrentUserCheck {
  currentUser?: CurrentUser;
}