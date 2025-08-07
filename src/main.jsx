// src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Layout from './components/Layout.jsx';
import App from './App.jsx';
import ComingSoonPage from './pages/ComingSoonPage.jsx';
import GameGuide from './pages/GameGuide';

// --- 1. Import หน้า TierListPage ที่เราเพิ่งสร้างเข้ามา ---
import TierListPage from './pages/TierListPage.jsx';

import './App.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      // --- 2. เพิ่ม Object ใหม่สำหรับ Route ของ Tier List ---
      {
        path: "tier-list", // นี่คือ URL ที่จะใช้ เช่น your-website.com/tier-list
        element: <TierListPage />,
      },
      // ---------------------------------------------------
      {
        path: "zenith-duel",
        element: <ComingSoonPage />,
      },
      {
        path: "game-guide",
        element: <GameGuide />,
      },
      {
        path: "community",
        element: <ComingSoonPage />,
      },
      {
        path: "download-game",
        element: <ComingSoonPage />,
      },
      {
        path: "about-us",
        element: <ComingSoonPage />,
      },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);