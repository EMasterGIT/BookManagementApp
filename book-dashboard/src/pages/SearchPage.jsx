import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';

function SearchPage() {
  const [search, setSearch] = useState('');
  const [searchField, setSearchField] = useState('title'); // default
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (search.trim() === '') {
        setResults([]);
        setSearched(false);
        return;
      }

      setLoading(true);
      setSearched(true);

      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/books/search?field=${searchField}&q=${encodeURIComponent(search)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setResults(data.books || []);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [search, searchField]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Otsi raamatuid</h2>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Otsi:</label>
        <select value={searchField} onChange={e => setSearchField(e.target.value)}>
          <option value="title">Pealkiri</option>
          <option value="author">Autor</option>
          <option value="year">Aasta</option>
          <option value="category">Kategooria</option>
        </select>
      </div>

      <SearchBar search={search} setSearch={setSearch} />
      <p>Otsingusõna: <strong>{search}</strong> (valdkond: <strong>{searchField}</strong>)</p>

      {loading && <p>Laen tulemusi...</p>}

      {!loading && searched && results.length === 0 && (
        <p>📭 Raamatuid ei leitud.</p>
      )}

      <ul>
        {results.map(book => (
          <li key={book.id}>
            <strong>{book.title}</strong>
            {' — '}
            {book.Authors && book.Authors.length > 0
              ? book.Authors.map(author => `${author.firstName} ${author.lastName}`).join(', ')
              : 'Tundmatu autor'}
            {' '}
            ({book.publicationYear || 'Aasta puudub'})
            {' '}
            {book.Category ? `— ${book.Category.name}` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchPage;
