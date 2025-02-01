// pages/pollingapp.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import styles from '../styles/PollingApp.module.css';

export default function PollingApp() {
  const { data: session, status } = useSession();
  const [polls, setPolls] = useState([]);
  const [ranks, setRanks] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/signin');
    else fetchPollsAndRanks();
  }, [session, status]);

  const fetchPollsAndRanks = async () => {
    try {
      const pollResponse = await fetch('/api/polls');
      const pollsData = await pollResponse.json();
      setPolls(pollsData);

      const rankResponse = await fetch(`/api/ranks?userId=${session.user.id}`);
      const ranksData = await rankResponse.json();
      setRanks(ranksData);
    } catch {
      setToastMessage('Failed to load polls or ranks.');
    }
  };

  const handleVote = async (pollId, type) => {
    if (!session) {
      setToastMessage('You must be logged in to vote.');
      return;
    }

    if (ranks?.votes?.[pollId] === type) {
      setToastMessage(`You already ${type === 1 ? 'upvoted' : 'downvoted'} this poll.`);
      return;
    }

    try {
      const response = await fetch(`/api/polls/${pollId}/vote`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id, voteType: type }),
      });

      const updatedPoll = await response.json();
      setRanks(prev => ({ ...prev, votes: { ...prev.votes, [pollId]: type } }));
      setPolls(prev => prev.map(poll => (poll.id === pollId ? updatedPoll : poll)));
      setToastMessage('Vote recorded!');
    } catch {
      setToastMessage('Error submitting vote.');
    }
  };

  return (
    <div className={styles.pollingAppContainer}>
      <nav className={styles.navbar}>Polling App</nav>
      <div className={styles.pollsContainer}>
        <h1 className="text-4xl font-bold text-center">Current Polls</h1>
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
        {polls.map(poll => (
          <Card key={poll.id} className={styles.pollCard}>
            <h2 className="text-xl font-bold">{poll.title}</h2>
            <p>{poll.description}</p>
            <div className={styles.voteContainer}>
              <FaThumbsUp className={ranks?.votes?.[poll.id] === 1 ? styles.active : styles.inactive} onClick={() => handleVote(poll.id, 1)} />
              <span>{poll.upvotes}</span>
              <FaThumbsDown className={ranks?.votes?.[poll.id] === -1 ? styles.active : styles.inactive} onClick={() => handleVote(poll.id, -1)} />
              <span>{poll.downvotes}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
