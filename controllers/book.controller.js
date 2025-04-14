// controllers/book.controller.js
const { Book, Author, Comment, User } = require('../src/models');
const { logAction } = require('../utils/logger');

// Raamatute hankimine
const getBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      order: [['createdAt', 'DESC']], // Sorteeri loomiskuupäeva järgi kahanevas järjekorras
      include: [
        {
          model: Author,
          as: 'Authors',
          through: { attributes: [] } // Ära kaasa seostabeli andmeid
        },
        {
          model: Comment,
          as: 'Comments',
          include: [
            {
              model: User,
              as: 'User',
              attributes: ['username'] // Kaasa kasutajanimi
            }
          ]
        }
      ]
    });

    res.json({ books });
  } catch (error) {
    console.error('Viga raamatute hankimisel:', error);
    res.status(500).json({ error: 'Raamatute hankimine ebaõnnestus' });
  }
};

// Raamatu uuendamine
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, publicationYear, authorIds } = req.body;
    const userId = req.user.id;

    const book = await Book.findByPk(id, { include: ['Authors'] });
    if (!book) return res.status(404).json({ message: 'Raamatut ei leitud' });

    // Salvesta vanad autorid logimiseks
    const oldAuthors = book.Authors.map(author => `${author.firstName} ${author.lastName}`);

    // Uuenda pealkiri ja avaldamisaasta
    book.title = title || book.title;
    book.publicationYear = publicationYear || book.publicationYear;

    // Uuenda autoreid, kui need on esitatud
    let newAuthors = oldAuthors;
    if (authorIds && authorIds.length > 0) {
      await book.setAuthors(authorIds);
      // Laadi raamat uuesti koos uuendatud autoritega
      const updatedBook = await Book.findByPk(id, { include: ['Authors'] });
      newAuthors = updatedBook.Authors.map(author => `${author.firstName} ${author.lastName}`);
    }

    await book.save();

    res.status(200).json({ message: 'Raamat uuendati edukalt', book });

    // Logi tegevus
    await logAction(
      'UPDATE_BOOK',
      userId,
      `Uuendati raamatut ID-ga ${id} - Pealkiri: "${book.title}", Aasta: ${book.publicationYear}, Autorid: ${newAuthors.join(', ')} (varem: ${oldAuthors.join(', ')})`
    );
  } catch (error) {
    console.error('Viga raamatu uuendamisel:', error);
    res.status(500).json({ error: 'Raamatu uuendamine ebaõnnestus' });
  }
};

// Raamatu kustutamine
const deleteBook = async (req, res) => {
  const userId = req.user.id;
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: 'Raamatut ei leitud' });
    await book.destroy();
    res.status(200).json({ message: 'Raamat kustutati edukalt' });
    await logAction('DELETE_BOOK', userId, `Kustutati raamat ID-ga ${id}`);
  } catch (error) {
    console.error('Viga raamatu kustutamisel:', error);
    res.status(500).json({ error: 'Raamatu kustutamine ebaõnnestus' });
  }
};

module.exports = { getBooks, updateBook, deleteBook };