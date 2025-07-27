import { useEffect, type ChangeEvent, type FormEvent, type JSX } from 'react';
import { useState } from 'react';
import { useSignUpMutation } from '../store/api/usersApi';
import { type StatusErrors } from '../types/statusErrors';
import { useNavigate } from 'react-router-dom';
import StatusAlert from '../components/StatusAlert';
import Button from '../components/Button';
import { useAppDispatch } from '../store/reducers/store';
import { ipApi } from '../store/api/ipApi';
import useSignedInAuthorize from '../hooks/use-signedin-authenticate';
import Skeleton from '../components/Skeleton';
import { ROUTES } from '../resources/routes-constants';

const SignUp = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [errors, setErrors] = useState<JSX.Element | null>(null);
  const [signUp, results] = useSignUpMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = useSignedInAuthorize();

  if (isLoading) {
    return <Skeleton times={1} className="sign-in-skeleton" />
  }

  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      navigate(ROUTES.USER_ROUTE);
    }
  }, [isLoggedIn, isLoading, navigate]);
  
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errorMessage: string[] = [];
    if (email === '') {
      errorMessage.push('Please enter email!');
    }
    if (password === '') {
      errorMessage.push('Please enter a password!');
    }
    setErrors(null);
    if (errorMessage.length > 0) {
      setErrorMessage(errorMessage);
      return;
    }
    // Now use the url to login with auth backend service
    try {
      await signUp({ email, password }).unwrap();
      setEmail("");
      setPassword("");
      dispatch(ipApi.util.invalidateTags(['CurrentUser']));

    } catch (error) {
      const statusErrors = error as Partial<StatusErrors>;
      setErrors(<StatusAlert statusErrors={statusErrors} />);
    }
  };

  return (
    <div>
      <section className='section'>
        <div className="container is-fluid">
          <form onSubmit={onSubmit}>
            <ul>
              {errorMessage.length > 0 && errorMessage.map((err, i) => {
                return (<li key={i}>{err}</li>);
              })}
            </ul>
            {(results.isError) && errors}

            <div className="field">
              <div className="control">
                <label htmlFor="emailInput" className="label">Email</label>
                <input id="emailInput" name="emailInput" value={email}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                  className={`input ${email === '' && errorMessage.length && 'is-danger'}`}
                  autoComplete="email" type="text" placeholder="temp@hello.co.nz" />
              </div>
            </div>

            <div className="field">
              <div className="control">
                <label htmlFor='passwordInput' className="label">Password</label>
                <input id='passwordInput' name='passwordInput' value={password}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                  className={`input ${password === '' && errorMessage.length && 'is-danger'}`}
                  autoComplete="current-password" type="password" placeholder="password" />
              </div>
            </div>

            <div className="field is-grouped">
              <div className="control">
                <Button primary type="submit">Sign Up</Button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default SignUp;