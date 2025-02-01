import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  const { pollId, optionId } = req.query;

  try {
    // Read the polls.json file
    const pollsFilePath = path.join(process.cwd(), 'data', 'polls.json');
    const pollsData = await fs.readFile(pollsFilePath, 'utf8');
    const polls = JSON.parse(pollsData);

    // Find the poll by pollId
    const poll = polls.find(p => p.id === pollId);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Read the votes.json file
    const votesFilePath = path.join(process.cwd(), 'data', 'votes.json');
    const votesData = await fs.readFile(votesFilePath, 'utf8');
    const votes = JSON.parse(votesData);

    // Find the vote by optionId and pollId
    const vote = votes.find(v => v.pollId === pollId && v.optionId === optionId);
    if (!vote) {
      return res.status(404).json({ error: 'Vote not found' });
    }

    return res.status(200).json(vote);
  } catch (err) {
    console.error('Error fetching vote data:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}