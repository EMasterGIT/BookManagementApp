const API_URL = 'http://localhost:5000/api';

let authors = []; // Globaalne muutuja autorite salvestamiseks


// Abifunktsioon JWT dekodeerimiseks ja kasutaja rolli saamiseks
function getUserRole() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/';
    return;
  }

    await fetchAuthors(token);
    fetchBooks(token);

  // Logide nupu loomine ja sündmuste kuulamine
  // Ainult Admin rolliga kasutajatele
  if (getUserRole() === 'Admin') {
    const logsBtn = document.createElement('button');
    logsBtn.textContent = 'View Logs';
    logsBtn.id = 'view-logs-btn';
    logsBtn.style.margin = '10px';

    logsBtn.addEventListener('click', async () => {
      try {
        const res = await fetch(`${API_URL}/logs`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error(`Failed to fetch logs: ${res.status}`);
        const logs = await res.json();

        const existingLogs = document.getElementById('logs-container');
        if (existingLogs) existingLogs.remove();

        const logsContainer = document.createElement('div');
        logsContainer.id = 'logs-container';
        logsContainer.style.border = '1px solid #ccc';
        logsContainer.style.padding = '10px';
        logsContainer.style.marginTop = '20px';
        logsContainer.style.backgroundColor = '#f9f9f9';

        logsContainer.innerHTML = `
        <h3>System Logs</h3>
      <ul>
        ${logs.map(log => {
          

          // Kasuta logi loomise kuupäev ja kellaaeg  
          let timestamp = log.createdAt ? new Date(log.createdAt) : new Date();

          // Kui kuupäev on vale, kasuta praegust aega
          if (isNaN(timestamp.getTime())) {
            timestamp = new Date(); 
          }

          return `<li><strong>${timestamp.toLocaleString()}</strong>: ${log.description}</li>`;
        }).join('')}
      </ul>
    `;
  
      document.body.appendChild(logsContainer);
    } catch (err) {
      console.error('Error loading logs:', err);
      alert('Could not load logs');
    }
  });

    
    document.body.appendChild(logsBtn);
  }

  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = '/';
    });
  }
});




// Autorite hankimine ja globaalsesse muutujasse salvestamine
async function fetchAuthors(token) {
  if (!token) {
    console.error("Token is not available!");
    return;
  }
  try {
    const response = await fetch(`${API_URL}/authors`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

    const data = await response.json();
    authors = data.authors || [];
    
  } catch (err) {
    console.error('Failed to fetch authors:', err);
  }
}

// Funktsioon autori nime uuendamiseks
async function updateAuthor(authorId, newName, token) {
  const [firstName, lastName] = newName.split(' ');
  try {
    const response = await fetch(`${API_URL}/authors/${authorId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update author');
    }

    const updatedAuthor = await response.json();
    return updatedAuthor;
  } catch (error) {
    console.error('Error updating author:', error);
    return null;
  }
}

// Funktsioon uue autori loomiseks
async function createAuthor(newName, token) {
  const [firstName, lastName] = newName.split(' ');
  try {
    const response = await fetch(`${API_URL}/authors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create author');
    }

    const createdAuthor = await response.json();
    return createdAuthor;
  } catch (error) {
    console.error('Error creating author:', error);
    return null;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/';
    return;
  }

  await fetchAuthors(token); // Laadi autorid enne raamatuid
  fetchBooks(token);

  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = '/';
    });
  }
});

// Funktsioon raamatute hankimiseks ja kuvamiseks
function fetchBooks(token) {
  if (!token) {
    console.error("No token available!");
    return;
  }

  fetch(`${API_URL}/books`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {
      const booksList = document.getElementById('books-list');
      booksList.innerHTML = '';
      const role = getUserRole();

      if (data.books && data.books.length > 0) {
        data.books.forEach(book => {
          const bookElement = document.createElement('div');
          bookElement.classList.add('book');

          const authorsText = book.Authors && book.Authors.length > 0
            ? book.Authors.map(author => `${author.firstName} ${author.lastName}`).join(', ')
            : 'No authors available';

          const commentsHtml = book.Comments && book.Comments.length > 0
            ? book.Comments.map(comment => ` 
                <div class="comment">
                  <p><strong>${comment.User?.username || 'Anonymous'}:</strong> ${comment.content}</p>
                </div>
              `).join('')
            : '<p>No comments yet.</p>';

          bookElement.innerHTML = `
            <h2>${book.title}</h2>
            <p>Year: ${book.publicationYear || 'Unknown'}</p>
            <p>Authors: ${authorsText}</p>
            <h4>Comments:</h4>
            ${commentsHtml}
            <textarea placeholder="Add a comment..." class="comment-input" data-book-id="${book.id}"></textarea>
            <button class="comment-btn" data-book-id="${book.id}">Submit Comment</button>
          `;

          if (role === 'Admin') {
            const deleteBookBtn = document.createElement('button');
            deleteBookBtn.textContent = 'Delete Book';
            deleteBookBtn.addEventListener('click', () => deleteBook(book.id, token));
            bookElement.appendChild(deleteBookBtn);

            const updateBookBtn = document.createElement('button');
            updateBookBtn.textContent = 'Update Book';
            updateBookBtn.addEventListener('click', async () => {
              const newTitle = prompt('Enter new title for the book:', book.title);
              const newAuthorName = prompt('Enter new author full name (e.g. John Doe):');
              const updateData = {};

              if (newTitle && newTitle.trim() !== '') {
                updateData.title = newTitle.trim();
              }

              if (newAuthorName && newAuthorName.trim() !== '') {
                const trimmedAuthorName = newAuthorName.trim();
                const matchedAuthor = authors.find(author => {
                  const fullName = `${author.firstName} ${author.lastName}`.trim();
                  return fullName.toLowerCase() === trimmedAuthorName.toLowerCase();
                });

                console.log('Matched author:', matchedAuthor);

                if (matchedAuthor) {
                  // Uuenda autori nime andmebaasis
                  const updatedAuthor = await updateAuthor(matchedAuthor.id, trimmedAuthorName, token);
                  if (updatedAuthor) {
                    updateData.authorIds = [updatedAuthor.id];
                    console.log('Updated author:', updatedAuthor);
                  }
                } else {
                  // Loo uus autor, kui vastet ei leitud
                  const newAuthor = await createAuthor(trimmedAuthorName, token);
                  updateData.authorIds = [newAuthor.id];
                  console.log('Created new author:', newAuthor);
                }
              }

              if (Object.keys(updateData).length > 0) {
                updateBook(book.id, updateData, token);
              }
            });
            bookElement.appendChild(updateBookBtn);
          }

          booksList.appendChild(bookElement);
        });
      } else {
        booksList.innerHTML = '<p>No books found</p>';
      }
    })
    .catch(error => console.error('Failed to load books:', error));
}

// Kommentaari saatmise sündmuste kuulamine
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('comment-btn')) {
    const bookId = event.target.getAttribute('data-book-id');
    const textarea = document.querySelector(`textarea[data-book-id="${bookId}"]`);
    const commentContent = textarea?.value;

    if (!commentContent || commentContent.trim() === '') {
      return;
    }

    fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ content: commentContent, bookId: bookId })
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
        return res.json();
      })
      .then(data => {
        textarea.value = '';
        fetchBooks(localStorage.getItem('token'));
      })
      .catch(error => console.error('Error submitting comment:', error));
  }
});

// Admin: Kustuta raamat
const deleteBook = (bookId, token) => {
  if (confirm('Are you sure you want to delete this book?')) {
    fetch(`${API_URL}/books/${bookId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
        return res.json();
      })
      .then(data => {
        fetchBooks(token);
      })
      .catch(error => console.error('Error deleting book:', error));
  }
};

// Admin: Uuenda raamat
const updateBook = (bookId, updateData, token) => {
  fetch(`${API_URL}/books/${bookId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updateData)
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
      return res.json();
    })
    .then(data => {
      fetchBooks(token);
    })
    .catch(error => console.error('Error updating book:', error));
};
