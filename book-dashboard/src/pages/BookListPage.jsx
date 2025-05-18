// src/pages/BookListPage.jsx
import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import { Link } from 'react-router-dom';

function BookListPage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/books', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        console.log('Laetud raamatud:', data); 

        setBooks(data.books);
      } catch (err) {
        console.error('Viga raamatute laadimisel:', err);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>Raamatute nimekiri</h2>
      <SearchBar search={search} setSearch={setSearch} />
      <ul>
        {filteredBooks.map(book => (
          <li key={book._id}>
            <Link to={`/dashboard/books/${book.id}`}>{book.title}</Link>

          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookListPage;
