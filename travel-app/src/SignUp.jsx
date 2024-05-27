import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import './SignUp.css';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
    } catch (error) {
      console.error(error);
      alert('Error registering user');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-heading">Sign Up</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required className="signup-input" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="signup-input" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="signup-input" />
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
