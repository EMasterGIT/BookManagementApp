module.exports = (sequelize, DataTypes) => {
  const BookAuthor = sequelize.define('BookAuthor', {
    bookId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Books', // Viitab Book mudelile
        key: 'id',
      },
    },
    authorId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Authors', // Viitab Author mudelile
        key: 'id',
      },
    },
  });

  return BookAuthor;
};
