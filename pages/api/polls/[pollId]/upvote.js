import fs from 'fs/promises';
import path from 'path';

const POLLS_FILE = path.join(process.cwd(), 'data', 'polls.json');

export default async function handler(req, res) {
  const { pollId } = req.query;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const polls = JSON.parse(await fs.readFile(POLLS_FILE, 'utf8'));
    const pollIndex = polls.findIndex(p => p.id === pollId);

    if (pollIndex === -1) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    polls[pollIndex].upvotes++;

    await fs.writeFile(POLLS_FILE, JSON.stringify(polls, null, 2));
    return res.status(200).json(polls[pollIndex]);

  } catch (error) {
    console.error('Vote error:', error);
    return res.status(500).json({ 
      error: 'Failed to process vote',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
}