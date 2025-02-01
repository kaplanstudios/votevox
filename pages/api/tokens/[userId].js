// /pages/api/ranks/[userId].js
import fs from 'fs';
import path from 'path';

const ranksFilePath = path.join(process.cwd(), 'data', 'ranks.json');

export default function handler(req, res) {
  const { userId } = req.query; // Extract userId from query params

  try {
    // Read ranks.json file to fetch the data
    const fileData = fs.readFileSync(ranksFilePath, 'utf-8');
    const ranks = JSON.parse(fileData);

    // Find the user's rank data using the userId
    const userVotes = ranks.find((rank) => rank.userId === userId);

    if (userVotes) {
      // Respond with the user's votes
      res.status(200).json(userVotes.votes);
    } else {
      // If no data for the userId, send an error message
      res.status(404).json({ error: 'User votes not found' });
    }
  } catch (error) {
    // Handle errors in reading or parsing ranks.json
    res.status(500).json({ error: 'Internal server error' });
  }
}
