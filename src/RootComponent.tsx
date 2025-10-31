import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './styles/main.scss'
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

const RootComponent: React.FC = () => {
  const { isLoggedIn, email, isLoading } = useSignedInAuthorize();
  if (isLoading) {
    return (
      <div className='main-content'>
        <Skeleton times={1} className={'sign-in-skeleton'} />
      </div>
    )
  }
  return (
    <Router future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <NavBar isLoggedIn={isLoggedIn} />
      <section className='main-content'>
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
          <Route path={ROUTES.HOMEPAGE_ROUTE} element={<HomePage />} />
          <Route path={ROUTES.TTTPAGE_ROUTE} element={<TTTPage />} />
          <Route path={ROUTES.FLIPIMAGEPAGE_ROUTE} element={<FlipImagePage />} />
          <Route path={ROUTES.SIGNIN_ROUTE} element={<SignIn />} />
          <Route path={ROUTES.SIGNOUT_ROUTE} element={<SignOut />} />
          <Route path={ROUTES.COUNTDOWNPAGE_ROUTE} element={<CountdownPage />} >
            <Route index element={<CountdownList />} />
            <Route path="create" element={<CountdownCreate />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
            <Route path={`${ROUTES.USER_ROUTE}`} element={<UserPage />} />
            <Route path={`${ROUTES.LIVEPOSTS_ROUTE}`} element={<LivePostsPage />}>
              <Route index element={<LivePosts />} />
              <Route path="create" element={<AddPostForm email={email} />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>

          {/* <Route path={ROUTES.REGISTER_ROUTE} element={<SignUp />} /> */}
        </Routes>
      </section>
    </Router>
  );

}

export default RootComponent
