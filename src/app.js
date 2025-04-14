const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const { sequelize } = require('../src/models');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc'); 


const app = express();
const port = 5000;

dotenv.config();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',  // OpenAPI version
    info: {
      title: 'Book Management API',
      version: '1.0.0',
      description: 'This is the API documentation for the Book Management system'
    }
  },
  // Path to the API docs (route files where @swagger annotations are present)
  apis: ['./routes/*.js', './controllers/*.js']  // Adjust paths as needed
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJSDoc(swaggerOptions);


// Serve static files from the 'frontend' directory in the root
app.use(express.static(path.join(__dirname, '../frontend')));

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes
const authRoutes = require('../routes/auth.routes');
const bookRoutes = require('../routes/book.routes');
const commentRoutes = require('../routes/comment.routes');
const logRoutes = require('../routes/log.routes');
const authorRoutes = require('../routes/author.routes');

// API Endpoints
app.use('/api/auth', authRoutes);           // For login/register
app.use('/api/books', bookRoutes);          // For book listing, updating, deleting
app.use('/api/comments', commentRoutes);    // For adding and deleting comments
app.use('/api/authors', authorRoutes);      // For author listing
app.use('/api/logs', logRoutes);            // For activity logs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Frontend page routes
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'dashboard.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
