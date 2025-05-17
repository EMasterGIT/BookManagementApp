// src/pages/NewBookPage.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';



function NewBookPage() {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [authors, setAuthors] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [category, setCategory] = useState('');


  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await fetch('/api/authors', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAuthors(data.authors); 
      } catch (err) {
        console.error('Viga autorite laadimisel:', err);
      }
    };
  
    if (role === 'Admin') {
      fetchAuthors();
    }
  }, [role, token]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          publicationYear: parseInt(year),
          category,
          author: { firstName, lastName } 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Raamat lisatud!');
        setTitle('');
        setYear('');
        setSelectedAuthors([]);
      } else {
        alert(data.message || 'Midagi läks valesti');
      }
    } catch (err) {
      console.error('Viga raamatu lisamisel:', err);
    }
  };

  const toggleAuthor = (id) => {
    setSelectedAuthors((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  if (role !== 'Admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Lisa uus raamat</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Pealkiri"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <input
          type="number"
          placeholder="Avaldamise aasta"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
        <br />
        <p>Sisesta autori nimi:</p>
        <input
          placeholder="Autori eesnimi"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <br />
        <input
          placeholder="Autori perekonnanimi"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <br />
        <input
            placeholder="Kategooria (žanr)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        <button type="submit">Lisa raamat</button>
      </form>
    </div>
  );
}
  
export default NewBookPage;
