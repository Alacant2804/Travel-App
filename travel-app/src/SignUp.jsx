import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";
import "./SignUp.css";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useContext(AuthContext);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
    } catch (error) {
      toast.error(error, {
        theme: "colored",
      });
    }
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
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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
