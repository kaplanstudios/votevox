import fs from 'fs/promises';
import path from 'path';

const TOKENS_FILE = path.join(process.cwd(), 'data', 'tokens.json');

export default async function handler(req, res) {
  const { userId } = req.query;

  try {
    const tokens = JSON.parse(await fs.readFile(TOKENS_FILE, 'utf8'));
    const balance = tokens[userId] || 0;
    res.status(200).json({ balance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read tokens file' });
  }
}