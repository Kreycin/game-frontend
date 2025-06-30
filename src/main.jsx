// src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Layout from './components/Layout.jsx';
import App from './App.jsx';
// 1. Import หน้า ComingSoonPage เข้ามา
import ComingSoonPage from './pages/ComingSoonPage.jsx';

// (ตอนนี้เราไม่จำเป็นต้อง import หน้าเปล่าๆ อื่นๆ แล้ว)
// import NewPage from './pages/NewPage.jsx';
// import GameGuide from './pages/GameGuide.jsx';
// ...

import './App.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <App />, // หน้าหลัก (New character leaks)
      },
      // 2. ให้ทุกหน้าที่ยังไม่มีเนื้อหา แสดงผลเป็น ComingSoonPage ทั้งหมด
      {
        path: "zenith-duel",
        element: <ComingSoonPage />,
      },
      {
        path: "game-guide",
        element: <ComingSoonPage />,
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