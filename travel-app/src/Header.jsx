import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './Header.css';

export default function Header() {
    const { user, logout } = useContext(AuthContext);

    useEffect(() => {
        console.log('NavBar user:', user);
      }, [user]);
    
    return (
        <header className="header">
            <div className='logo-container'>
                <Link to='/'><h3>Travel Planner</h3></Link>
            </div>
            <nav>
                <ul className="main-nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/trips">Trips</Link></li>
                    <li><Link to="/travel-hacks">Travel Hacks</Link></li>
                </ul>
                <ul className="auth-nav-links">
                {user ? (
                    <div className='logout-links'>
                        <li>Welcome, {user.username}</li>
                        <li><button className='logout-button' onClick={logout}>Log Out</button></li>
                    </div>
                    ) : (
                    <>
                        <li><Link to="/login">Log In</Link></li>
                        <li><Link to="/sign-up">Sign Up</Link></li>
                    </>
                    )}
                </ul>
            </nav>
        </header>
    );
}