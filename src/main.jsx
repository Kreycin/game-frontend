

// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Layout from './components/Layout.jsx';
//import App from './App.jsx';
import CharacterSheetPage from './pages/CharacterSheetPage';
import ComingSoonPage from './pages/ComingSoonPage.jsx';
import GameGuide from './pages/GameGuide';
import TierListPage from './pages/TierListPage.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import ProfilePage from './pages/ProfilePage.tsx';

// --- 1. Import หน้าใหม่เข้ามา ---
import NotificationSettings from './pages/NotificationSettings.tsx';

import './App.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <CharacterSheetPage /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "tier-list", element: <TierListPage /> },
      { path: "zenith-duel", element: <ComingSoonPage /> },
      { path: "game-guide", element: <GameGuide /> },
      { path: "community", element: <ComingSoonPage /> },
      { path: "download-game", element: <ComingSoonPage /> },
      { path: "about-us", element: <ComingSoonPage /> },
      { path: "notifications", element: <NotificationSettings /> },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);