// controllers/book.controller.js
const { Book, Author, Comment, User, Category } = require('../src/models');
const { logAction } = require('../utils/logger');

// Hankige konkreetne raamat ID alusel
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id, {
      include: [
        {
          model: Author,
          as: 'Authors',
          through: { attributes: [] }
        },
        {
          model: Category,
          as: 'Category'
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

    if (!book) {
      return res.status(404).json({ message: 'Raamatut ei leitud' });
    }

    res.json(book);
  } catch (error) {
    console.error('Viga raamatu leidmisel:', error);
    res.status(500).json({ error: 'Raamatu leidmine ebaõnnestus' });
  }
};




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
        { model: Category, 
          as: 'Category',
          attributes: ['id', 'name'] },
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

// Otsingufunktsioon raamatute leidmiseks pealkirja või autori järgi
const { Op, literal } = require('sequelize');


const searchBooks = async (req, res) => {
  const { q, field } = req.query;

  if (!q || q.trim() === '') {
    return res.status(400).json({ message: 'Otsingusõna on kohustuslik' });
  }

  const query = q.trim();
  const where = {};
  const include = [];

  try {
    switch (field) {
      case 'title':
        where.title = { [Op.iLike]: `%${query}%` };
        break;
    
      case 'year':
        where[Op.and] = [
          literal(`CAST("Book"."publicationYear" AS TEXT) ILIKE '%${query}%'`)
        ];
        break;
    
      case 'author':
        include.push({
          model: Author,
          as: 'Authors',
          through: { attributes: [] },
          where: {
            [Op.or]: [
              { firstName: { [Op.iLike]: `%${query}%` } },
              { lastName: { [Op.iLike]: `%${query}%` } }
            ]
          },
          required: true
        });
        break;
    
      case 'category':
        include.push({
          model: Category,
          as: 'Category',
          where: {
            name: { [Op.iLike]: `%${query}%` }
          },
          required: true
        });
        break;
    
      default:
        return res.status(400).json({ message: 'Vigane otsingu väli' });
    }

    // Always include authors & category for context
    if (!include.find(i => i.as === 'Authors')) {
      include.push({
        model: Author,
        as: 'Authors',
        through: { attributes: [] }
      });
    }

    if (!include.find(i => i.as === 'Category')) {
      include.push({
        model: Category,
        as: 'Category'
      });
    }

    const books = await Book.findAll({
      where,
      include
    });

    res.json({ books });
  } catch (error) {
    console.error('Viga otsingul:', error);
    res.status(500).json({ message: 'Otsing ebaõnnestus' });
  }
};


const createBook = async (req, res) => {
  try {
    const { title, publicationYear, categoryId, author } = req.body;

    if (!author || !author.firstName || !author.lastName) {
      return res.status(400).json({ message: 'Autorinimi on kohustuslik' });
    }

    const newBook = await Book.create({
      title,
      publicationYear,
      categoryId,
    });

    // Create author and associate
    const newAuthor = await Author.create(author);
    await newBook.addAuthor(newAuthor);

    res.status(201).json({ message: 'Raamat lisatud', book: newBook });
  } catch (err) {
    console.error('Viga raamatu lisamisel:', err);
    res.status(500).json({ message: 'Serveri viga' });
  }
};




module.exports = { getBookById, getBooks, updateBook, deleteBook, searchBooks, createBook };