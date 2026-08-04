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
import { useColorMap } from '../theme/colorMap';

interface NavBarProps {
  isLoggedIn: boolean;
}

export function NavBar({ isLoggedIn }: NavBarProps) {
  const [opened, setOpened] = useState(false);
  const { email } = useSignedInAuthorize();
  const dispatch = useAppDispatch();

  const {
    headerBg,
    headerText,
    drawerBg,
    drawerHeaderBg,
    drawerHeaderText,
    drawerCloseColor,
    drawerHoverBg,
    buttonText,
  } = useColorMap();

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
        c={buttonText}
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
        bg={headerBg}
        c={headerText}
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
              c={buttonText}
            >
              {email}
            </Button>
          )}
        </Group>

        <Burger
          color={headerText}
          opened={opened}
          onClick={() => setOpened((o) => !o)} />
      </Flex>

      {/* Drawer for mobile menu */}
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        padding="md"
        title="Menu"
        bg={drawerBg}
        c={drawerHeaderText}
        styles={{
          header: {
            backgroundColor:drawerHeaderBg,
            color: drawerHeaderText,
          },
          title: {
            color: drawerHeaderText,
          },
          body: {
            backgroundColor: drawerBg,
          },
          content: {
            backgroundColor: drawerBg,
          },
          close: {
            color: drawerCloseColor,
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: drawerHoverBg,
            },
          },
        }}
      >
        <Flex
          direction="column"
          gap="sm"
          bg={drawerBg}
          c={drawerHeaderText}
          p="sm"
        >
          <Button
            variant="subtle"
            component={Link}
            to={ROUTES.TTTPAGE_ROUTE}
            onClick={() => setOpened(false)}
            c={buttonText}
          >
            Tic Tac Toe
          </Button>

          <Button
            variant="subtle"
            component={Link}
            to={ROUTES.COUNTDOWNPAGE_ROUTE}
            state={{ tableMode: TABLE_VIEW }}
            onClick={() => setOpened(false)}
            c={buttonText}
          >
            Countdown Timer
          </Button>

          <Button
            variant="subtle"
            component={Link}
            to={ROUTES.FLIPIMAGEPAGE_ROUTE}
            onClick={() => setOpened(false)}
            c={buttonText}
          >
            Flip Image
          </Button>

          <Button
            variant="subtle"
            component={Link}
            to={ROUTES.LIVEPOSTS_ROUTE}
            onClick={() => setOpened(false)}
            c={buttonText}
          >
            Live Posts
          </Button>

          {isLoggedIn && (
            <Button
              variant="subtle"
              component={Link}
              to={`${ROUTES.LIVEPOSTS_ROUTE}/create`}
              c={buttonText}
              onClick={() => {
                setOpened(false);
                dispatch(refetchUserByID());
              }}
            >
              Create Post
            </Button>
          )}

          {userBar}

        </Flex>
      </Drawer>
    </>
  );
}

export default NavBar;
