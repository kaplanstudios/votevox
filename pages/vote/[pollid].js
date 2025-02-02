// pages/vote/[pollid].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Vote.module.css';
import fs from 'fs';
import path from 'path';

// Fetching all poll ids for getStaticPaths
export async function getStaticPaths() {
  const pollsFilePath = path.join(process.cwd(), 'data', 'polls.json');
  const pollsData = fs.readFileSync(pollsFilePath, 'utf-8');
  const polls = JSON.parse(pollsData);

  // Generate paths for each poll
  const paths = polls.map((poll) => ({
    params: { pollid: poll.id },
  }));

  return {
    paths,
    fallback: false, // can be true or 'blocking' based on your preference
  };
}

// Fetching specific poll data for getStaticProps
export async function getStaticProps({ params }) {
  const { pollid } = params;

  const pollsFilePath = path.join(process.cwd(), 'data', 'polls.json');
  const pollsData = fs.readFileSync(pollsFilePath, 'utf-8');
  const polls = JSON.parse(pollsData);

  const poll = polls.find((poll) => poll.id === pollid);

  if (!poll) {
    return {
      notFound: true, // Return a 404 if poll is not found
    };
  }

  return {
    props: { poll }, // Pass the poll data as props
  };
}

export default function Vote({ poll }) {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleVote = async (optionId) => {
    try {
      const response = await fetch(`/api/vote/${poll.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user1', optionId, tokens: 1 }), // Example userId and tokens
      });
      if (!response.ok) {
        throw new Error('Failed to vote');
      }
      const data = await response.json();
      // Update the poll data if necessary after voting
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{poll.title}</h1>
      <p className={styles.description}>{poll.description}</p>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.options}>
        {poll.options.map((option) => (
          <button key={option.id} onClick={() => handleVote(option.id)} className={styles.option}>
            {option.text} ({option.votes})
          </button>
        ))}
      </div>
    </div>
  );
}
