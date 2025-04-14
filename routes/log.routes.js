// routes/log.routes.js
const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRole } = require('../middlewares/auth.middleware'); // Correct import
const { getLogs } = require('../controllers/log.controller'); // Example controller

// Log viewing route, restricted to "Admin" role
/**
 * @swagger
 * tags:
 *   name: Logs
 *   description: Log management
 */
/**
 * @swagger
 * /api/logs:
 *   get:
 *     summary: Get all logs
 *     tags: [Logs]
 *     responses:
 *       200:
 *         description: A list of logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                   message:
 *                     type: string
 */
router.get('/', authenticateJWT, authorizeRole('Admin'), getLogs);

module.exports = router;
