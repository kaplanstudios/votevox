import fs from 'fs/promises';
import path from 'path';

const TOKENS_FILE = path.join(process.cwd(), 'data', 'tokens.json');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { fromUserId, toUserId, amount } = req.body;

    try {
      const tokens = JSON.parse(await fs.readFile(TOKENS_FILE, 'utf8'));

      if (tokens[fromUserId] < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      tokens[fromUserId] -= amount;
      tokens[toUserId] = (tokens[toUserId] || 0) + amount;

      await fs.writeFile(TOKENS_FILE, JSON.stringify(tokens, null, 2));
      res.status(200).json({ fromBalance: tokens[fromUserId], toBalance: tokens[toUserId] });
    } catch (error) {
      res.status(500).json({ error: 'Failed to trade tokens' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}