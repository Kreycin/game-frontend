// src/components/Navbar.jsx

import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const navLinks = [
  { to: "/", text: "New character leaks" },
  { to: "/tier-list", text: "Tier List" },
  //{ to: "/game-guide", text: "Game guide" },
];

const Navbar = () => {
  const { isLoggedIn, profile, logout } = useAuth();

  return (
    <header className="navbar-container">
      <nav className="navbar-main-links">
        {navLinks.map((link) => (
          <NavLink 
            key={link.to} 
            to={link.to}
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            {link.text}
          </NavLink>
        ))}
      </nav>

      <div className="navbar-right-section">
        {isLoggedIn ? (
          <div className="user-actions">
            <Link to="/profile" className="profile-link">
              {profile?.displayName || 'Profile'}
            </Link>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        ) : (
          <div className="guest-actions">
            <Link to="/login" className="login-link">Login</Link>
            <Link to="/register" className="register-button">
              Register
            </Link>
          </div>
        )}

        {/* ตำแหน่งของปุ่มแปลภาษาที่ถูกต้อง */}
        <div id="google_translate_element"></div>
      </div>
    </header>
  );
};

export default Navbar;