import React, { useState, useRef } from 'react';
import styles from '../../styles/components/ui/ViewAndVoteDialog.module.css'; // Update with your new styles
import { useSession } from 'next-auth/react'; 
import SignatureCanvas from 'react-signature-canvas';

export default function ViewAndVoteDialog({ onClose, poll, onVote }) {
  const { data: session } = useSession();
  const [selectedOption, setSelectedOption] = useState(null);
  const [signature, setSignature] = useState('');
  const signatureCanvasRef = useRef(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleSignatureChange = () => {
    if (signatureCanvasRef.current) {
      setSignature(signatureCanvasRef.current.toDataURL());
    }
  };

  const handleClearSignature = () => {
    if (signatureCanvasRef.current) {
      signatureCanvasRef.current.clear();
      setSignature('');
    }
  };

  const handleVoteSubmit = async () => {
    if (!session) {
      console.error('User not logged in');
      return;
    }

    const voteData = {
      pollId: poll.id,
      userId: session.user.id,
      selectedOption,
      signature: signature || null,
    };

    // Call the vote submission API
    const response = await fetch('/api/votes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(voteData),
    });

    if (response.ok) {
      onVote(); // Update poll after successful vote
      onClose(); // Close the dialog
    } else {
      console.error('Failed to submit vote');
    }
  };

  return (
    <div className={styles.dialog}>
      <div className={styles.dialogContent}>
        <h2 className={styles.title}>Vote on Poll</h2>

        {/* Poll Title */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Poll Title</label>
          <p className={styles.pollText}>{poll.title}</p>
        </div>

        {/* Poll Description */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Description</label>
          <p className={styles.pollText}>{poll.description}</p>
        </div>

        {/* Poll Options */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Choose an Option</label>
          <div className={styles.optionList}>
            {poll.options.map((option, index) => (
              <button
                key={index}
                className={`${styles.optionButton} ${selectedOption === option ? styles.selectedOption : ''}`}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Signature Canvas - Display based on notarizedSignatureRequired */}
        {poll.notarizedSignatureRequired && (
          <div className={styles.signatureSection}>
            <label className={styles.label}>Signature</label>
            <div className={styles.signatureCanvasContainer}>
              <SignatureCanvas
                ref={signatureCanvasRef}
                onEnd={handleSignatureChange}
                penColor="black"
                canvasProps={{
                  width: 400,
                  height: 100,  // Make the signature canvas shorter
                  className: styles.signatureCanvas,
                }}
              />
            </div>
            <button
              className={styles.clearButton}
              onClick={handleClearSignature}
            >
              Clear Signature
            </button>
          </div>
        )}

        {/* Buttons */}
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.bgGreen} ${styles.dialogButton}`}
            onClick={handleVoteSubmit}
          >
            Submit Vote
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
