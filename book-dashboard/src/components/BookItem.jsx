import { useState } from 'react';

export default function BookItem({ book, role, token, authors, refreshBooks, redirectOnDelete }) {
  const [comment, setComment] = useState('');
  const [editing, setEditing] = useState(false);
  const [updatedBook, setUpdatedBook] = useState({
    title: book.title,
    publicationYear: book.publicationYear || '',
    category: book.Category?.name || '',
  });

  const handleDelete = async () => {
    if (!window.confirm('Oled kindel, et soovid selle raamatu kustutada?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/books/${book.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert('Raamat kustutati');
        if (redirectOnDelete) redirectOnDelete();
      } else {
        const data = await res.json();
        alert(`Kustutamine ebaõnnestus: ${data.message}`);
      }
    } catch (err) {
      console.error('Viga raamatu kustutamisel:', err);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    await fetch(`http://localhost:5000/api/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content: comment, bookId: book.id }),
    });
    setComment('');
    refreshBooks();
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Kustuta see kommentaar?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        refreshBooks();
      } else {
        const data = await res.json();
        alert(`Kommentaari kustutamine ebaõnnestus: ${data.message}`);
      }
    } catch (err) {
      console.error('Viga kommentaari kustutamisel:', err);
    }
  };

  const handleEditChange = (e) => {
    setUpdatedBook({ ...updatedBook, [e.target.name]: e.target.value });
  };

  const handleUpdateBook = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/books/${book.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedBook),
      });

      if (res.ok) {
        alert('Raamat uuendatud');
        setEditing(false);
        refreshBooks();
      } else {
        const data = await res.json();
        alert(`Uuendamine ebaõnnestus: ${data.message}`);
      }
    } catch (err) {
      console.error('Viga raamatu uuendamisel:', err);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', margin: '15px 0', padding: '10px' }}>
      {editing ? (
        <>
          <input
            type="text"
            name="title"
            value={updatedBook.title}
            onChange={handleEditChange}
            placeholder="Title"
          /><br />
          <input
            type="text"
            name="publicationYear"
            value={updatedBook.publicationYear}
            onChange={handleEditChange}
            placeholder="Year"
          /><br />
          <input
            type="text"
            name="category"
            value={updatedBook.category}
            onChange={handleEditChange}
            placeholder="Category"
          /><br />
          <button onClick={handleUpdateBook}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h2>{book.title}</h2>
          <p>Year: {book.publicationYear || 'Unknown'}</p>
          <p>Authors: {book.Authors?.map(a => `${a.firstName} ${a.lastName}`).join(', ') || 'N/A'}</p>
          <p>Category: {book.Category?.name || 'Unknown'}</p>
        </>
      )}

      <h4>Comments:</h4>
      {book.Comments?.length ? (
        book.Comments.map(c => (
          <div key={c.id} style={{ marginBottom: '8px' }}>
            <strong>{c.User?.username || 'Unknown'}:</strong> {c.content}
            {(role === 'Admin' || c.User?.username === localStorage.getItem('username')) && (
              <button
                onClick={() => handleDeleteComment(c.id)}
                style={{ marginLeft: '10px', color: 'white' }}
              >
                Delete
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No comments</p>
      )}

      <div>
        <textarea
          rows="2"
          placeholder="Add comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <br />
        <button onClick={handleComment}>Submit Comment</button>
      </div>

      {role === 'Admin' && !editing && (
        <>
          <button onClick={handleDelete} style={{ marginTop: '10px' }}>Delete Book</button>
          <button onClick={() => setEditing(true)} style={{ marginTop: '10px', marginLeft: '10px' }}>
            Edit Book
          </button>
        </>
      )}
    </div>
  );
}
