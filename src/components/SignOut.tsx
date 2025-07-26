import { useEffect, type JSX } from 'react';
import { useNavigate } from "react-router-dom";
import { useSignOutMutation } from '../store/api/usersApi';
import { setContents } from '../store/actions/data';
import { useAppDispatch } from '../store/reducers/store';

const SignOut = (): JSX.Element => {
  const [signOut] = useSignOutMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      signOut().unwrap();
      dispatch(setContents([]));
      navigate("/");

    } catch (error) {
      console.log(error);
    }

  }, [signOut, navigate]);

  return <div>Signing you out...</div>;
};

export default SignOut;