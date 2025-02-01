// pages/api/polls/[id]/vote.js
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Ensure you have installed the uuid package

export default function handler(req, res) {
  if (req.method !== 'PUT') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { id } = req.query; // poll id (a UUID)
  const { userId, voteType, signature } = req.body;

  if (!userId || ![1, -1].includes(voteType)) {
    res.status(400).json({ error: 'Invalid request data' });
    return;
  }

  const pollsFilePath = path.join(process.cwd(), 'data', 'polls.json');
  const votesFilePath = path.join(process.cwd(), 'data', 'votes.json');
  const ranksFilePath = path.join(process.cwd(), 'data', 'ranks.json');

  try {
    // Update polls.json
    const pollsData = fs.readFileSync(pollsFilePath, 'utf-8');
    const polls = JSON.parse(pollsData);
    const pollIndex = polls.findIndex((poll) => poll.id === id);
    if (pollIndex === -1) {
      res.status(404).json({ error: 'Poll not found' });
      return;
    }
    if (voteType === 1) {
      polls[pollIndex].upvotes += 1;
    } else if (voteType === -1) {
      polls[pollIndex].downvotes += 1;
    }
    fs.writeFileSync(pollsFilePath, JSON.stringify(polls, null, 2));

    // Append vote record to votes.json
    const voteRecord = {
      pollId: id,
      userId,
      voteType,
      signature: signature || null,
      uuid: uuidv4(),
      timestamp: new Date().toISOString(),
    };
    let votes = [];
    try {
      const votesData = fs.readFileSync(votesFilePath, 'utf-8');
      votes = JSON.parse(votesData);
    } catch (e) {
      // votes.json might not exist yet
    }
    votes.push(voteRecord);
    fs.writeFileSync(votesFilePath, JSON.stringify(votes, null, 2));

    // Update ranks.json with the user’s vote
    let ranks = [];
    try {
      const ranksData = fs.readFileSync(ranksFilePath, 'utf-8');
      ranks = JSON.parse(ranksData);
    } catch (e) {
      // ranks.json might not exist yet
    }
    const userRankIndex = ranks.findIndex((r) => r.userId === userId);
    if (userRankIndex !== -1) {
      ranks[userRankIndex].votes[id] = voteType;
    } else {
      ranks.push({ userId, votes: { [id]: voteType } });
    }
    fs.writeFileSync(ranksFilePath, JSON.stringify(ranks, null, 2));

    // Return the updated poll record
    res.status(200).json(polls[pollIndex]);
  } catch (error) {
    console.error('Error processing vote:', error);
    res.status(500).json({ error: 'Failed to process vote' });
  }
}
