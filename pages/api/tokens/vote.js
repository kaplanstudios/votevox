import fs from 'fs/promises';
import path from 'path';

const TOKENS_FILE = path.join(process.cwd(), 'data', 'tokens.json');
const POLLS_FILE = path.join(process.cwd(), 'data', 'polls.json');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, pollId, optionId, amount } = req.body;

    try {
      const tokens = JSON.parse(await fs.readFile(TOKENS_FILE, 'utf8'));
      const polls = JSON.parse(await fs.readFile(POLLS_FILE, 'utf8'));

      if (tokens[userId] < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      const poll = polls.find(p => p.id === pollId);
      if (!poll) {
        return res.status(404).json({ error: 'Poll not found' });
      }

      const option = poll.options.find(opt => opt.id === optionId);
      if (!option) {
        return res.status(400).json({ error: 'Invalid option ID' });
      }

      tokens[userId] -= amount;
      option.votes += 1;
      option.tokenPool = (option.tokenPool || 0) + amount;

      await fs.writeFile(TOKENS_FILE, JSON.stringify(tokens, null, 2));
      await fs.writeFile(POLLS_FILE, JSON.stringify(polls, null, 2));

      res.status(200).json({ balance: tokens[userId], poll });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update tokens or polls file' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}