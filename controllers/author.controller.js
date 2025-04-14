// controllers/author.controller.js
const { Author } = require('../src/models');

const getAuthors = async (req, res) => {
  try {
    const authors = await Author.findAll();
    res.json(authors);
  } catch (error) {
    console.error('Error fetching authors:', error);
    res.status(500).json({ error: 'Failed to fetch authors' });
  }
};

module.exports = { getAuthors };
