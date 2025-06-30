// src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // 1. Import เครื่องมือ Router

import App from './App.jsx';
import NewPage from './pages/NewPage.jsx'; // 2. Import หน้าใหม่ที่เราจะสร้าง
import './App.css';

// 3. สร้าง "สารบัญ" ของเว็บไซต์
const router = createBrowserRouter([
  {
    path: "/", // ถ้าผู้ใช้มาที่ URL หลัก (เช่น demonslayerhub.vercel.app/)
    element: <App />, // ให้แสดง Component App (หน้าตัวละคร)
  },
  {
    path: "/new-page", // ถ้าผู้ใช้มาที่ URL /new-page
    element: <NewPage />, // ให้แสดง Component NewPage
  },
  // ... คุณสามารถเพิ่มหน้าอื่นๆ ได้ที่นี่ในอนาคต ...
]);

// 4. สั่งให้ React แสดงผลตาม "สารบัญ" ที่เราสร้าง
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);