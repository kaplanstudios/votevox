import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/CreatePoll.module.css';

export default function CreatePoll() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (options.length < 2) {
      setError('At least two options are required.');
      return;
    }

    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, options, type: 'majority' }),
      });

      if (response.ok) {
        router.push('/pollingapp');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create poll.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Poll</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="description">Description</label>
          <textarea
            id="description"
            className={styles.input}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Options</label>
          {options.map((option, index) => (
            <div key={index} className={styles.option}>
              <input
                type="text"
                className={styles.input}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
              <button type="button" onClick={() => handleRemoveOption(index)} className={styles.removeButton}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={handleAddOption} className={styles.addButton}>Add Option</button>
        </div>
        <button type="submit" className={styles.submitButton}>Create Poll</button>
      </form>
    </div>
  );
}