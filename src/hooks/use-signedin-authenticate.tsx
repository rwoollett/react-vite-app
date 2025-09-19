import { useCurrentUserQuery } from "../store/api/authenticatedUsersApi";

function useSignedInAuthorize(): {
  isLoggedIn: boolean;
  userId: string | undefined;
  email: string;
  isLoading: boolean;
  expiry: number | undefined;
} {
  const { data, isLoading } = useCurrentUserQuery();
  return {
    isLoggedIn: data?.currentUser ? true : false,
    userId: data?.currentUser?.id,
    email: data?.currentUser?.email ? data?.currentUser?.email : '',
    expiry: data?.currentUser?.exp,
    isLoading
  };

}

export default useSignedInAuthorize;