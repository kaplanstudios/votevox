import { useState } from 'react';
import { getLoggedInUserId } from '../utils/auth'; // Utility function to get the logged-in user ID
import styles from '../styles/Trade.module.css';

export default function Trade() {
  const [toUserId, setToUserId] = useState('');
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState('');
  const userId = getLoggedInUserId(); // Get the logged-in user ID

  const handleTrade = async () => {
    try {
      const response = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromUserId: userId, toUserId, amount }),
      });
      if (!response.ok) {
        throw new Error('Failed to trade tokens');
      }
      const data = await response.json();
      setBalance(data.fromBalance);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Trade VOTE Tokens</h1>
      {error && <p className={styles.error}>{error}</p>}
      <input
        type="text"
        value={toUserId}
        onChange={(e) => setToUserId(e.target.value)}
        placeholder="Recipient User ID"
        className={styles.input}
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className={styles.input}
      />
      <button onClick={handleTrade} className={styles.button}>Trade</button>
      <p className={styles.balance}>Your Balance: {balance} VOTE tokens</p>
    </div>
  );
}