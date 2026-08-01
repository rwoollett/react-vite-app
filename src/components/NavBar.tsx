import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../resources/routes-constants';
import logo from '../styles/favicon-32x32.png';
import { TABLE_VIEW } from './TableModes';
import useSignedInAuthorize from '../hooks/use-signedin-authenticate';
import { useAppDispatch } from '../store/reducers/store';
import { refetchUserByID } from '../store/api/authorUsersSlice';

import {
  Group,
  Flex,
  Burger,
  Drawer,
  Image,
  Button,
} from '@mantine/core';

interface NavBarProps {
  isLoggedIn: boolean;
  toggleColorScheme: () => void;
}

export function NavBar({ isLoggedIn }: NavBarProps) {
  const [opened, setOpened] = useState(false);
  const { email } = useSignedInAuthorize();
  const dispatch = useAppDispatch();

  const userBar = [
    { show: !isLoggedIn, to: '/signin', label: 'Sign In' },
    { show: !isLoggedIn, to: '/signup', label: 'Sign Up' },
    { show: isLoggedIn, to: '/signout', label: 'Sign Out' },
  ]
    .filter((x) => x.show)
    .map(({ label, to }) => (
      <Button
        key={to}
        variant="subtle"
        component={Link}
        to={to}
        onClick={() => setOpened(false)}
      >
        {label}
      </Button>
    ));

  return (
    <>
      {/* Header content */}
      <Flex
        align="center"
        justify="space-between"
        px="md"
        py="xs"
        style={{ height: 52 }}
      >
        <Group>
          <Link to={ROUTES.HOMEPAGE_ROUTE}>
            <Image src={logo} alt="RW" width={32} height={32} />
          </Link>

          {email && (
            <Button
              variant="subtle"
              component={Link}
              to={ROUTES.USER_ROUTE}
              onClick={() => setOpened(false)}
            >
              {email}
            </Button>
          )}
        </Group>

        <Burger opened={opened} onClick={() => setOpened((o) => !o)} />
      </Flex>

      {/* Drawer for mobile menu */}
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        padding="md"
        title="Menu"
      >
        <Flex direction="column" gap="sm">
          <Button
            variant="subtle"
            component={Link}
            to={ROUTES.TTTPAGE_ROUTE}
            onClick={() => setOpened(false)}
          >
            Tic Tac Toe
          </Button>

          <Button
            variant="subtle"
            component={Link}
            to={ROUTES.LIVEPOSTS_ROUTE}
            onClick={() => setOpened(false)}
          >
            Live Posts
          </Button>

          <Button
            variant="subtle"
            component={Link}
            to={ROUTES.COUNTDOWNPAGE_ROUTE}
            state={{ tableMode: TABLE_VIEW }}
            onClick={() => setOpened(false)}
          >
            Countdown Timer
          </Button>

          {isLoggedIn && (
            <Button
              variant="subtle"
              component={Link}
              to={`${ROUTES.LIVEPOSTS_ROUTE}/create`}
              onClick={() => {
                setOpened(false);
                dispatch(refetchUserByID());
              }}
            >
              Create Post
            </Button>
          )}

          {userBar}

          {/* <Button
            variant="subtle"
            onClick={toggleColorScheme}>
            Toggle Theme
          </Button> */}
        </Flex>
      </Drawer>
    </>
  );
}

export default NavBar;
