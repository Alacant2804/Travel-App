import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./Header.css";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/" onClick={closeMenu}>
          <h3>Travel Planner</h3>
        </Link>
      </div>
      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>
      <nav className={isOpen ? "nav-open" : ""}>
        <ul className="main-nav-links">
          <li>
            <Link to="/" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/trips" onClick={closeMenu}>
              Trips
            </Link>
          </li>
          <li>
            <Link to="/travel-hacks" onClick={closeMenu}>
              Travel Hacks
            </Link>
          </li>
        </ul>
        <ul className="auth-nav-links">
          {user ? (
            <div className="logout-links">
              <li>Welcome, {user.username}</li>
              <li>
                <button
                  className="logout-button"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                >
                  Log Out
                </button>
              </li>
            </div>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={closeMenu}>
                  Log In
                </Link>
              </li>
              <li>
                <Link to="/sign-up" onClick={closeMenu}>
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
