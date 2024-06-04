import "./SignUp.css";

export default function SignUp() {
  return (
    <div className="page-content">
      <div className="signup-container">
        <h2 className="signup-header">Create new account</h2>

        <section className="signup-section">
          <form>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input type="text" id="username-" placeholder="Username" />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="username@example.com"
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="********" />
            </div>
            <div className="buttons">
              <button type="submit" className="create-account">
                Create account
              </button>
            </div>
          </form>
          <p>
            Have an account? <a href="#">Log In</a>
          </p>
        </section>
      </div>
    </div>
  );
}
