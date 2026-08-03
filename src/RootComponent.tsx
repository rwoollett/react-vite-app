import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AppShell } from '@mantine/core';
import { ROUTES } from './resources/routes-constants'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import SignIn from './pages/SignIn'
import NotFoundPage from './pages/NotFoundPage'
import SignOut from './components/SignOut'
import useSignedInAuthorize from './hooks/use-signedin-authenticate'
import ProtectedRoute from './pages/ProtectedRoute'
import Skeleton from './components/Skeleton'
import UserPage from './pages/UserPage'
import TTTPage from './pages/TTTPage'
import CountdownPage from './pages/CountdownPage'
import CountdownList from './components/CountdownList'
import CountdownCreate from './components/CountdownCreate'
import FlipImagePage from './pages/FlipImagePage'
import LivePosts from './pages/LivePosts'
import AddPostForm from './components/AddPostForm'
import LivePostsPage from './pages/LivePostsPage'
import { useColorMap } from './theme/colorMap';


const RootComponent: React.FC = () => {
  const { isLoggedIn, email, isLoading } = useSignedInAuthorize();
  const { appShellBg, appShellText } = useColorMap();

  if (isLoading) {
    return (
      <div style={{ padding: 16 }}>
        <Skeleton times={4} size="large" radius="md" />
      </div>
    )
  }
  return (
    <Router>
      <AppShell padding="md"
        bg={appShellBg}
        c={appShellText}>
        <AppShell.Header
          bg={appShellBg}
          c={appShellText}>
          <NavBar isLoggedIn={isLoggedIn} />
        </AppShell.Header>

        <AppShell.Main pt={52}>
          <Routes>
            <Route path="/posts/*" element={null} />
            <Route path={ROUTES.HOMEPAGE_ROUTE} element={<HomePage />} />
            <Route path={ROUTES.TTTPAGE_ROUTE} element={<TTTPage />} />
            <Route path={ROUTES.FLIPIMAGEPAGE_ROUTE} element={<FlipImagePage />} />
            <Route path={ROUTES.SIGNIN_ROUTE} element={<SignIn />} />
            {/* <Route path={ROUTES.REGISTER_ROUTE} element={<SignUp />} /> */}
            <Route path={ROUTES.SIGNOUT_ROUTE} element={<SignOut />} />
            <Route path={ROUTES.COUNTDOWNPAGE_ROUTE} element={<CountdownPage />} >
              <Route index element={<CountdownList />} />
              <Route path="create" element={<CountdownCreate />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path={`${ROUTES.LIVEPOSTS_ROUTE}`} element={<LivePostsPage />}>
              <Route index element={<LivePosts />} />
              <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
                <Route path="create" element={<AddPostForm email={email} />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
              <Route path={`${ROUTES.USER_ROUTE}`} element={<UserPage />} />
            </Route>

            {/* <Route path={ROUTES.REGISTER_ROUTE} element={<SignUp />} /> */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

        </AppShell.Main>
      </AppShell>
    </Router>
  );

}

export default RootComponent
