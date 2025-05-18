// routes/category.routes.js
const { Category } = require('../src/models');

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllCategories
};