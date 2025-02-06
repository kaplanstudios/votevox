// pages/createpoll.js

import { useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from 'uuid';
import styles from '../styles/components/ui/Dialog.module.css';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';

export default function CreatePoll() {
  const { data: session, status } = useSession();
  const [pollTitle, setPollTitle] = useState('');
  const [pollDescription, setPollDescription] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [notarized, setNotarized] = useState(false);
  const [closingDate, setClosingDate] = useState('');
  const [message, setMessage] = useState('');
  const [toastType, setToastType] = useState("info");

  const router = useRouter();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Please sign in to create a poll.</div>;

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...pollOptions];
    updatedOptions[index] = value;
    setPollOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const handleSubmit = async () => {
    if (pollTitle.trim() && pollOptions.filter(opt => opt.trim() !== '').length >= 2) {
      const newPoll = {
        id: uuidv4(),
        title: pollTitle,
        description: pollDescription,
        options: pollOptions.filter(opt => opt.trim() !== ''),
        notarized,
        closingDate,
        creatorID: session.user.id,
        upvotes: 0,
        downvotes: 0
      };

      const response = await fetch('/api/createpoll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPoll)
      });

      const data = await response.json();
      setMessage(data.message);
      setToastType(response.ok ? "success" : "error");

      if (response.ok) {
        setPollTitle('');
        setPollDescription('');
        setPollOptions(['', '']);
        setNotarized(false);
        setClosingDate('');
        setTimeout(() => router.push('/pollingapp'), 1500);
      }
    } else {
      setMessage('Please provide a title and at least two options.');
      setToastType("error");
    }
  };

  return (
    <div className={styles.dialogContent}>
      <h2>Create Poll</h2>
      {message && <Toast message={message} type={toastType} onClose={() => setMessage("")} />}
      <input
        type="text"
        placeholder="Poll Title"
        value={pollTitle}
        onChange={e => setPollTitle(e.target.value)}
      />
      <textarea
        placeholder="Poll Description"
        value={pollDescription}
        onChange={e => setPollDescription(e.target.value)}
      />
      {pollOptions.map((option, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Option ${index + 1}`}
          value={option}
          onChange={e => handleOptionChange(index, e.target.value)}
        />
      ))}
      <Button onClick={handleAddOption}>Add Option</Button>
      <label>
        <input
          type="checkbox"
          checked={notarized}
          onChange={e => setNotarized(e.target.checked)}
        />
        Notarized Signature Required
      </label>
      <input
        type="date"
        value={closingDate}
        onChange={e => setClosingDate(e.target.value)}
      />
      <Button onClick={handleSubmit}>Submit Poll</Button>
      <Button onClick={() => router.push('/pollingapp')}>Cancel</Button>
    </div>
  );
}
