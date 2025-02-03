import fs from 'fs';
import path from 'path';

const ranksFilePath = path.join(process.cwd(), 'data', 'ranks.json');

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { pollId, userId, vote } = req.body;

    if (vote !== 1 && vote !== -1 && vote !== null) {
      return res.status(400).json({ error: 'Invalid vote value' });
    }

    try {
      const data = JSON.parse(fs.readFileSync(ranksFilePath, 'utf-8'));
      let poll = data.find(p => p.pollId === pollId);

      if (!poll) {
        poll = { pollId, votes: {} };
        data.push(poll);
      }

      if (vote === null) {
        delete poll.votes[userId]; // Remove vote
      } else {
        poll.votes[userId] = vote; // Add or update vote
      }

      fs.writeFileSync(ranksFilePath, JSON.stringify(data, null, 2));
      res.status(200).json(poll);
    } catch (error) {
      console.error('Failed to process vote:', error);
      res.status(500).json({ error: 'Failed to process vote', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}