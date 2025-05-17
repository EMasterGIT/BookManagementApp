module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publicationYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    timestamps: true 
  });

  Book.associate = models => {
    Book.belongsToMany(models.Author, {
      through: 'BookAuthors',
      as: 'Authors',
      foreignKey: 'bookId',
      otherKey: 'authorId'
    });
  
    Book.hasMany(models.Comment, {
      foreignKey: 'bookId',
      as: 'Comments',
    });
  
    Book.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'Category'
    });
  };
  



  return Book;
};
