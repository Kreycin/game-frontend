// src/components/Navbar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

// รายการของลิงก์ทั้งหมด
const navLinks = [
  { to: "/", text: "New character leaks" },
  { to: "/zenith-duel", text: "Zenith duel (CN)" },
  { to: "/game-guide", text: "Game guide" },
  { to: "/community", text: "Community" },
  { to: "/download-game", text: "Download game" },
  { to: "/about-us", text: "About us" },
];

const Navbar = () => {
  return (
    <header className="navbar-container">
      <nav>
        {navLinks.map((link) => (
          <NavLink 
            key={link.to} 
            to={link.to}
            // ใช้ function เพื่อเช็คว่าลิงก์นี้ active อยู่หรือไม่
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            {link.text}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;