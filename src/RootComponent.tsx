import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
// import CountdownPage from './pages/CountdownPage'
// import FlipImagePage from './pages/FlipImagePage'
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
import FlipImagePage from './pages/FlipImagePage'

// import CountdownCreate from './components/CountdownCreate'
// import CountdownList from './components/CountdownList'
// import SignOut from './components/SignOut'
// import SignUp from './components/SignUp'

const RootComponent: React.FC = () => {
  const { isLoggedIn, isLoading } = useSignedInAuthorize();

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
          <Route path={ROUTES.USER_ROUTE}
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <UserPage />
              </ProtectedRoute>} />
          <Route path={ROUTES.HOMEPAGE_ROUTE} element={<HomePage />} />
          <Route path={ROUTES.TTTPAGE_ROUTE} element={<TTTPage />} />
          <Route path={ROUTES.FLIPIMAGEPAGE_ROUTE} element={<FlipImagePage />} />
          <Route path={ROUTES.SIGNIN_ROUTE} element={<SignIn />} />
          <Route path={ROUTES.SIGNOUT_ROUTE} element={<SignOut />} />

          {/*
        
        <Route path={ROUTES.COUNTDOWNPAGE_ROUTE} element={<CountdownPage />} >
          <Route index element={<CountdownList />} />
          <Route path="create" element={<CountdownCreate />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route> */}

          {/* <Route path={ROUTES.REGISTER_ROUTE} element={<SignUp />} /> */}
        </Routes>
      </section>
    </Router>
  )
}

export default RootComponent
