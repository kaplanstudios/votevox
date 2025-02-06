import fs from 'fs';
import path from 'path';
import pollsData from '../../../../data/polls.json';
import votesData from '../../../../data/votes.json';  // Ensure you import votes.json to save vote data

const votesFilePath = path.join(process.cwd(), 'data', 'votes.json'); // Define path to votes.json

export default function handler(req, res) {
    const { pollId } = req.query;
    const { voteId, userId, selectedOption, signaturePath } = req.body;

    if (req.method === 'POST') {
        if (!pollId) {
            return res.status(400).json({ error: 'Poll ID is required' });
        }

        // Find the poll based on pollId
        const poll = pollsData.find((p) => p.id === pollId);
        
        if (!poll) {
            return res.status(404).json({ error: 'Poll not found' });
        }

        // Find the user's vote in the existing votes array
        let userVote = votesData.find((vote) => vote.pollId === pollId && vote.userId === userId);

        if (userVote) {
            // Update existing vote if the user has already voted
            userVote.selectedOption = selectedOption;
            userVote.signaturePath = signaturePath;
        } else {
            // Add new vote if the user has not voted yet
            votesData.push({
                voteId,
                pollId,
                userId,
                selectedOption,
                signaturePath,
            });
        }

        // Save the updated votes data back to votes.json
        try {
            // Write updated votes data to the votes.json file
            fs.writeFileSync(votesFilePath, JSON.stringify(votesData, null, 2));
            return res.status(200).json({ message: 'Vote successfully submitted' });
        } catch (error) {
            console.error("Error saving vote:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }

    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
