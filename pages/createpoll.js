import { useState } from 'react';
import styles from '../styles/CreatePoll.module.css';

export default function CreatePoll({ onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [closingDate, setClosingDate] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
  };

  return (
    <div className={styles.createPollContainer}>
      <h2>Create Poll</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <label>
          Closing Date:
          <input type="date" value={closingDate} onChange={(event) => setClosingDate(event.target.value)} />
        </label>
        <button type="submit">Create Poll</button>
      </form>
      <button onClick={onClose}>Close</button>
    </div>
  );
}