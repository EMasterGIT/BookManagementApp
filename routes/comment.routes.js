// routes/comment.routes.js

const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRole } = require('../middlewares/auth.middleware');
const commentController = require('../controllers/comment.controller');

// GET: Fetch comments (protected)
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management
 */

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: A list of comments
 *   post:
 *     summary: Add a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               BookId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Comment created
 *
 * /api/comments/{id}:
 *   put:
 *     summary: Update a comment (Admin only)
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated
 *   delete:
 *     summary: Delete a comment (Admin only)
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment deleted
 */

router.get('/', authenticateJWT, authorizeRole('User', 'Admin'), commentController.getComments);

// POST: Add comment
router.post('/', authenticateJWT, authorizeRole('User', 'Admin'), commentController.createComment);

// PUT: Update comment (Admin only)
router.put('/:id', authenticateJWT, authorizeRole('Admin'), commentController.updateComment);

// DELETE: Delete comment (Admin only)
router.delete('/:id', authenticateJWT, authorizeRole('Admin'), commentController.deleteComment);


module.exports = router;
