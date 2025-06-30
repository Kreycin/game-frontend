// src/components/Layout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Import Navbar เข้ามา

const Layout = () => {
  return (
    // เราใช้ className="App" เพื่อให้ยังคงสไตล์พื้นหลังและ padding เดิมไว้
    <div className="App"> 
      <Navbar />
      <main>
        {/* Outlet คือตำแหน่งที่เนื้อหาของแต่ละหน้าจะถูกนำมาแสดง */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;