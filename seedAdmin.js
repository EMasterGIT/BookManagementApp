const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const config = require(path.join(__dirname, 'config', 'config.js'))[process.env.NODE_ENV || 'development'];

// Loo ühendus
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Defineeri kasutaja mudel
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
  },
});

const seedAdminUser = async () => {
  try {
    // Kontrolli andmebaasi ühendust
    await sequelize.authenticate();
    console.log('Andmebaasiga ühendus loodud!');

    // Sünkroonige mudelid, kuid ärge kustutage andmeid
    await sequelize.sync({ force: false });

    // Kontrollige, kas admin kasutaja on juba olemas
    const existingAdmin = await User.findOne({ where: { username: 'admin' } });
    if (existingAdmin) {
      console.log('Admin kasutaja on juba olemas.');
      process.exit();
    }

    // Turvalise parooli loomine
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Loo admin kasutaja
    await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'Admin',
    });

    console.log('Admin kasutaja loodud: kasutajanimi: admin, parool: admin123');
    process.exit();
  } catch (error) {
    console.error('Viga admini loomisel:', error);
    process.exit(1);
  }
};

seedAdminUser();
