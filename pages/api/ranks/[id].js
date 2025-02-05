import fs from 'fs';
import path from 'path';

const ranksFilePath = path.join(process.cwd(), 'data', 'ranks.json');

const handler = async (req, res) => {
  const pollId = req.query.id;

  if (req.method === 'GET') {
    try {
      const data = JSON.parse(fs.readFileSync(ranksFilePath, 'utf-8'));
      const poll = data.find(p => p.pollId === pollId);
      if (!poll) {
        return res.status(404).json({ error: 'Poll not found' });
      }

      // Calculate upvotes and downvotes based on user votes
      const upvotes = poll.votes.filter(vote => vote.vote === 1).length;
      const downvotes = poll.votes.filter(vote => vote.vote === -1).length;

      res.status(200).json({ votes: poll.votes, upvotes, downvotes });
    } catch (error) {
      console.error('Failed to retrieve poll:', error);
      res.status(500).json({ error: 'Failed to retrieve poll', details: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { userId, vote } = req.body;
      if (vote !== 1 && vote !== -1 && vote !== null) {
        return res.status(400).json({ error: 'Invalid vote value' });
      }

      const data = JSON.parse(fs.readFileSync(ranksFilePath, 'utf-8'));
      let poll = data.find(p => p.pollId === pollId);

      if (!poll) {
        poll = { pollId, votes: [] };
        data.push(poll);
      }

      // Update or remove the user's vote
      const existingVoteIndex = poll.votes.findIndex(v => v.userId === userId);
      if (existingVoteIndex > -1) {
        // Update existing vote
        if (vote === null) {
          poll.votes.splice(existingVoteIndex, 1); // Remove vote
        } else {
          poll.votes[existingVoteIndex].vote = vote; // Update vote
        }
      } else if (vote !== null) {
        // Add new vote
        poll.votes.push({ userId, vote });
      }

      fs.writeFileSync(ranksFilePath, JSON.stringify(data, null, 2));
      res.status(200).json({ message: 'Vote updated successfully', votes: poll.votes });
    } catch (error) {
      console.error('Error updating vote:', error);
      res.status(500).json({ error: 'Failed to update vote', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default handler;
