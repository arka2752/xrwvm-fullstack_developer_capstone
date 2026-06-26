import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await onLogout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Logo */}
        <NavLink to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <span className="logo-icon">🚗</span>
          <span className="logo-text">Best<span className="logo-accent">Cars</span></span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
          <NavLink to="/dealers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Dealerships</NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>About</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Contact</NavLink>
        </nav>

        {/* Auth */}
        <div className="nav-auth">
          {user ? (
            <div className="user-menu">
              <span className="user-greeting">👋 {user}</span>
              <button className="btn-outline" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <NavLink to="/" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Home</NavLink>
        <NavLink to="/dealers" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Dealerships</NavLink>
        <NavLink to="/about" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>About</NavLink>
        <NavLink to="/contact" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Contact</NavLink>
        {user ? (
          <button className="mobile-link btn-outline" onClick={handleLogout}>Logout ({user})</button>
        ) : (
          <>
            <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" className="mobile-link" onClick={() => setMenuOpen(false)}>Register</Link>
          </>
        )}
      </div>
    </header>
  );
}
