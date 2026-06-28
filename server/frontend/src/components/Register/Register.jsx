import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Login/Login.css';
import './Register.css';

export default function Register({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userName: '', password: '', confirmPassword: '',
    firstName: '', lastName: '', email: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/djangoapp/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.status === 'Authenticated') {
        onLogin(data.userName);
        navigate('/dealers');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-section">
      <div className="container">
        <div className="auth-card glass-panel">
          <div className="auth-glow" />

          <div className="auth-header">
            <span className="auth-icon">🚗</span>
            <h1 className="section-title" style={{ fontSize: '1.8rem' }}>Create Account</h1>
            <p className="text-muted">Join Best Cars and start reviewing dealerships</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="register-name-row">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-first">First Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input id="reg-first" name="firstName" type="text" className="form-control" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-last">Last Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input id="reg-last" name="lastName" type="text" className="form-control" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email Address <span style={{ color: '#ef4444' }}>*</span></label>
              <input id="reg-email" name="email" type="email" className="form-control" placeholder="Email" value={form.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-username">Username <span style={{ color: '#ef4444' }}>*</span></label>
              <input id="reg-username" name="userName" type="text" className="form-control" placeholder="Username" value={form.userName} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password <span style={{ color: '#ef4444' }}>*</span></label>
              <input id="reg-password" name="password" type="password" className="form-control" placeholder="Password" value={form.password} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm Password <span style={{ color: '#ef4444' }}>*</span></label>
              <input id="reg-confirm" name="confirmPassword" type="password" className="form-control" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
            </div>

            <button id="register-submit" type="submit" className="btn-primary auth-submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Register'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
