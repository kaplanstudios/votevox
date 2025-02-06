import React, { useState } from 'react';
import styles from '../../styles/components/ui/CreatePollDialog.module.css';
import { v4 as uuidv4 } from 'uuid'; // Ensure you have the uuid library
import { useSession } from 'next-auth/react'; // Import the useSession hook

export default function CreatePollDialog({ onClose }) {
  const { data: session } = useSession(); // Access the session to get the current user
  const [pollData, setPollData] = useState({
    title: '',
    description: '',
    options: ['', ''],
    requireSignature: false,
    closingDate: '', // Added closingDate field
  });

  // Handles changes to text inputs
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setPollData((prev) => {
      const updatedOptions = [...prev.options];
      if (name === 'title' || name === 'description' || name === 'closingDate') {
        return { ...prev, [name]: value };
      } else {
        updatedOptions[index] = value;
        return { ...prev, options: updatedOptions };
      }
    });
  };

  // Adds a new option
  const addOption = () => {
    if (pollData.options.length < 10) {
      setPollData((prev) => ({ ...prev, options: [...prev.options, ''] }));
    }
  };

  // Removes an option, but ensures there are at least 2 options
  const removeOption = (index) => {
    if (pollData.options.length > 2) {
      const updatedOptions = pollData.options.filter((_, i) => i !== index);
      setPollData((prev) => ({ ...prev, options: updatedOptions }));
    }
  };

  // Toggles the Require Notarized Signature field
  const toggleSignature = () => {
    setPollData((prev) => ({ ...prev, requireSignature: !prev.requireSignature }));
  };

  // Handles form submission
  const handleSubmit = async () => {
    if (!session) {
      console.error('User not logged in');
      return;
    }

    const newPoll = {
      id: uuidv4(),
      title: pollData.title,
      description: pollData.description,
      closingDate: pollData.closingDate, // Include closingDate
      options: pollData.options,
      creatorId: session.user.id, // Use the session's user ID as creatorId
      notarizedSignatureRequired: pollData.requireSignature, // Match notarizedSignatureRequired
    };

    // Send the new poll to the backend (create.js API)
    const response = await fetch('/api/polls/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pollData: newPoll }),
    });

    if (response.ok) {
      onClose(); // Close the dialog after successful creation
    } else {
      console.error('Failed to create poll');
    }
  };

  return (
    <div className={styles.dialog}>
      <div className={styles.dialogContent}>
        <h2 className={styles.title}>Create Poll</h2>

        {/* Poll Title */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Poll Title</label>
          <input
            type="text"
            className={styles.inputField}
            name="title"
            value={pollData.title}
            onChange={(e) => handleChange(e)}
            placeholder="Enter poll title"
          />
        </div>

        {/* Description */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.inputField}
            name="description"
            value={pollData.description}
            onChange={(e) => handleChange(e)}
            placeholder="Enter description"
          />
        </div>

        {/* Closing Date */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Closing Date</label>
          <input
            type="datetime-local"
            className={styles.inputField}
            name="closingDate"
            value={pollData.closingDate}
            onChange={(e) => handleChange(e)}
            placeholder="Enter closing date"
          />
        </div>

        {/* Poll Options */}
        {pollData.options.map((option, index) => (
          <div className={styles.inputGroup} key={index}>
            <label className={styles.label}>Option {index + 1}</label>
            <input
              type="text"
              className={styles.inputField}
              value={option}
              onChange={(e) => handleChange(e, index)}
              placeholder={`Option ${index + 1}`}
            />
            {index >= 2 && (
              <button
                type="button"
                className={styles.removeOptionButton}
                onClick={() => removeOption(index)}
              >
                <i className="fa fa-trash"></i>
              </button>
            )}
          </div>
        ))}

        {/* Add Option Button */}
        <button
          type="button"
          className={styles.addOptionButton}
          onClick={addOption}
        >
          Add Option
        </button>

        {/* Notarized Signature Toggle */}
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            checked={pollData.requireSignature}
            onChange={toggleSignature}
          />
          <label>Require Notarized Signature?</label>
        </div>

        {/* Buttons */}
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.bgGreen} ${styles.dialogButton}`}
            onClick={handleSubmit}
          >
            Create Poll
          </button>
          <button
            className={`${styles.bgGray} ${styles.dialogButton}`}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
