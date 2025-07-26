import { useState, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../resources/routes-constants'
import logo from '../styles/favicon-32x32.png'
import './NavBar.module.scss';
import { TABLE_VIEW } from './Table';
import useSignedInAuthorize from '../hooks/use-signedin-authenticate';


interface NavBarProps {
  isLoggedIn: boolean;
}

function NavBar({ isLoggedIn } : NavBarProps): JSX.Element {
  const [burgerActive, setBurgerActive] = useState(false);
  const { email } = useSignedInAuthorize();

  const handleClickBurger = () => {
    setBurgerActive((prev) => !prev);
  };

  const handleMouseLeave = () => {
    setBurgerActive(false);
  };

  const userBar = [
    { show: !isLoggedIn, to: "/signin", label: "Sign In" },
    { show: !isLoggedIn, to: "/signup", label: "Sign Up" },
    { show: isLoggedIn, to: "/signout", label: "Sign Out" }
  ]
    .filter(linkConfig => linkConfig.show)
    .map(({ label, to }: { label: string; to: string }) => {
      return (
        <Link className="navbar-item" key={to} to={to}>{label}</Link>
      );
    });

  return (
    // 
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a title="link to home page" className="navbar-item" href={ROUTES.HOMEPAGE_ROUTE}>
          <img alt='RW' title="RWIcon" src={logo} width="32" height="32" />
        </a>
        <div className='navbar-item'>{email}</div>
        <button title="menu icon" role="button" onClick={handleClickBurger}
          className={`navbar-burger ${burgerActive && 'is-active'}`} aria-label="menu" >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>
      <div onMouseLeave={handleMouseLeave} className={`navbar-menu ${burgerActive && 'is-active'}`}>
        <div className="navbar-start">
          <Link onClick={() => setBurgerActive(false)} className="navbar-item" to={ROUTES.HOMEPAGE_ROUTE}>Home</Link>
          <Link onClick={() => setBurgerActive(false)} className="navbar-item" to={ROUTES.FLIPIMAGEPAGE_ROUTE}>Flip Image</Link>
          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link">Utility</a>
            <div className="navbar-dropdown">
              <a className="navbar-item">About</a>
              <Link onClick={() => setBurgerActive(false)} className="navbar-item" to={ROUTES.COUNTDOWNPAGE_ROUTE} state={{ tableMode: TABLE_VIEW }}>Countdown Timer</Link>
            </div>
          </div>
        </div>
        <div className="navbar-end">
          {userBar}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;