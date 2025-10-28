// src/pages/Login.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import bgImage from '../assets/bg.jpg';

// Data dummy pengguna berdasarkan file bookings.csv
// Password disamakan dengan email untuk kemudahan demo
const dummyUsers = [
  { id: '3112b676-1700-400c-9650-842bd7f9cea5', name: 'Aryo Santoso', email: 'aryo.santoso@email.com', password: '123' },
  { id: 2, name: 'Siti Nurhaliza', email: 'siti.nur@email.com', password: '123' },
  { id: 3, name: 'Ahmad Hidayat', email: 'ahmad.hidayat@email.com', password: '123' },
  { id: 4, name: 'Kampret', email: 'dggh@ghbb', password: '123' },
  { id: 5, name: 'jono', email: 'jono@jono', password: '123' },
  { id: 6, name: 'Admin', email: 'admin', password: 'admin' }
];


export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Cari pengguna di dalam array dummyUsers
      const foundUser = dummyUsers.find(
        (user) => user.email === email && user.password === password
      );

      if (foundUser) {
        const dummyToken = `dummy-auth-token-${foundUser.id}`;
        // pastikan selalu menyimpan user_id; jika tidak ada, gunakan 1
        const userToStore = {
          id: foundUser.id ?? '3112b676-1700-400c-9650-842bd7f9cea5',
          name: foundUser.name ?? foundUser.email ?? 'Guest',
          email: foundUser.email ?? email,
        };

        if (remember) {
          localStorage.setItem('auth_token', dummyToken);
          localStorage.setItem('user', JSON.stringify(userToStore));
        } else {
          sessionStorage.setItem('auth_token', dummyToken);
          sessionStorage.setItem('user', JSON.stringify(userToStore));
        }
        
        console.log('Login berhasil!', userToStore);
        navigate('/home'); // Arahkan ke halaman pesanan saya

      } else {
        setError('Email atau password yang Anda masukkan salah.');
      }

      setLoading(false);
    }, 1500);
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center font-sans bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-teal-600/60 to-cyan-700/80 md:from-transparent md:to-transparent"></div>
      <div className="relative z-10 max-w-md w-full bg-white rounded-2xl shadow-lg p-8 m-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Login</h1>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-200 p-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 p-3 transition"
              autoComplete="username"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 p-3 pr-10 transition"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="form-checkbox h-4 w-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <span className="text-gray-600">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-teal-600 hover:underline font-medium">
              Lupa password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-all duration-300 ease-in-out font-semibold text-base disabled:bg-teal-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.75V6.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M17.1266 6.87347L16.0659 7.93413" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M19.25 12L17.75 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M17.1266 17.1265L16.0659 16.0659" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M12 17.75V19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M6.87344 17.1265L7.9341 16.0659" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M4.75 12L6.25 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M6.87344 6.87347L7.9341 7.93413" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            <span>{loading ? 'Memproses...' : 'Masuk'}</span>
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-600">Belum punya akun? </span>
          <Link to="/register" className="text-teal-600 hover:underline font-medium">
            Daftar
          </Link>
        </div>
      </div>
    </div>
  );
}