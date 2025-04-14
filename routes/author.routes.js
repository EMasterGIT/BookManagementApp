const express = require('express');
const router = express.Router();
const { Author } = require('../src/models');
const { authenticateJWT, authorizeRole } = require('../middlewares/auth.middleware');

// Get all authors
/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Author management
 */
// Get all authors
/**
 * @swagger
 * /api/authors:
 *   get:
 *     summary: Get all authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: A list of authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 */
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const authors = await Author.findAll(); // Fetch all authors from the database
    res.json({ authors });
  } catch (error) {
    console.error('Error fetching authors:', error);
    res.status(500).json({ message: 'Failed to fetch authors' });
  }
});

// Update an existing author by ID
/**
 * @swagger
 * /api/authors/{id}:
 *   put:
 *     summary: Update an author
 *     tags: [Authors]
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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Author updated successfully
 */
router.put('/:id', authenticateJWT, authorizeRole('Admin'), async (req, res) => {
  const { firstName, lastName } = req.body;
  try {
    const author = await Author.findByPk(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    author.firstName = firstName;
    author.lastName = lastName;

    await author.save();
    res.json(author);
  } catch (error) {
    console.error('Error updating author:', error);
    res.status(500).json({ message: 'Failed to update author' });
  }
});

// Create a new author
/**
 * @swagger
 * /api/authors:
 *   post:
 *     summary: Create a new author
 *     tags: [Authors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Author created successfully
 */
router.post('/', authenticateJWT, authorizeRole('Admin'), async (req, res) => {
  const { firstName, lastName } = req.body;
  try {
    const newAuthor = await Author.create({ firstName, lastName });
    res.status(201).json(newAuthor);
  } catch (error) {
    console.error('Error creating author:', error);
    res.status(500).json({ message: 'Failed to create author' });
  }
});

module.exports = router;
