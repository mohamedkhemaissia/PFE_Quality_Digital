const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

const verifyRole = (rolesAutorises) => {
  return (req, res, next) => {
    if (!rolesAutorises.includes(req.userRole)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    next();
  };
};

module.exports = { verifyToken, verifyRole };
