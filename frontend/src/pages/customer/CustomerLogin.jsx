import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import '../../styles/Login.css';
import loginBg from '../../assets/login-bg.png';
import { loginCustomer } from '../../utils/customerAuth.js';
import { getCustomerReturnLocation } from '../../utils/roleAccess.js';

export default function CustomerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await loginCustomer({ email, password });
      const destination = getCustomerReturnLocation(location.state?.from);
      navigate(destination.to, { replace: true, state: destination.state });
    } catch (loginError) {
      setError(loginError.message || 'Unable to log in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-brand" style={{ backgroundImage: `url(${loginBg})` }}>
        <div className="brand-overlay">
          <div className="brand-top">
            <h1>SmartMove</h1>
            <p>Transport Solutions</p>
          </div>
          <div className="brand-bottom">
            <h2>Safe Journey<br />Better Tomorrow</h2>
            <p>Your trusted transportation partner<br />for a smarter and connected community.</p>
          </div>
        </div>
      </section>

      <section className="login-section">
        <div className="login-card">
          <div className="login-heading">
            <h2>Welcome Back!</h2>
            <p>Login to your SmartMove account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="customer-login-email">Email</label>
              <input
                id="customer-login-email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="customer-login-password">Password</label>
              <div className="password-field">
                <input
                  id="customer-login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {error && <p className="login-error" role="alert">{error}</p>}
            <button type="submit" className="login-button" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in…' : 'Login'}
            </button>
            <p className="account-switch">
              Don’t have an account? <Link to="/register" state={location.state}>Register</Link>
            </p>
            <p className="account-switch">
              Staff member? <Link to="/admin/login">Sign in to the admin portal</Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
