import { useEffect, useState, type ChangeEvent, type FormEvent, type JSX } from 'react';
import { useSignUpMutation } from '../store/api/authenticatedUsersApi';
import { type StatusErrors } from '../types/statusErrors';
import { useNavigate } from 'react-router-dom';
import StatusAlert from '../components/StatusAlert';
import Button from '../components/Button';
import { useAppDispatch } from '../store/reducers/store';
import { ipApi } from '../store/api/ipApi';
import useSignedInAuthorize from '../hooks/use-signedin-authenticate';
import Skeleton from '../components/Skeleton';
import Banner from '../components/Banner';
import { ROUTES } from '../resources/routes-constants';

import { Box, Paper, Stack, Text, TextInput, PasswordInput } from '@mantine/core';
import { useColorMap } from '../theme/colorMap';

const SignUp = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [errors, setErrors] = useState<JSX.Element | null>(null);

  const [signUp, results] = useSignUpMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = useSignedInAuthorize();

  const { surfaceBg, surfaceText } = useColorMap();

  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      navigate(ROUTES.USER_ROUTE);
    }
  }, [isLoggedIn, isLoading, navigate]);

  if (isLoading) {
    return <Skeleton times={1} />;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errs: string[] = [];
    if (!email) errs.push('Please enter email!');
    if (!password) errs.push('Please enter a password!');

    setErrors(null);
    setErrorMessage(errs);
    if (errs.length > 0) return;

    try {
      await signUp({ email, password }).unwrap();
      setEmail('');
      setPassword('');
      dispatch(ipApi.util.invalidateTags(['CurrentUser']));
    } catch (error) {
      const statusErrors = error as Partial<StatusErrors>;
      setErrors(<StatusAlert statusErrors={statusErrors} />);
    }
  };

  return (
    <>
      <Banner
        title="Create Your Account"
        desc="Sign up to access your dashboard and manage your network activity"
      />

      <Box bg={surfaceBg} c={surfaceText} p="lg">
        <Paper
          shadow="sm"
          radius="md"
          p="lg"
          bg={surfaceBg}
          c={surfaceText}
          mx="auto"
          style={{ maxWidth: 480 }}
        >
          <form onSubmit={onSubmit}>
            <Stack gap="sm">

              {errorMessage.length > 0 && (
                <Stack gap={4}>
                  {errorMessage.map((err, i) => (
                    <Text key={i} c="red">{err}</Text>
                  ))}
                </Stack>
              )}

              {results.isError && errors}

              <TextInput
                id="emailInput"
                label="Email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="temp@hello.co.nz"
                autoComplete="email"
                error={email === '' && errorMessage.length > 0 ? 'Required' : undefined}
              />

              <PasswordInput
                id="passwordInput"
                label="Password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="password"
                autoComplete="current-password"
                error={password === '' && errorMessage.length > 0 ? 'Required' : undefined}
              />

              <Button primary type="submit">Sign Up</Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default SignUp;
