import { useState } from 'react';
import { getLoggedInUserId } from '../utils/auth'; // Utility function to get the logged-in user ID
import styles from '../styles/BuyTokens.module.css';

export default function Buy() {
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState('');
  const userId = getLoggedInUserId(); // Get the logged-in user ID

  const handleBuy = async () => {
    try {
      const response = await fetch('/api/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount }),
      });
      if (!response.ok) {
        throw new Error('Failed to buy tokens');
      }
      const data = await response.json();
      setBalance(data.balance);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Buy VOTE Tokens</h1>
      {error && <p className={styles.error}>{error}</p>}
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className={styles.input}
      />
      <button onClick={handleBuy} className={styles.button}>Buy</button>
      <p className={styles.balance}>New Balance: {balance} VOTE tokens</p>
    </div>
  );
}