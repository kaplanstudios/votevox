import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your-secret-key';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { token } = req.body;

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      res.status(200).json({ valid: true, user: decoded });
    } catch {
      res.status(401).json({ valid: false });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
