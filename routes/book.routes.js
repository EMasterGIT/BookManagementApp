
const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRole} = require('../middlewares/auth.middleware');
const bookController = require('../controllers/book.controller');

// Get all books (accessible to logged in users)
/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management
 */
/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 *                   category:
 *                     type: string
 */
router.get('/', authenticateJWT, authorizeRole('User', 'Admin'), bookController.getBooks);


// Allow only Admin to update books
/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
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
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book updated
 */
router.put('/:id', authenticateJWT, authorizeRole('Admin'), bookController.updateBook);

// Allow only Admin to delete books
/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Remove a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book removed
 */
router.delete('/:id', authenticateJWT, authorizeRole('Admin'), bookController.deleteBook);

module.exports = router;

