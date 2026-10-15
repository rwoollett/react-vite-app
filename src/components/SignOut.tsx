import { useCallback, useEffect, useRef, type JSX } from 'react';
import { useNavigate } from "react-router-dom";
import { useSignOutMutation } from '../store/api/authenticatedUsersApi';
import { setContents } from '../store/actions/data';
import { useAppDispatch } from '../store/reducers/store';
import { ROUTES } from '../resources/routes-constants';
import { useWebSocket } from '../hooks/use-websocket-context';
import useSignedInAuthorize from '../hooks/use-signedin-authenticate';

const SignOut = (): JSX.Element => {
  const { isLoggedIn } = useSignedInAuthorize();
  const { wsRefGateway, gatewayWsId } = useWebSocket();
  const [signOut] = useSignOutMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const doLogout = useCallback(async () => {
    if (!isLoggedIn || !gatewayWsId) return;

    try {
      await signOut().unwrap();
      if (gatewayWsId) {
        wsRefGateway.current?.send({
          subject: "ws_logout_Token",
          payload: { wsId: gatewayWsId }
        });
      }

      dispatch(setContents([]));
      navigate(ROUTES.HOMEPAGE_ROUTE);

    } catch (error) {
      console.log(error);
    }
  }, [isLoggedIn, signOut, dispatch, navigate, gatewayWsId, wsRefGateway]);

  const hasLoggedOut = useRef(false);

  useEffect(() => {

    if (hasLoggedOut.current) return;
    hasLoggedOut.current = true;
    
    doLogout();
  }, [doLogout]);

  return <div>Signing you out...</div>;
};

export default SignOut;