// src/components/Navbar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

// --- เราจะแก้ไขรายการลิงก์ทั้งหมดที่นี่ ---
const navLinks = [
  // ลำดับที่ 1: หน้าหลัก (เหมือนเดิม)
  { to: "/", text: "New character leaks" },

  // ลำดับที่ 2: Tier List (ย้ายขึ้นมา)
  { to: "/tier-list", text: "Tier List" },

  // ลำดับที่ 3: Game Guide (เหมือนเดิม)
  { to: "/game-guide", text: "Game guide" },

  // --- ลิงก์ที่เหลือเราจะลบออกไปก่อน ---
  // { to: "/zenith-duel", text: "Zenith duel (CN)" },
  // { to: "/community", text: "Community" },
  // { to: "/download-game", text: "Download game" },
  // { to: "/about-us", text: "About us" },
];

const Navbar = () => {
  return (
    <header className="navbar-container">
      <nav>
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
    </header>
  );
};

export default Navbar;