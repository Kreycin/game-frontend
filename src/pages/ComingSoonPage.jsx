// src/pages/ComingSoonPage.jsx

import React from 'react';

const ComingSoonPage = () => {
  // <<< ให้นำ URL ของรูปภาพที่คุณคัดลอกมาจาก Cloudinary มาวางที่นี่ >>>
  const imageUrl = 'https://res.cloudinary.com/di8bf7ufw/image/upload/v1751302930/comingsoon_wvxepm.png';

  // สไตล์เพื่อให้รูปภาพอยู่กลางจอ
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    // คำนวณความสูงให้พอดีๆ โดยประมาณความสูงของ Navbar ออกไป
    height: 'calc(100vh - 120px)', 
  };

  const imageStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain', // ทำให้รูปย่อพอดีในกรอบโดยไม่ถูกตัด
  };

  return (
    <div style={containerStyle}>
      <img src={imageUrl} alt="Coming Soon" style={imageStyle} />
    </div>
  );
};

export default ComingSoonPage;