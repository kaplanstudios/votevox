import fs from 'fs/promises';
import path from 'path';

const POLLS_FILE = path.join(process.cwd(), 'data', 'polls.json');
const TOKENS_FILE = path.join(process.cwd(), 'data', 'tokens.json');

export default async function handler(req, res) {
  const { pollid } = req.query;

  try {
    const polls = JSON.parse(await fs.readFile(POLLS_FILE, 'utf8'));
    const poll = polls.find(p => p.id === pollid);

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    switch (req.method) {
      case 'GET':
        return res.status(200).json(poll);
      case 'POST':
        return handleVote(req, res, polls, poll);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to read polls file' });
  }
}

async function handleVote(req, res, polls, poll) {
  const { userId, optionId, tokens } = req.body;

  const option = poll.options.find(opt => opt.id === optionId);
  if (!option) {
    return res.status(400).json({ error: 'Invalid option ID' });
  }

  try {
    const tokensData = JSON.parse(await fs.readFile(TOKENS_FILE, 'utf8'));

    if (tokensData[userId] < tokens) {
      return res.status(400).json({ error: 'Insufficient tokens' });
    }

    tokensData[userId] -= tokens;
    poll.tokenPool = (poll.tokenPool || 0) + tokens;
    option.votes += 1;

    const updatedPolls = polls.map(p => (p.id === poll.id ? poll : p));
    await fs.writeFile(POLLS_FILE, JSON.stringify(updatedPolls, null, 2));
    await fs.writeFile(TOKENS_FILE, JSON.stringify(tokensData, null, 2));

    return res.status(200).json({ message: 'Vote saved successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save vote' });
  }
}