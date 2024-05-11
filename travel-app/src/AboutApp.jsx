import './AboutApp.css';
import {Link} from 'react-router-dom';

export default function AboutApp() {
    return (
        <section className="about-app">
            <div className="about-header">
                <h2>Discover Your Next Adventure</h2>
                <p>Explore the world with Travel App! Our app simplifies your travel planning with interactive maps, detailed guides, and user-friendly tools. From bustling cities to serene landscapes, discover and book your perfect trip easily.</p>
            </div>
            <div className="features">
                <div className="feature-card">
                    <i className="fas fa-map-marked-alt feature-icon"></i>
                    <h3>Interactive Maps</h3>
                    <p>Navigate the world like never before with our detailed maps.</p>
                </div>
                <div className="feature-card">
                    <i className="fas fa-calendar-alt feature-icon"></i>
                    <h3>Customizable Itineraries</h3>
                    <p>Create trip plans that cater to your personal preferences and schedule.</p>
                </div>
                <div className="feature-card">
                    <i className="fas fa-cloud-sun-rain feature-icon"></i>
                    <h3>Real-time Weather Updates</h3>
                    <p>Stay prepared with up-to-date weather information at your fingertips.</p>
                </div>
            </div>
            <Link to='/trips'><button className="start-planning-btn">Start Planning</button></Link>
        </section>
    );
}