import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PollCard from '../../components/ui/PollCard';

const EmbedPoll = () => {
  const router = useRouter();
  const { id } = router.query;
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/polls/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setPoll(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching poll:', error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <p>Loading poll...</p>;
  if (!poll) return <p>Poll not found.</p>;

  return (
      <PollCard poll={poll} isActive={false} />

  );
};

const embedStyles = {
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '10px',
    background: '#1e1e1e',
    color: '#ffffff',
    border: '1px solid #444',
    borderRadius: '8px',
  },
};

export default EmbedPoll;
