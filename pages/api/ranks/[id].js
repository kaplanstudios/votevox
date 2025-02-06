// pages/api/ranks/[id].js

import fs from 'fs';
import path from 'path';

const ranksFilePath = path.resolve('data/ranks.json');

export default async function handler(req, res) {
  const { id } = req.query; // Get the pollId from the URL

  if (req.method === 'POST') {
    try {
      // Get the updated votes data from the request body
      const { updatedVotes } = req.body;

      if (!updatedVotes) {
        return res.status(400).json({ error: 'No updated votes data provided' });
      }

      // Read the current ranks data from the file
      const ranksData = JSON.parse(fs.readFileSync(ranksFilePath, 'utf-8'));

      // Find the rank for the given pollId
      const rankIndex = ranksData.findIndex((rank) => rank.pollId === id);

      if (rankIndex === -1) {
        return res.status(404).json({ error: 'Poll not found' });
      }

      // Update the votes for the specific pollId
      ranksData[rankIndex].votes = updatedVotes;

      // Write the updated ranks data back to the file
      fs.writeFileSync(ranksFilePath, JSON.stringify(ranksData, null, 2));

      // Respond with a success message
      res.status(200).json({ message: 'Votes updated successfully' });
    } catch (error) {
      console.error('Error saving ranks data:', error);
      res.status(500).json({ error: 'Failed to save ranks data' });
    }
  } else {
    // If the method is not POST, return Method Not Allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
