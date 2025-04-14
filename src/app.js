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
  // API docs
  apis: ['./routes/*.js', './controllers/*.js'] 
};

// swagger-jsdoc
const swaggerDocs = swaggerJSDoc(swaggerOptions);


// Staatilised failid
app.use(express.static(path.join(__dirname, '../frontend')));

// CORS
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
app.use('/api/auth', authRoutes);           // login/register
app.use('/api/books', bookRoutes);          // Raamatute CRUD
app.use('/api/comments', commentRoutes);    // Kommentide CRUD
app.use('/api/authors', authorRoutes);      // Autorite CRUD
app.use('/api/logs', logRoutes);            // Logid
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Frontend lehed
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
