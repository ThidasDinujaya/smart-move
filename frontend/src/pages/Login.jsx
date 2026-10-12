import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "../styles/Login.css";
import loginBg from "../assets/login-bg.png";
import { loginStaff } from "../utils/customerAuth.js";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    if (typeof onLogin !== "function") return;
    setIsSubmitting(true);
    try {
      await onLogin({ email, password, rememberMe });
    } catch (loginError) {
      setError(loginError.message || "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
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
              <label htmlFor="username">Email</label>

              <input
                id="username"
                type="email"
                placeholder="Enter your work email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <button type="submit" className="login-button" disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : "Login"}
            </button>

          </form>

          <p className="account-switch">
            Customer account? <Link to="/login">Go to customer login</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;
