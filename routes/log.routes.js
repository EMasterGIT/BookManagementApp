// routes/log.routes.js
const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRole } = require('../middlewares/auth.middleware');
const { getLogs } = require('../controllers/log.controller'); 

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

router.get('/debug', async (req, res) => {
    const logs = await Log.findAll();
    res.json(logs);
  });
  

module.exports = router;
