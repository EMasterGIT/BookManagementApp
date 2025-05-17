// src/pages/BookDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookItem from '../components/BookItem';
import { useNavigate } from 'react-router-dom';


function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [authors, setAuthors] = useState([]);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const fetchBook = async () => {
    if (!id) return; 
    try {
      const res = await fetch(`http://localhost:5000/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBook(data);
    } catch (err) {
      console.error('Viga raamatu laadimisel:', err);
    }
  };
  

  const fetchAuthors = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/authors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAuthors(data);
    } catch (err) {
      console.error('Viga autorite laadimisel:', err);
    }
  };

  useEffect(() => {
    if (!id) {
      console.warn("Book ID is undefined");
      return;
    }
    fetchBook();
    fetchAuthors();
  }, [id]);

  if (!book) return <p>Laen raamatut...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <BookItem
        book={book}
        role={role}
        token={token}
        authors={authors}
        refreshBooks={fetchBook}
        redirectOnDelete={() => navigate('/dashboard/books')}
      />
    </div>
  );
}

export default BookDetailPage;
