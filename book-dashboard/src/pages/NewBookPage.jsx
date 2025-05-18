// src/pages/NewBookPage.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function NewBookPage() {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Fetchib andmed serverist
  const fetchData = async () => {
    try {
      if (role === 'Admin') {
        const [, categoriesRes] = await Promise.all([
          fetch('/api/authors', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/categories', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const categoriesText = await categoriesRes.text();
        

        const categoriesData = JSON.parse(categoriesText);
        setCategories(categoriesData.categories);
      }
    } catch (err) {
      console.error('Viga andmete laadimisel:', err);
    }
  };

  // Kutsubi andmete laadimine
  useEffect(() => {
    fetchData();
  }, []);

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
          categoryId: selectedCategoryId,
          author: { firstName, lastName }
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Raamat lisatud!');
        setTitle('');
        setYear('');
        setFirstName('');
        setLastName('');
        setSelectedCategoryId('');
      } else {
        alert(data.message || 'Midagi läks valesti');
      }
    } catch (err) {
      console.error('Viga raamatu lisamisel:', err);
    }
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
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          required
        >
          <option value="">Vali kategooria</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <br />
        <button type="submit">Lisa raamat</button>
      </form>
    </div>
  );
}

export default NewBookPage;
