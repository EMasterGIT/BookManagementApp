module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  Comment.associate = models => {
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'User',
    });

    Comment.belongsTo(models.Book, {
      foreignKey: 'bookId',
      as: 'Book',
    });
  };

  return Comment;
};
