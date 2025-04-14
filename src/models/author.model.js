module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define('Author', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Author.associate = models => {
    Author.belongsToMany(models.Book, {
      through: 'BookAuthors',
      as: 'Books',
      foreignKey: 'authorId',
      otherKey: 'bookId'
    });
  };

  return Author;
};