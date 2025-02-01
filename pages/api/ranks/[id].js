// /pages/api/ranks/[id].js
export default function handler(req, res) {
    const { id } = req.query;
  
    // Simulated rank data for demo
    const ranks = {
      '1': { upvotes: 10, downvotes: 2, userVotes: ['1', '2'] },
      '2': { upvotes: 5, downvotes: 1, userVotes: ['1'] },
    };
  
    const userRank = ranks[id];
  
    if (userRank) {
      res.status(200).json(userRank);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  }
  