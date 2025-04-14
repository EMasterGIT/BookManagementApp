module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('Admin', 'User'),
      allowNull: false,
      defaultValue: 'User'
    }
  }, {
    tableName: 'Users'
  });

  User.associate = (models) => {
    User.hasMany(models.Comment, { foreignKey: 'userId' });
    User.hasMany(models.Log, { foreignKey: 'userId' });
  };

  return User;
};
