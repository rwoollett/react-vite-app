import React, { useEffect, useState, type ChangeEvent, type FormEvent, type JSX } from 'react';
import { setContents } from '../store/actions/data';
import { ipApi } from '../store/api/ipApi';
import { useAppDispatch } from '../store/reducers/store';
import { useSignInMutation } from '../store/api/authenticatedUsersApi';
import { type StatusErrors } from '../types/statusErrors';
import StatusAlert from '../components/StatusAlert';
import { Button } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../resources/routes-constants';
import useSignedInAuthorize from '../hooks/use-signedin-authenticate';
import Skeleton from '../components/Skeleton';
import Banner from '../components/Banner';

import { Box, Paper, Stack, Text, TextInput, PasswordInput, Group } from '@mantine/core';
import { useColorMap } from '../theme/colorMap';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [errors, setErrors] = useState<JSX.Element | null>(null);

  const [signIn, results] = useSignInMutation();
  const { isLoggedIn, isLoading } = useSignedInAuthorize();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { surfaceBg, surfaceText } = useColorMap();

  const from = location.state?.from || "/";

  useEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, from]);

  const redirectToHomePage = () => {
    navigate(ROUTES.LIVEPOSTS_ROUTE);
  };

  const onHandleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errs: string[] = [];
    if (!email) errs.push("Please enter email!");
    if (!password) errs.push("Please enter a password!");

    setErrors(null);
    setErrorMessage(errs);
    if (errs.length > 0) return;

    try {
      await signIn({ email, password }).unwrap();
      setEmail("");
      setPassword("");
      dispatch(ipApi.util.invalidateTags(['CurrentUser']));
      dispatch(setContents([email]));
    } catch (error) {
      const statusErrors = error as Partial<StatusErrors>;
      console.error("Sign-in failed:", error);
      setErrors(<StatusAlert statusErrors={statusErrors} />);
    }
  };

  if (isLoading) {
    return <Skeleton times={1} />;
  }

  return (
    <>
      <Banner
        title="Net Processor Dashboard"
        desc="Show the activity of net processor clients by the IP identifier"
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
          <form onSubmit={onHandleLogin}>
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
                error={email === '' && errorMessage.length > 0 ? "Required" : undefined}
              />

              <PasswordInput
                id="passwordInput"
                label="Password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="password"
                autoComplete="current-password"
                error={password === '' && errorMessage.length > 0 ? "Required" : undefined}
              />

              <Group justify="flex-start" mt="md">
                <Button color="blue" type="submit">Login</Button>
                <Button color="gray" type="button" onClick={redirectToHomePage}>Home</Button>
              </Group>

            </Stack>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default SignIn;
