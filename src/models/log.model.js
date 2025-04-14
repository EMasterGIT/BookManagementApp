// models/log.js
module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define('Log', {
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: { // Change from `details` to `description`
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'Logs',
    timestamps: true
  });

  Log.associate = (models) => {
    Log.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Log;
};
