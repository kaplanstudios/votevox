import pollsData from '../../../data/polls.json';

export default function handler(req, res) {
  const { pollId } = req.query;

  if (req.method === 'GET') {
    const poll = pollsData.find(p => p.id === pollId);

    if (poll) {
      res.status(200).json(poll);
    } else {
      res.status(404).json({ error: 'Poll not found' });
    }
  } else if (req.method === 'PUT') {
    // Handle PUT request to update the poll
    const pollIndex = pollsData.findIndex(p => p.id === pollId);
    if (pollIndex === -1) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Update the poll with the new vote data
    pollsData[pollIndex] = { ...pollsData[pollIndex], ...req.body };

    // Optionally, save the updated data back to a database/file here
    // For now, let's just return the updated poll
    res.status(200).json(pollsData[pollIndex]);
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
