import fs from 'fs/promises';
import path from 'path';

const POLLS_FILE = path.join(process.cwd(), 'data', 'polls.json');

export default async function handler(req, res) {
  const { pollId } = req.query;

  try {
    const polls = JSON.parse(await fs.readFile(POLLS_FILE, 'utf8'));
    const poll = polls.find(p => p.id === pollId);

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    switch (req.method) {
      case 'GET':
        return res.status(200).json(poll);
      case 'POST':
        return handleVote(req, res, polls, poll);
      case 'PUT':
        return handleUpdate(req, res, polls, poll);
      case 'DELETE':
        return handleDelete(req, res, polls, poll);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to read polls file' });
  }
}

async function handleVote(req, res, polls, poll) {
  const { optionId, signature, uuid, timestamp } = req.body;

  const option = poll.options.find(opt => opt.id === optionId);
  if (!option) {
    return res.status(400).json({ error: 'Invalid option ID' });
  }

  option.votes += 1;

  const updatedPolls = polls.map(p => (p.id === poll.id ? poll : p));
  await fs.writeFile(POLLS_FILE, JSON.stringify(updatedPolls, null, 2));

  return res.status(200).json({ message: 'Vote saved successfully' });
}

async function handleUpdate(req, res, polls, poll) {
  const updatedPoll = { ...poll, ...req.body };
  const updatedPolls = polls.map(p => (p.id === poll.id ? updatedPoll : p));
  await fs.writeFile(POLLS_FILE, JSON.stringify(updatedPolls, null, 2));
  return res.status(200).json(updatedPoll);
}

async function handleDelete(req, res, polls, poll) {
  const updatedPolls = polls.filter(p => p.id !== poll.id);
  await fs.writeFile(POLLS_FILE, JSON.stringify(updatedPolls, null, 2));
  return res.status(204).end();
}