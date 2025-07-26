import { useCurrentUserQuery } from "../store/api/usersApi";

function useSignedInAuthorize(): {
  isLoggedIn: boolean;
  userId: string | undefined;
  email: string | undefined;
  isLoading: boolean;
} {
  const { data, isLoading } = useCurrentUserQuery();
  return {
    isLoggedIn: data?.currentUser ? true : false,
    userId: data?.currentUser?.id,
    email: data?.currentUser?.email,
    isLoading
  };

}

export default useSignedInAuthorize;