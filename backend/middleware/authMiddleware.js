const jwt = require('jsonwebtoken');
const token = jwt.sign({ id: 'USER_ID' }, 'your_jwt_secret', { expiresIn: '1h' });


const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ status: "error", message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Normalize user object to always have `id`
    req.user = {
      id: decoded.id || decoded.userId || decoded._id, // support different token formats
      ...decoded
    };

    next();
  } catch (error) {
    res.status(400).json({ status: "error", message: "Invalid token." });
  }
};

module.exports = authenticateToken;
