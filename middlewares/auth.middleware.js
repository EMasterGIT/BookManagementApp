const jwt = require('jsonwebtoken');
const { User } = require('../src/models'); 

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Middleware tokeni kontrollimiseks
const authenticateJWT = async (req, res, next) => {
  console.log('Authorization Header:', req.headers.authorization);
  const authHeader = req.headers.authorization;
  

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // Lisa kasutaja objekt päringusse
    next();
  } catch (error) {
    console.error('JWT error:', error.message);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
  
};

// Middleware kasutaja rolli kontrollimiseks
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user && req.user.role; 
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
    next();
    
  };
};

module.exports = {
  authenticateJWT,
  authorizeRole,
};
