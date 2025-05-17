import { useState } from 'react';

export default function BookItem({  book, role, token, authors, refreshBooks,redirectOnDelete }) {
  const [comment, setComment] = useState('');

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
        if (redirectOnDelete) redirectOnDelete(); // 👈 Redirect
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

  return (
    <div style={{ border: '1px solid #ccc', margin: '15px 0', padding: '10px' }}>
      <h2>{book.title}</h2>
      <p>Year: {book.publicationYear || 'Unknown'}</p>
      <p>Authors: {book.Authors?.map(a => `${a.firstName} ${a.lastName}`).join(', ') || 'N/A'}</p>
      <p>Category: {book.Category?.name || 'Unknown'}</p>

      <h4>Comments:</h4>
      {book.Comments?.length
        ? book.Comments.map(c => (
            <p key={c.id}><strong>{c.User?.username || 'Unknown'}:</strong> {c.content}</p>
          ))
        : <p>No comments</p>}

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

      {role === 'Admin' && (
        <>
          <button onClick={handleDelete} style={{ marginTop: '10px' }}>Delete Book</button>
        </>
      )}
    </div>
  );
}
