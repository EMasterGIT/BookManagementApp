const winston = require('winston');
const { Log } = require('../src/models');
const path = require('path');

// Kohandatud logimise formaat
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Loo winston logger faililogimiseks kohandatud formaadiga
const fileLogger = winston.createLogger({
  level: 'info',  // Logimise tase, mida salvestada
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Ajatempli formaat
    customFormat // Kohandatud logisõnumi formaat
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../docs/app.log'),
      level: 'info',
    }),
    new winston.transports.Console()  // Valikuline: logi ka konsooli
  ],
});



// Logimine andmebaasi
module.exports.logAction = async (action, userId, description) => {
  try {
    console.log('Logimine andmebaasi:', { action, userId, description }); // Silumisrida
    await Log.create({ action, userId, description });

    // Logisõnum faili
    const message = `Tegevus: ${action}, Kasutaja: ${userId}, Kirjeldus: ${description}`;
    fileLogger.info(message); // Logi faili kohandatud formaadiga
  } catch (error) {
    console.error('Viga tegevuse logimisel:', error);
  }
};

module.exports.logLogin = async (userId) => {
  try {
    const action = 'USER_LOGIN';
    const description = `User with ID ${userId} logged in`;
    await this.logAction(action, userId, description);
  } catch (error) {
    console.error('Error logging login action:', error);
  }
};

// Function to log user registration
module.exports.logRegistration = async (userId) => {
  try {
    const action = 'USER_REGISTRATION';
    const description = `User with ID ${userId} registered`;
    await this.logAction(action, userId, description);
  } catch (error) {
    console.error('Error logging registration action:', error);
  }
};