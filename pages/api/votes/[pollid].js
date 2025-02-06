import { readFileSync, writeFileSync } from "fs";
import path from "path";

const ranksFilePath = path.resolve("data", "ranks.json");
const pollsFilePath = path.resolve("data", "polls.json");

export default function handler(req, res) {
  const { pollId } = req.query;
  const { userId, vote } = req.body;

  // Load current poll data
  const pollsData = JSON.parse(readFileSync(pollsFilePath, "utf8"));
  const ranksData = JSON.parse(readFileSync(ranksFilePath, "utf8"));

  // Find the poll by pollId
  const poll = pollsData.find((p) => p.id === pollId);
  if (!poll) {
    return res.status(404).json({ error: "Poll not found" });
  }

  // Find the existing votes for the poll
  const pollVotes = ranksData.find((r) => r.pollId === pollId);

  // If no votes are found for the poll, initialize an empty array
  if (!pollVotes) {
    ranksData.push({ pollId, votes: [] });
  }

  // Check if the user has already voted
  const existingVote = pollVotes ? pollVotes.votes.find((v) => v.userId === userId) : null;

  if (existingVote) {
    // If user already voted, update their vote
    existingVote.vote = vote;
  } else {
    // If user hasn't voted, add their vote
    ranksData.push({
      pollId,
      votes: [
        ...(pollVotes ? pollVotes.votes : []),
        { userId, vote }
      ]
    });
  }

  // Write updated votes back to file
  writeFileSync(ranksFilePath, JSON.stringify(ranksData, null, 2), "utf8");

  // Respond with the updated vote data
  return res.status(200).json({
    message: "Vote updated successfully",
    pollId,
    userId,
    vote
  });
}
