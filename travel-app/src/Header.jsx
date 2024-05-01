import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
    return (
        <header className="header">
            <img src="/path-to-your-logo.svg" alt="Logo" className="logo" />
            <nav>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/trips">Trips</Link></li>
                    <li><Link to="/travel-hacks">Travel Hacks</Link></li>
                    <li><Link to="/login">Login</Link></li>
                </ul>
            </nav>
        </header>
    );
}; 