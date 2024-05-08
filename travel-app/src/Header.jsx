import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
    return (
        <header className="header">
            <div className='logo-container'>
                <h3>Travel Planner</h3>
            </div>
            <nav>
                <ul className="main-nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/trips">Trips</Link></li>
                    <li><Link to="/travel-hacks">Travel Hacks</Link></li>
                </ul>
                <ul className="auth-nav-links">
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/sign-up">Sign Up</Link></li>
                </ul>
            </nav>
        </header>
    );
}