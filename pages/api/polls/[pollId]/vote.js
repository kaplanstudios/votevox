import fs from 'fs/promises';
import path from 'path';

const POLLS_FILE = path.join(process.cwd(), 'data', 'polls.json');
const VOTES_FILE = path.join(process.cwd(), 'data', 'votes.json');

export default async function handler(req, res) {
  const { pollId } = req.query;

  try {
    const polls = JSON.parse(await fs.readFile(POLLS_FILE, 'utf8'));
    const pollIndex = polls.findIndex(p => p.id === pollId);

    if (pollIndex === -1) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    switch (req.method) {
      case 'GET':
        return handleGet(req, res, pollId);
      case 'POST':
        return handlePost(req, res, polls, pollIndex);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Vote error:', error);
    return res.status(500).json({ 
      error: 'Failed to process vote',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
}

async function handleGet(req, res, pollId) {
  const votes = JSON.parse(await fs.readFile(VOTES_FILE, 'utf8'));
  const vote = votes.find(v => v.pollId === pollId);

  if (!vote) {
    return res.status(404).json({ error: 'Vote not found' });
  }

  return res.status(200).json(vote);
}

async function handlePost(req, res, polls, pollIndex) {
  const { optionId, signature, uuid, timestamp } = req.body;
  const option = polls[pollIndex].options.find(opt => opt.id === optionId);

  if (!option) {
    return res.status(400).json({ error: 'Invalid option ID' });
  }

  option.votes += 1;

  await fs.writeFile(POLLS_FILE, JSON.stringify(polls, null, 2));

  // Save the signature to the data/signatures folder
  const signaturePath = path.join(process.cwd(), 'data', 'signatures', `${uuid}.png`);
  const base64Data = signature.replace(/^data:image\/png;base64,/, '');
  await fs.writeFile(signaturePath, base64Data, 'base64');

  // Save the vote data to votes.json
  const votes = JSON.parse(await fs.readFile(VOTES_FILE, 'utf8'));
  votes.push({ pollId, optionId, signaturePath, uuid, timestamp });
  await fs.writeFile(VOTES_FILE, JSON.stringify(votes, null, 2));

  return res.status(200).json({ message: 'Vote saved successfully', uuid });
}