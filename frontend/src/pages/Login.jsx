import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "../styles/Login.css";
import loginBg from "../assets/login-bg.png";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please enter username and password.");
      return;
    }

    // DEMO ONLY: Replace with backend authentication later.
    if (username.trim() === "admin" && password === "admin123") {
      if (typeof onLogin === "function") {
        onLogin({ rememberMe });
      }
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <section
        className="login-brand"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        <div className="brand-overlay">

          <div className="brand-top">
            <h1>SmartMove</h1>
            <p>Transport Solutions</p>
          </div>

          <div className="brand-bottom">
            <h2>
              Safe Journey
              <br />
              Better Tomorrow
            </h2>

            <p>
              Your trusted transportation partner
              <br />
              for a smarter and connected community.
            </p>
          </div>

        </div>
      </section>

      {/* RIGHT SIDE */}
      <section className="login-section">
        <div className="login-card">

          <div className="login-heading">
            <h2>Welcome Back!</h2>
            <p>Login to your admin account</p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="username">Username</label>

              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="password-field">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="login-button">
              Login
            </button>

          </form>
        </div>
      </section>
    </div>
  );
}

export default Login;
