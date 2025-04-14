
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BookAuthors', {
      BookId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Books',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      AuthorId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Authors',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BookAuthors');
  },
};
