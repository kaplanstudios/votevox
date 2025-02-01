import fs from 'fs/promises';
import path from 'path';

const TOKENS_FILE = path.join(process.cwd(), 'data', 'tokens.json');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, amount } = req.body;

    try {
      const tokens = JSON.parse(await fs.readFile(TOKENS_FILE, 'utf8'));
      tokens[userId] = (tokens[userId] || 0) + amount;
      await fs.writeFile(TOKENS_FILE, JSON.stringify(tokens, null, 2));
      res.status(200).json({ balance: tokens[userId] });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update tokens file' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}