import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import votesData from '../../../../data/votes.json';

const SIGNATURES_DIR = path.join(process.cwd(), 'data', 'signatures');
const VOTES_FILE_PATH = path.join(process.cwd(), 'data', 'votes.json');

export default async function handler(req, res) {
  const { pollId } = req.query;

  if (req.method === 'POST') {
    try {
      const { selectedOption, signature, userId } = req.body;

      if (!selectedOption || !pollId || !userId) {
        return res.status(400).json({ error: 'Poll ID, selected option, or user ID missing' });
      }

      // Find or initialize poll votes
      let existingVotes = votesData.find(vote => vote.pollId === pollId);
      if (!existingVotes) {
        existingVotes = { pollId, votes: [] };
        votesData.push(existingVotes);
      }

      // Save signature if provided
      let savedSignaturePath = null;
      if (signature) {
        const signatureId = uuidv4();
        const signatureFilePath = path.join(SIGNATURES_DIR, `${signatureId}.png`);
        const base64Data = signature.replace(/^data:image\/png;base64,/, '');

        await fs.mkdir(SIGNATURES_DIR, { recursive: true });
        await fs.writeFile(signatureFilePath, base64Data, 'base64');
        savedSignaturePath = `/data/signatures/${signatureId}.png`;
      }

      // Add new vote
      const newVote = { userId, selectedOption, signaturePath: savedSignaturePath };
      existingVotes.votes.push(newVote);

      // Save updated votes data
      await fs.writeFile(VOTES_FILE_PATH, JSON.stringify(votesData, null, 2));

      return res.status(200).json({ message: 'Vote submitted successfully' });
    } catch (error) {
      console.error('Error submitting vote:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
