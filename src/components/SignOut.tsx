import { useCallback, useEffect, type JSX } from 'react';
import { useNavigate } from "react-router-dom";
import { useSignOutMutation } from '../store/api/authenticatedUsersApi';
import { setContents } from '../store/actions/data';
import { useAppDispatch } from '../store/reducers/store';
import { ROUTES } from '../resources/routes-constants';
import { useWebSocket } from '../hooks/use-websocket-context';

const SignOut = (): JSX.Element => {
  const [signOut] = useSignOutMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { wsRefGateway, gatewayUserId } = useWebSocket();

  const doLogout = useCallback(async () => {
    try {
      await signOut().unwrap();

      dispatch(setContents([]));

      if (gatewayUserId) {
        wsRefGateway.current?.send({
          subject: "ws_logout_Token",
          payload: { userId: gatewayUserId }
        });
      }

      navigate(ROUTES.HOMEPAGE_ROUTE);

    } catch (error) {
      console.log(error);
    }
  }, [signOut, dispatch, navigate, gatewayUserId, wsRefGateway]);

  useEffect(() => {
    doLogout();
  }, [doLogout]);

  return <div>Signing you out...</div>;
};

export default SignOut;