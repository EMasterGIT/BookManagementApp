const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

dotenv.config();
const app = express();
const port = 5000;

// CORS
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book Management API',
      version: '1.0.0',
      description: 'API documentation'
    }
  },
  apis: ['./routes/*.js', './controllers/*.js']
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Static
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/auth', require('../routes/auth.routes'));
app.use('/api/books', require('../routes/book.routes'));
app.use('/api/comments', require('../routes/comment.routes'));
app.use('/api/authors', require('../routes/author.routes'));
app.use('/api/categories', require('../routes/category.routes'));
app.use('/api/logs', require('../routes/log.routes'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
