import { useEffect, type JSX } from 'react';
import { useNavigate } from "react-router-dom";
import { useSignOutMutation } from '../store/api/authenticatedUsersApi';
import { setContents } from '../store/actions/data';
import { useAppDispatch } from '../store/reducers/store';
import { ROUTES } from '../resources/routes-constants';

const SignOut = (): JSX.Element => {
  const [signOut] = useSignOutMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        await signOut().unwrap();
        if (!isMounted) return;

        dispatch(setContents([]));
        navigate(ROUTES.HOMEPAGE_ROUTE);
      } catch (error) {
        console.log(error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [signOut, dispatch, navigate]);

  return <div>Signing you out...</div>;
};

export default SignOut;