export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

export type CurrentUser = Pick<AuthenticatedUser, "id" | "email">;
export interface CurrentUserCheck {
  currentUser?: CurrentUser;
}

export type SignInUser = Pick<AuthenticatedUser, "email" | "password">;