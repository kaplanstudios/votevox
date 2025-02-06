import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../../styles/Vote.module.css';

export default function Vote() {
  const [poll, setPoll] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const { pollid } = router.query;

  useEffect(() => {
    if (pollid) {
      fetchPoll();
    }
  }, [pollid]);

  const fetchPoll = async () => {
    try {
      const response = await fetch(`/api/polls/${pollid}`);  // Correct API path
      if (!response.ok) {
        throw new Error('Failed to fetch poll');
      }
      const data = await response.json();
      setPoll(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVote = async (optionId) => {
    try {
      const userId = 'user1'; // Replace this with the actual user ID (from session or context)
      const response = await fetch(`/api/polls/${pollid}/vote`, {  // Correct API path for vote submission
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, optionId }), // Sending userId and optionId to the server
      });

      if (!response.ok) {
        throw new Error('Failed to vote');
      }

      const data = await response.json();
      console.log(data.message); // Success message from the API
      fetchPoll(); // Refresh the poll data after the vote
    } catch (err) {
      setError(err.message);
    }
  };

  if (!poll) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{poll.title}</h1>
      <p className={styles.description}>{poll.description}</p>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.options}>
        {poll.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleVote(option.id)}
            className={styles.option}
          >
            {option.text} ({option.votes})
          </button>
        ))}
      </div>
    </div>
  );
}
