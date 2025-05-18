// src/pages/LogsPage.jsx
import React, { useEffect, useState } from 'react';

function LogsPage() {
  const [logs, setLogs] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/logs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        const logsArray = Array.isArray(data) ? data : data.logs || [];
        
        // Sort by createdAt DESC
        logsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setLogs(logsArray);
      } catch (err) {
        console.error('Viga logide toomisel:', err);
      }
    };

    fetchLogs();
  }, [token]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Logid</h2>
      {logs.length === 0 ? (
        <p>Logisid ei leitud.</p>
      ) : (
        <ul>
          {logs.map((log) => (
            <li key={log.id}>
              <strong>Tegevus:</strong> {log.action} <br />
              <strong>Kasutaja:</strong> {log.User ? log.User.username : 'Tundmatu'} <br />
              <strong>Aeg:</strong> {new Date(log.createdAt).toLocaleString()}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LogsPage;
