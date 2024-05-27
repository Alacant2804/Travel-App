import { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import './Login.css'; // Import your custom CSS file for styling

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error(error);
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-heading">Log In</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="login-input" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="login-input" />
          <button type="submit" className="login-button">Log In</button>
        </form>
        <p className="signup-link">Don't have an account? <a href="/signup">Sign up</a></p>
      </div>
    </div>
  );
}