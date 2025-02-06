import fs from 'fs';
import path from 'path';

const ranksFilePath = path.join(process.cwd(), 'data', 'ranks.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { pollId, userId, vote } = req.body;
  
  // Validate the vote: allowed values are 1 (upvote), -1 (downvote), or null (remove vote)
  if (vote !== 1 && vote !== -1 && vote !== null) {
    console.error(`Invalid vote value received: ${vote}`);
    return res.status(400).json({ error: 'Invalid vote value' });
  }
  
  try {
    // Ensure the ranks.json file exists; if not, create it as an empty array.
    if (!fs.existsSync(ranksFilePath)) {
      fs.writeFileSync(ranksFilePath, JSON.stringify([]));
      console.log("Created new ranks.json file because it did not exist.");
    }
    
    // Read the current data from ranks.json.
    const fileContent = fs.readFileSync(ranksFilePath, 'utf8');
    let data = [];
    try {
      data = JSON.parse(fileContent);
    } catch (parseErr) {
      console.error("Error parsing ranks.json:", parseErr);
      data = [];
    }
    
    console.log("Current ranks data:", JSON.stringify(data, null, 2));
    
    // Find the poll entry for the given pollId.
    let pollEntry = data.find(entry => entry.pollId === pollId);
    
    if (!pollEntry) {
      // No entry exists for this poll.
      if (vote !== null) {
        pollEntry = { pollId, votes: [{ userId, vote }] };
        data.push(pollEntry);
        console.log(`Created new poll entry for pollId "${pollId}" with vote ${vote} from user "${userId}".`);
      } else {
        console.log(`No poll entry for pollId "${pollId}" and vote is null; nothing to update.`);
        return res.status(200).json({ pollId, votes: [] });
      }
    } else {
      // Entry exists; update it.
      const voteIndex = pollEntry.votes.findIndex(v => v.userId === userId);
      if (voteIndex !== -1) {
        if (vote === null) {
          // Remove the vote.
          pollEntry.votes.splice(voteIndex, 1);
          console.log(`Removed vote for user "${userId}" from pollId "${pollId}".`);
        } else {
          // Update the vote.
          pollEntry.votes[voteIndex].vote = vote;
          console.log(`Updated vote for user "${userId}" in pollId "${pollId}" to ${vote}.`);
        }
      } else {
        if (vote !== null) {
          pollEntry.votes.push({ userId, vote });
          console.log(`Added new vote for user "${userId}" in pollId "${pollId}" with vote ${vote}.`);
        } else {
          console.log(`Vote is null and user "${userId}" has no vote in pollId "${pollId}"; nothing to remove.`);
        }
      }
    }
    
    // Write the updated data back to ranks.json.
    fs.writeFileSync(ranksFilePath, JSON.stringify(data, null, 2));
    console.log("Updated ranks data written to file:", JSON.stringify(data, null, 2));
    
    // Return the updated poll entry.
    const updatedEntry = data.find(entry => entry.pollId === pollId) || { pollId, votes: [] };
    return res.status(200).json(updatedEntry);
    
  } catch (error) {
    console.error("Error processing vote:", error);
    return res.status(500).json({ error: 'Failed to process vote', details: error.message });
  }
}
