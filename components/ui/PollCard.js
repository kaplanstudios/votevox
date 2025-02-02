import { useState } from 'react';
import { useSession } from 'next-auth/react';

function PollCard({ poll }) {
  const [rank, setRank] = useState(null);
  const { data: session, status } = useSession();

  const handleUpvote = async () => {
    if (status === 'unauthenticated') {
      alert('You must be logged in to upvote');
      return;
    }

    const response = await fetch('/api/ranks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pollId: poll.id,
        rank: 1,
      }),
    });

    if (response.ok) {
      setRank(1);
    }
  };

  const handleDownvote = async () => {
    if (status === 'unauthenticated') {
      alert('You must be logged in to downvote');
      return;
    }

    const response = await fetch('/api/ranks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pollId: poll.id,
        rank: -1,
      }),
    });

    if (response.ok) {
      setRank(-1);
    }
  };

  return (
    <div>
      <h2>{poll.title}</h2>
      <p>{poll.description}</p>
      <button onClick={handleUpvote}>Upvote</button>
      <button onClick={handleDownvote}>Downvote</button>
      {rank !== null && <p>Rank: {rank}</p>}
    </div>
  );
}

export default PollCard;