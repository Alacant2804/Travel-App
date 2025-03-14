import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      toast.error(error, {
        theme: "colored",
      });
    }
  };

  return (
    <div className="page-content">
      <div className="login-container">
        <h2 className="login-header">Log In</h2>

        <section className="login-section">
          <form onSubmit={handleSubmitForm}>
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
              <button type="submit" className="login-button">
                Log In
              </button>
            </div>
          </form>
          <p>
            Don't have an account? <Link to="/sign-up">Sign Up</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
