
const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRole} = require('../middlewares/auth.middleware');
const bookController = require('../controllers/book.controller');


// GET kõik raamatud
/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management
 */

/**
 * @swagger
 * /api/books/search:
 *   get:
 *     summary: Search books by title or author
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of books matching the search criteria
 */
router.get('/search', authenticateJWT, authorizeRole('User', 'Admin'), bookController.searchBooks);




/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A book object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/:id',authenticateJWT, authorizeRole('User', 'Admin'), bookController.getBookById);
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


// Luba ainud Adminil lisada uusi raamatuid
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

// Ainult Adminil on õigus kustutada raamatuid
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


/** @swagger
 * /api/books:
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
*/
router.post('/', authenticateJWT, authorizeRole('Admin'), bookController.createBook);

module.exports = router;

