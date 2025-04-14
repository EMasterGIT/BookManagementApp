// controllers/book.controller.js
const { Book, Author, Comment,User } = require('../src/models');
const { logAction } = require('../utils/logger');


const getBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      order: [['createdAt', 'DESC']], 
      include: [
        {
          model: Author,
          as: 'Authors',
          through: { attributes: [] }
        },
        {
          model: Comment,
          as: 'Comments',
          include: [
            {
              model: User,
              as: 'User',
              attributes: ['username']
            }
          ]
        }
      ]
    });
   
    res.json({ books });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, publicationYear, authorIds } = req.body;
    const userId = req.user.id;

    const book = await Book.findByPk(id, { include: ['Authors'] });
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Store old authors for logging
    const oldAuthors = book.Authors.map(author => `${author.firstName} ${author.lastName}`);

    // Update title and publication year
    book.title = title || book.title;
    book.publicationYear = publicationYear || book.publicationYear;

    // Update authors if provided
    let newAuthors = oldAuthors;
    if (authorIds && authorIds.length > 0) {
      await book.setAuthors(authorIds);
      // Reload book with updated authors
      const updatedBook = await Book.findByPk(id, { include: ['Authors'] });
      newAuthors = updatedBook.Authors.map(author => `${author.firstName} ${author.lastName}`);
    }

    await book.save();

    res.status(200).json({ message: 'Book updated successfully', book });

    // Logging action
    await logAction(
      'UPDATE_BOOK',
      userId,
      `Updated book ID ${id} - Title: "${book.title}", Year: ${book.publicationYear}, Authors: ${newAuthors.join(', ')} (previously: ${oldAuthors.join(', ')})`
    );
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Error updating book' });
  }
};

const deleteBook = async (req, res) => {
  
  const userId = req.user.id;
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    await book.destroy();
    res.status(200).json({ message: 'Book deleted successfully' });
    await logAction('DELETE_BOOK', userId, `Deleted book with ID ${id}`);
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Error deleting book' });
  }
  
  
};

module.exports = { getBooks, updateBook, deleteBook };
