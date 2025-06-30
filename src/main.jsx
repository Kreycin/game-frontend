// src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// 1. Import Layout และหน้าต่างๆ เข้ามา
import Layout from './components/Layout.jsx';
import App from './App.jsx';
import NewPage from './pages/NewPage.jsx';
import GameGuide from './pages/GameGuide.jsx';
import Community from './pages/Community.jsx';
import DownloadGame from './pages/DownloadGame.jsx';
import AboutUs from './pages/AboutUs.jsx';
import './App.css';

// 2. สร้าง Router ในโครงสร้างแบบมี Layout กลาง
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // ให้ Layout เป็น "กรอบ" หลักของทุกหน้า
    children: [ // หน้าต่างๆ จะกลายเป็น "ลูก" ของ Layout
      {
        index: true, // path: "/" (หน้าหลัก)
        element: <App />, 
      },
      {
        path: "zenith-duel", // path: "/zenith-duel"
        element: <NewPage />, 
      },
      {
        path: "game-guide",
        element: <GameGuide />,
      },
      {
        path: "community",
        element: <Community />,
      },
      {
        path: "download-game",
        element: <DownloadGame />,
      },
      {
        path: "about-us",
        element: <AboutUs />,
      },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);