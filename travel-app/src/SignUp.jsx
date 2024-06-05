import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";
import "./SignUp.css";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const { register } = useContext(AuthContext);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!emailValid) {
      toast.error("Invalid email address", {
        theme: "colored",
      });
      return;
    }
    try {
      await register(username, email, password);
    } catch (error) {
      toast.error(error, {
        theme: "colored",
      });
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = "";
    if (password.length >= 8) {
      strength = "Weak";
      if (/[A-Z]/.test(password)) strength = "Medium";
      if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength = "Strong";
    } else {
      strength = "Too short";
    }
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailValid(validateEmail(newEmail));
  };

  return (
    <div className="page-content">
      <div className="signup-container">
        <h2 className="signup-header">Create New Account</h2>

        <section className="signup-section">
          <form onSubmit={handleSubmitForm}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username-"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="username@example.com"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="********"
                value={password}
                onChange={handlePasswordChange}
                required
              />
               <div className={`password-strength ${passwordStrength.toLowerCase().replace(' ', '-')}`}>
                {passwordStrength}
              </div>
            </div>
            <div className="buttons">
              <button type="submit" className="create-account-button">
                Create account
              </button>
            </div>
          </form>
          <p>
            Have an account? <Link to="/login">Log In</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
