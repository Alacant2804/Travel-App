import facebookLogo from './assets/facebook-logo.png';
import twitterLogo from './assets/x-logo.png';
import instagramLogo from './assets/instagram-logo.png';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="social-media">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <img src={facebookLogo} alt='Facebook Logo' />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <img src={twitterLogo} alt='Twitter Logo' />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <img src={instagramLogo} alt='Instagram Logo' />
                </a>
            </div>
            <p>© 2024 <a href='https://github.com/Alacant2804/Travel-App'>Alacant2804</a>. All rights reserved.</p>
            <ul className="footer-links">
                    <li><a href="/privacy-policy">Privacy Policy</a></li>
                    <li><a href="/terms-of-service">Terms of Service</a></li>
            </ul>
        </footer>
    );
}
