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
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
