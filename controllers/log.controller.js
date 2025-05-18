// controllers/log.controller.js
const { Log, User } = require('../src/models');
const { logAction } = require('../utils/logger')

// Kasutab logAction funktsiooni, et luua logi
const createLog = async (userId, action, details) => {
  try {
    // Kutsubi logAction funktsioon
    await logAction(action, userId, details); 
    console.log('Log created');
  } catch (error) {
    console.error('Log error:', error);
  }
};


const getLogs = async (_, res) => {
  try {
    const logs = await Log.findAll({
      include: [{ model: User, attributes: ['username'] }],
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(logs);
  } catch (error) {
    return res.status(500).json({ message: 'Getting logs failed', error });
  }
};


module.exports = { createLog, getLogs };
