import fs from 'fs';
import path from 'path';

// Helper function to get ranks (votes) for a user
const ranksFilePath = path.join(process.cwd(), 'data', 'ranks.json');

export default function handler(req, res) {
  const { userId } = req.query; // Extract userId from query parameter

  // Read the ranks data
  const fileData = fs.readFileSync(ranksFilePath, 'utf-8');
  const ranks = JSON.parse(fileData);

  // Find the user's voting data
  const userVotes = ranks.find((rank) => rank.userId === userId);

  if (userVotes) {
    res.status(200).json(userVotes.votes); // Return the user's vote data
  } else {
    res.status(404).json({ error: 'User votes not found' });
  }
}
