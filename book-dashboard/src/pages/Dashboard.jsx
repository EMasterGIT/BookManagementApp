// Dashboard.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';




function Dashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate(); 
    const role = localStorage.getItem('role')?.trim();
  
    const handleLogout = () => {
      logout();
      navigate('/login');
    };
  

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>

      <nav>
        <ul>
          <li><Link to="books">📚 Raamatute nimekiri</Link></li>
          {role === 'Admin' && (
            <>
              <li><Link to="new">➕ Lisa uus raamat</Link></li>
              <li><Link to="logs">📜 Logid</Link></li>
            </>
          )}
          <li><Link to="search">🔍 Otsi raamatuid</Link></li>
        </ul>
      </nav>

      <button onClick={handleLogout}>Logi välja</button>

      <Outlet />
    </div>
  );
}

export default Dashboard;
