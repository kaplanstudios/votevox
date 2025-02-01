import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/VoteTokens.module.css';

export default function VoteTokens() {
  const [polls, setPolls] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState('');
  const router = useRouter();
  const userId = '90725574-9137-4a91-ae2e-f2db14f04a82'; // Example user ID

  useEffect(() => {
    fetchPolls();
    fetchBalance();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await fetch('/api/polls');
      if (!response.ok) {
        throw new Error('Failed to fetch polls');
      }
      const data = await response.json();
      setPolls(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await fetch(`/api/tokens/balance?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }
      const data = await response.json();
      setBalance(data.balance);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVote = async () => {
    try {
      const response = await fetch('/api/tokens/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, pollId: selectedPoll, optionId: selectedOption, amount }),
      });

      if (!response.ok) {
        throw new Error('Failed to vote');
      }

      const data = await response.json();
      setBalance(data.balance);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Vote with Tokens</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.polls}>
        {polls.map((poll) => (
          <div key={poll.id} className={styles.poll}>
            <h2 className={styles.pollTitle}>{poll.title}</h2>
            <p className={styles.pollDescription}>{poll.description}</p>
            <div className={styles.options}>
              {poll.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedPoll(poll.id);
                    setSelectedOption(option.id);
                  }}
                  className={`${styles.optionButton} ${selectedOption === option.id ? styles.selected : ''}`}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className={styles.input}
      />
      <button onClick={handleVote} className={styles.button}>
        Vote
      </button>
      <p className={styles.balance}>Balance: {balance} VOTE tokens</p>
    </div>
  );
}