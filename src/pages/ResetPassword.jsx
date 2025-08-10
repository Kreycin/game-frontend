// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_ENDPOINT = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ดึง "โค้ดลับ" จาก URL ที่ผู้ใช้กดมาจากอีเมล
  const resetCode = searchParams.get('code');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError("Passwords don't match.");
      return;
    }
    setError('');
    try {
      await axios.post(`${API_ENDPOINT}/api/auth/reset-password`, {
        code: resetCode,
        password,
        passwordConfirmation,
      });
      setMessage('Your password has been reset successfully. You can now log in.');
      setTimeout(() => navigate('/login'), 3000); // พาไปหน้า login หลังผ่านไป 3 วิ
    } catch (err) {
      setError('An error occurred. The link may be invalid or expired.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-100">Reset Password</h2>
        {message ? (
          <p className="text-center text-green-400">{message}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                       className="w-full p-3 bg-gray-700 text-gray-100 rounded-md border border-gray-600"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                <input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required
                       className="w-full p-3 bg-gray-700 text-gray-100 rounded-md border border-gray-600"/>
              </div>
            </div>
            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
            <button type="submit" className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md">
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;