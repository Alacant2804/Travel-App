import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
    return (
        <div className='not-found-page'>
            <div className="not-found-container">
                <h1>404 - Page Not Found</h1>
                <p>Oops! The page you're looking for doesn't exist.</p>
                <Link to="/" className="go-home-link">Go Back to Home</Link>
            </div>
        </div>
    );
}
