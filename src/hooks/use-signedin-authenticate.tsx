import { useCurrentUserQuery } from "../store/api/authenticatedUsersApi";

function useSignedInAuthorize(): {
  isLoggedIn: boolean;
  userId: string | undefined;
  email: string;
  isLoading: boolean;
  expiry: number | undefined;
  isError: boolean;
  errorMsg: string | undefined;
} {
//  const [refreshToken] = useRefreshTokenMutation();
  
  const { data, error, isLoading, isError} = useCurrentUserQuery();
  console.log(isError, error, data);
  // if (isError) {
  //   refreshToken().unwrap();
  // }
  
  return {
    isLoggedIn: data?.currentUser ? true : false,
    userId: data?.currentUser?.id,
    email: data?.currentUser?.email ? data?.currentUser?.email : '',
    expiry: data?.currentUser?.exp,
    isLoading,
    isError,
    errorMsg: undefined
  };

}

export default useSignedInAuthorize;