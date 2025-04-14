module.exports = (sequelize, DataTypes) => {
  const BookAuthor = sequelize.define('BookAuthor', {
    bookId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Books',
        key: 'id',
      },
    },
    authorId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Authors',
        key: 'id',
      },
    },
  });

  return BookAuthor;
};
