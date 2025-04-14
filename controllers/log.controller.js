// controllers/log.controller.js
const { Log } = require('../src/models');
const { logAction } = require('../utils/logger') // make sure this is calling the logger factory properly

// Kasutaja tegevuse logimine
const createLog = async (userId, action, details) => {
  try {
    // Calling logAction here
    await logAction(action, userId, details); // use logAction to log activity
    console.log('Log created');
  } catch (error) {
    console.error('Logimise viga:', error);
  }
};

// Logide vaatamine
const getLogs = async (req, res) => {
  try {
    const logs = await Log.findAll();
    return res.status(200).json(logs);
  } catch (error) {
    return res.status(500).json({ message: 'Logide laadimine ebaõnnestus', error });
  }
};

module.exports = { createLog, getLogs };
