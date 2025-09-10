// src/components/Layout.jsx

import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user } = useAuth();

  return (
    <>
      {/* ปุ่มสำหรับเข้าไปยังหน้าตั้งค่า Notification */}
       
      {/* {user && (
         <Link 
            to="/notifications" 
            style={{ 
              position: 'fixed', 
              bottom: '20px', 
              right: '20px', 
              zIndex: 1000, 
              padding: '10px 15px', 
              borderRadius: '50px', 
              border: 'none', 
              background: '#007bff', 
              color: 'white', 
              fontSize: '14px', 
              cursor: 'pointer', 
              textDecoration: 'none' 
            }}
            title="Manage Notifications"
        >
            In-Game Notification 🔔
        </Link>
      )} */}
       
      
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;