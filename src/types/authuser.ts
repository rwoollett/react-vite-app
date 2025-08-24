export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  password: string;
  accessToken: string;
  exp: number;
}

export type CurrentUser = Pick<AuthenticatedUser, "id" | "email" | "exp">;
export interface CurrentUserCheck {
  currentUser?: CurrentUser;
}

export type SignInUser = Pick<AuthenticatedUser, "email" | "password">;