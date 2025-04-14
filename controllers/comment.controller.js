const { Comment, User, Book } = require('../src/models');
const { logAction } = require('../utils/logger');

// Kommentaaride hankimine
const getComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [
        { model: User, as: 'User', attributes: ['username'] }, // Kaasa kasutajanimi
        { model: Book, as: 'Book', attributes: ['title'] } // Kaasa raamatu pealkiri, kui vaja
      ]
    });
    res.json(comments);
  } catch (error) {
    console.error('Viga kommentaaride hankimisel:', error);
    res.status(500).json({ error: 'Kommentaaride hankimine ebaõnnestus' });
  }
};

// Uue kommentaari loomine
const createComment = async (req, res) => {
  const userId = req.user.id;
  try {
    const { content, bookId } = req.body;

    const comment = await Comment.create({
      content,
      bookId,
      userId: req.user.id
    });

    // Logi kommentaari loomine enne vastuse saatmist
    await logAction('CREATE_COMMENT', userId, `Lisati kommentaar raamatu ID-le ${bookId}`);

    res.status(201).json({ comment });
  } catch (error) {
    console.error('Viga kommentaari loomisel:', error);
    res.status(500).json({ error: 'Kommentaari loomine ebaõnnestus' });
  }
};

// Kommentaari kustutamine (ainult Admin)
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByPk(id);
    if (!comment) return res.status(404).json({ message: 'Kommentaari ei leitud' });
    await comment.destroy();
    res.status(200).json({ message: 'Kommentaar kustutati edukalt' });
  } catch (error) {
    console.error('Viga kommentaari kustutamisel:', error);
    res.status(500).json({ error: 'Kommentaari kustutamine ebaõnnestus' });
  }
};

module.exports = { getComments, createComment, deleteComment };