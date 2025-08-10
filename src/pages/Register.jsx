// src/pages/Register.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API_ENDPOINT = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // เพิ่ม state สำหรับ loading
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // เริ่มหมุน...

    // (Logic การทำงานเหมือนเดิมทุกประการ)
    try {
      await axios.post(`${API_ENDPOINT}/api/auth/local/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      const loginResponse = await axios.post(`${API_ENDPOINT}/api/auth/local`, {
        identifier: formData.email,
        password: formData.password,
      });
      const jwt = loginResponse.data.jwt;
      localStorage.setItem('jwt', jwt);
      const guestBuilds = JSON.parse(localStorage.getItem('guestBuilds'));
      const migrationData = {};
      if (guestBuilds) migrationData.builds = guestBuilds;
      if (Object.keys(migrationData).length > 0) {
        await axios.post(`${API_ENDPOINT}/api/migrate-data`, migrationData, {
            headers: { Authorization: `Bearer ${jwt}` }
        });
      }
      localStorage.removeItem('guestBuilds');
      localStorage.removeItem('guestId');
      setLoading(false); // หยุดหมุน
      navigate('/'); 
    } catch (err) {
      setLoading(false); // หยุดหมุน
      setError(err.response?.data?.error?.message || 'An unexpected error occurred.');
    }
  };

  // --- นี่คือส่วนของ UI ที่เราจะแปลงโฉม ---
  return (
    // "กล่องใหญ่" คลุมทั้งหมด: จัดให้อยู่กลางจอ และมีพื้นหลังสีเทาเข้ม
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      
      {/* "การ์ดฟอร์ม": กล่องสีเทาที่เข้มกว่าพื้นหลัง มีขอบมน มีเงา และกำหนดความกว้าง */}
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
        
        {/* หัวข้อ */}
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-100">Create an Account</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6"> {/* "space-y-6": ทำให้ของข้างในมีระยะห่างแนวตั้งสวยๆ */}
            
            {/* ช่อง Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-2">Username</label>
              <input 
                id="username"
                type="text" 
                name="username" 
                placeholder="Enter your username" 
                onChange={handleChange} 
                required 
                // "สไตล์ของช่องกรอก": ทำให้เต็มความกว้าง, ขอบมน, พื้นหลังสีเทา, มีเส้นขอบ และมีเอฟเฟกต์สวยๆ ตอนคลิก
                className="w-full p-3 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* ช่อง Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input 
                id="email"
                type="email" 
                name="email" 
                placeholder="Enter your email" 
                onChange={handleChange} 
                required 
                className="w-full p-3 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            
            {/* ช่อง Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <input 
                id="password"
                type="password" 
                name="password" 
                placeholder="Enter your password" 
                onChange={handleChange} 
                required 
                className="w-full p-3 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>
          
          {/* ปุ่มสมัคร */}
          <button 
            type="submit"
            disabled={loading} // ทำให้กดปุ่มไม่ได้ตอนที่กำลังโหลด
            // "สไตล์ของปุ่ม": สีน้ำเงิน, ตัวอักษรขาวหนา, มีเอฟเฟกต์ตอนเอาเมาส์ไปชี้, และมีเงื่อนไขให้ปุ่มสีจางลงตอนกดไม่ได้
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-gray-500"
          >
            {loading ? 'Creating Account...' : 'Create Account & Link Data'}
          </button>

        </form>

        {/* ส่วนแสดง Error */}
        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;