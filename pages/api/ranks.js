import ranksData from '../../../data/ranks.json';
import pollsData from '../../../data/polls.json';
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { id } = req.query; // Poll ID passed in the URL

  if (req.method === 'POST') {
    const poll = pollsData.find(p => p.id === id); // Find the poll by its ID
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    const { userId, vote } = req.body; // Get userId and vote from the request body

    // Find the ranks entry for the pollId
    let pollRanks = ranksData.find(r => r.pollId === id);

    // If the poll has no existing ranks, create a new entry
    if (!pollRanks) {
      pollRanks = {
        pollId: id,
        votes: []
      };
      ranksData.push(pollRanks);
    }

    // Check if the user has already voted
    const existingVote = pollRanks.votes.find(v => v.userId === userId);

    if (existingVote) {
      if (vote === null) {
        // If the user removed their vote, delete it from the array
        pollRanks.votes = pollRanks.votes.filter(v => v.userId !== userId);
      } else {
        // If the user changes their vote, update it
        existingVote.vote = vote;
      }
    } else {
      // If the user hasn't voted yet, add their vote
      if (vote !== null) {
        pollRanks.votes.push({ userId, vote });
      }
    }

    // Persist the updated ranks data back to the file
    const filePath = path.join(process.cwd(), 'data', 'ranks.json');
    fs.writeFileSync(filePath, JSON.stringify(ranksData, null, 2));

    res.status(200).json({ message: 'Vote recorded successfully' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
