import { useState } from 'react';
import React from 'react';

export default function LoginPage({ onLogin, onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [role, setRole] = useState('User');

  const handleLogin = async (e) => {
    e.preventDefault();
    await onLogin(username, password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    await onRegister(registerUsername, registerPassword, role);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>

      <h3>New User? Register here</h3>
      <form onSubmit={handleRegister}>
        <input placeholder="Username" value={registerUsername} onChange={e => setRegisterUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} required />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
