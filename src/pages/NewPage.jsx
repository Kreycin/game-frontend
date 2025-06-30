// src/pages/NewPage.jsx

import React from 'react';

const NewPage = () => {
  return (
    <div style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>
      <h1>This is the New Page</h1>
      <p>นี่คือหน้าเว็บใหม่ที่คุณเพิ่งสร้างขึ้นมา</p>
      <a href="/" style={{ color: '#61dafb' }}>กลับไปที่หน้าหลัก</a>
    </div>
  );
};

export default NewPage;