const winston = require('winston');
const { Log } = require('../src/models');
const path = require('path');

// Custom log format
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Winston logger
const fileLogger = winston.createLogger({
  level: 'info',  
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Timestamp format
    customFormat // Custom log format
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../docs/app.log'),
      level: 'info',
    }),
    new winston.transports.Console()
  ],
});



// Logging function
module.exports.logAction = async (action, userId, description) => {
  try {
    console.log('Logimine andmebaasi:', { action, userId, description }); // Console logging
    await Log.create({ action, userId, description });

    // Logisõnum faili
    const message = `Tegevus: ${action}, Kasutaja: ${userId}, Kirjeldus: ${description}`;
    fileLogger.info(message); // Custom log format
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