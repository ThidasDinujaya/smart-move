import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import '../../styles/Login.css';
import loginBg from '../../assets/login-bg.png';
import { registerCustomer } from '../../utils/customerAuth.js';
import { getCustomerReturnLocation } from '../../utils/roleAccess.js';

export default function CustomerRegister() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', nic: '', gender: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('Your password must be at least 8 characters long.');
      return;
    }
    setIsSubmitting(true);
    try {
      await registerCustomer(form);
      const destination = getCustomerReturnLocation(location.state?.from);
      navigate(destination.to, { replace: true, state: destination.state });
    } catch (registrationError) {
      setError(registrationError.message || 'Unable to create your account. Please try again.');
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
            <h2>Create an account</h2>
            <p>Register with SmartMove to book your trips</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="customer-register-name">Full name</label>
              <input
                id="customer-register-name"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={(event) => update('fullName', event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="customer-register-email">Email</label>
              <input
                id="customer-register-email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(event) => update('email', event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="customer-register-phone">Phone</label>
              <input
                id="customer-register-phone"
                type="tel"
                autoComplete="tel"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={(event) => update('phone', event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="customer-register-nic">NIC</label>
              <input
                id="customer-register-nic"
                type="text"
                autoComplete="off"
                placeholder="Enter your NIC number (optional)"
                maxLength={20}
                value={form.nic}
                onChange={(event) => update('nic', event.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="customer-register-gender">Gender</label>
              <select
                id="customer-register-gender"
                value={form.gender}
                onChange={(event) => update('gender', event.target.value)}
              >
                <option value="">Prefer not to say</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="customer-register-password">Password</label>
              <div className="password-field">
                <input
                  id="customer-register-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  minLength={8}
                  value={form.password}
                  onChange={(event) => update('password', event.target.value)}
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
              {isSubmitting ? 'Creating account…' : 'Register'}
            </button>
            <p className="account-switch">
              Already have an account? <Link to="/login" state={location.state}>Login</Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
