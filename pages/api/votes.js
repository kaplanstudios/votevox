import fs from 'fs/promises';
import path from 'path';

const VOTES_FILE = path.join(process.cwd(), 'data', 'votes.json');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { pollId, optionId, userId, timestamp, uuid } = req.body;

    try {
      const votes = JSON.parse(await fs.readFile(VOTES_FILE, 'utf8'));
      const newVote = { pollId, optionId, userId, timestamp, uuid };
      votes.push(newVote);
      await fs.writeFile(VOTES_FILE, JSON.stringify(votes, null, 2));
      return res.status(201).json({ message: 'Vote recorded successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to record vote' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}