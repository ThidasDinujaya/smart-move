import { useState } from "react";
import "../styles/Login.css";
import loginBg from "../assets/login-bg.png";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <section
        className="login-brand"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        <div className="brand-overlay">

          {/* BRAND */}
          <div className="brand-top">
            <h1>SmartMove</h1>
            <p>Transport Solutions</p>
          </div>

          {/* BOTTOM TEXT */}
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
            <p>Login to your account</p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* USERNAME */}
            <div className="form-group">
              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>


            {/* PASSWORD */}
            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <div className="password-field">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Show or hide password"
                >
                  {showPassword ? "●" : "◉"}
                </button>

              </div>
            </div>


            {/* LOGIN OPTIONS */}
            <div className="login-options">

              <label className="remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <a href="#">
                Forgot password?
              </a>

            </div>


            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-button"
            >
              Login
            </button>

          </form>

        </div>

      </section>

    </div>
  );
}

export default Login;