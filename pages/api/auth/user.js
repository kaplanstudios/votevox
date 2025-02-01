import { verify } from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Authorization" header

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = verify(token, SECRET_KEY); // Verify token with secret key
    res.status(200).json({ user: { id: decoded.userId } });  // Send user data if token is valid
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
