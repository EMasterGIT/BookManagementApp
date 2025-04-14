const { Comment, User, Book } = require('../src/models');
const { logAction } = require('../utils/logger');
const getComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [
        { model: User, as: 'User', attributes: ['username'] },
        { model: Book, as: 'Book', attributes: ['title'] } // Include book title if needed
      ]
    });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};


// Create a new comment
const createComment = async (req, res) => {
  const userId = req.user.id;
  try {
    const { content, bookId } = req.body;

    const comment = await Comment.create({
      content,
      bookId,
      userId: req.user.id
    });

    // Log the comment creation before sending response
    await logAction('CREATE_COMMENT', userId, `Added comment to book ID ${bookId}`);

    res.status(201).json({ comment });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Error creating comment' });
  }
};


// Delete comment (Admin only)
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByPk(id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    await comment.destroy();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Error deleting comment' });
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Find comment by ID
    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Update content if provided
    if (content) {
      comment.content = content;
    }

    await comment.save();

    res.status(200).json({ message: 'Comment updated', comment });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

module.exports = { getComments,createComment, updateComment, deleteComment };