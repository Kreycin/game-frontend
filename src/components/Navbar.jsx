import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const navLinks = [
  { to: "/", text: "New character leaks" },
  { to: "/tier-list", text: "Tier List" },
  { to: "/game-guide", text: "Game guide" },
];

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="navbar-container flex justify-between items-center">
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

      <div>
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="hover:text-blue-400 transition font-semibold">
              Profile
            </Link>
            <button 
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link to="/login" className="hover:text-gray-300 py-2 px-4">Login</Link>
            <Link 
              to="/register" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;