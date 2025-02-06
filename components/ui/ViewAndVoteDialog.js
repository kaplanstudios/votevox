import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/components/ui/ViewAndVoteDialog.module.css'; // Updated import
import { useSession } from 'next-auth/react'; 
import SignatureCanvas from 'react-signature-canvas';
import Toast from './Toast';

export default function ViewAndVoteDialog({ onClose, poll, onVote }) {
  const { data: session } = useSession();
  const [selectedOption, setSelectedOption] = useState(null);
  const [signature, setSignature] = useState('');
  const [showToast, setShowToast] = useState(false);
  const signatureCanvasRef = useRef(null);

  if (!poll) {
    return <div>Loading poll...</div>;
  }

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

  // Updated: Now accepts a uuid parameter and passes it along with the signature.
  const saveSignature = async (signatureData, uuid) => {
    if (!signatureData || !uuid) {
      console.error("Error: Signature data or UUID is missing.");
      return null;
    }

    try {
      const response = await fetch('/api/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature: signatureData, uuid }), // Pass both values
      });

      if (!response.ok) {
        throw new Error("Failed to upload signature.");
      }

      const data = await response.json();
      return data.signatureUrl || uuid;
    } catch (error) {
      console.error("Error saving signature:", error);
      return null;
    }
  };

  const handleVoteSubmit = async () => {
    if (!session) {
      console.error('User not logged in');
      return;
    }

    if (!selectedOption) {
      setShowToast(true);
      return;
    }

    let signaturePath = null;
    if (poll.notarizedSignatureRequired) {
      const uuid = `${poll.id}-${session.user.id}`;
      signaturePath = await saveSignature(signature, uuid);
      if (!signaturePath) {
        setShowToast(true);
        return;
      }
    }

    const voteData = {
      voteId: `${Date.now()}-${Math.random()}`,
      pollId: poll.id,
      userId: session.user.id,
      selectedOption,
      signaturePath,
    };

    const response = await fetch('/api/votes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(voteData),
    });

    if (response.ok) {
      onVote();
      onClose();
    } else {
      console.error('Failed to submit vote');
    }
  };

  useEffect(() => {
    if (poll && Array.isArray(poll.votes)) {
      const userVote = poll.votes.find((vote) => vote.userId === session?.user.id);
      if (userVote) {
        setSelectedOption(userVote.selectedOption);
        setSignature(userVote.signaturePath || '');
      }
    }
  }, [poll, session]);

  return (
    <div className={styles.overlay}>
      <div className={styles.dialogContent}>
        <h2 className={styles.title}>Vote on Poll</h2>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Poll Title</label>
          <p className={styles.pollText}>{poll.title || 'Loading poll title...'}</p>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Description</label>
          <p className={styles.pollText}>{poll.description || 'Loading poll description...'}</p>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Choose an Option</label>
          <div className={styles.optionList}>
            {poll.options?.length > 0 ? (
              poll.options.map((option, index) => (
                <button
                  key={index}
                  className={`${styles.optionButton} ${selectedOption === option ? styles.selected : ''}`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </button>
              ))
            ) : (
              <p>Loading poll options...</p>
            )}
          </div>
        </div>

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
                  height: 100,
                  className: styles.signatureCanvas,
                }}
              />
            </div>
            <button className={styles.clearButton} onClick={handleClearSignature}>
              Clear Signature
            </button>
          </div>
        )}

        <div className={styles.buttonGroup}>
          <button className={`${styles.bgGreen} ${styles.dialogButton}`} onClick={handleVoteSubmit}>
            Submit Vote
          </button>
          <button className={`${styles.bgGray} ${styles.dialogButton}`} onClick={onClose}>
            Cancel
          </button>
        </div>

        {showToast && (
          <Toast
            message="You must select an option and provide a signature (if required)"
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </div>
  );
}
