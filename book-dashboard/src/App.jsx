// App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import BookListPage from './pages/BookListPage';
import BookDetailPage from './pages/BookDetailPage';
import NewBookPage from './pages/NewBookPage';
import SearchPage from './pages/SearchPage';
import LogsPage from './pages/LogsPage';
import { AuthProvider, useAuth } from './utils/AuthContext';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';



function AppRoutes() {
  
const { token, login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (username, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        login(data.token);
        localStorage.setItem('role', data.role);
        navigate('/dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleRegister = async (username, password, role) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role }),
    });
    const data = await res.json();
    alert(data.message || 'Registered!');
  };

  
return (
  <Routes>
    {!token ? (
      <>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} onRegister={handleRegister} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </>
    ) : (
      <>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="books" element={<BookListPage />} />
          <Route path="books/:id" element={<BookDetailPage />} />
          <Route path="new" element={<NewBookPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="logs" element={<LogsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </>
    )}
  </Routes>
);
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
