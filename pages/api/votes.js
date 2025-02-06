import fs from 'fs';
import path from 'path';

const votesFilePath = path.join(process.cwd(), 'data/votes.json');
const signaturesFolderPath = path.join(process.cwd(), 'data/signatures');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const voteData = req.body;

    // Read existing votes from file
    const existingVotes = JSON.parse(fs.readFileSync(votesFilePath, 'utf8'));

    // Save the new vote
    existingVotes.push(voteData);

    // Write updated votes data back to file
    fs.writeFileSync(votesFilePath, JSON.stringify(existingVotes, null, 2));

    res.status(200).json({ message: 'Vote saved successfully' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
