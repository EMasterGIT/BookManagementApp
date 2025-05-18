// routes/category.routes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticateJWT, authorizeRole } = require('../middlewares/auth.middleware');


router.get('/', authenticateJWT, authorizeRole('Admin','User'), categoryController.getAllCategories);

module.exports = router;
