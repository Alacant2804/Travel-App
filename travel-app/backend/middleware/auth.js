import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

function auth(req, res, next) {
  const token = req.header('x-auth-token');
  console.log("Token middleware: ", token)
  
  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    console.log('Authenticated user:', req.user);
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

export default auth;