// middleware/authenticateToken.js
import jwt from 'jsonwebtoken';

 const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('JWT error:', err);
      return res.sendStatus(403); // Invalid token
    }

    req.user = user;
    next();
  });
};

export default authenticateToken;