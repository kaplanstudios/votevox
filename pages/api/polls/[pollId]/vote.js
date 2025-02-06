import pollsData from "../../../../data/polls.json"; // Updated path to polls.json

export default function handler(req, res) {
  const { pollId } = req.query; // Get the pollId from the URL

  // Ensure the correct method is used
  if (req.method === "POST") {
    const { userId, optionId } = req.body; // Get the userId and optionId from the request body

    // Find the poll by pollId
    const poll = pollsData.find((p) => p.id === pollId);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // Find the option by optionId within the poll
    const option = poll.options.find((opt) => opt.id === optionId);

    if (!option) {
      return res.status(404).json({ message: "Option not found" });
    }

    // Add the vote for this option (assuming you're storing votes as userId)
    option.votes.push({
      userId,
      vote: 1, // Assume the vote is 1 (positive)
    });

    // Return the updated poll or a success message
    return res.status(200).json({ message: "Vote submitted successfully" });
  } else {
    res.status(405).json({ message: "Method Not Allowed" }); // Only POST requests are allowed
  }
}
