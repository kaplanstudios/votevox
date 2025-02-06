import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react'; 
import SignatureCanvas from 'react-signature-canvas';
import styles from '../../styles/components/ui/ViewAndVoteDialog.module.css'; 
import Toast from './Toast';

export default function ViewAndVoteDialog({ onClose, poll, onVote }) {
  const { data: session } = useSession();
  const [selectedOption, setSelectedOption] = useState(null);
  const [signature, setSignature] = useState('');
  const [showToast, setShowToast] = useState(false);
  const signatureCanvasRef = useRef(null);

  // Ensure poll data is loaded
  if (!poll) {
    return <div>Loading poll...</div>;
  }

  // Handle selection of an option in the poll
  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  // Capture signature changes
  const handleSignatureChange = () => {
    if (signatureCanvasRef.current) {
      setSignature(signatureCanvasRef.current.toDataURL());
    }
  };

  // Clear the signature
  const handleClearSignature = () => {
    if (signatureCanvasRef.current) {
      signatureCanvasRef.current.clear();
      setSignature('');
    }
  };

  // Save the signature by calling the API with the correct UUIDs
  const saveSignature = async (signatureData) => {
    if (!signatureData) {
      console.error("Error: Signature data is undefined or empty.");
      return null;
    }

    try {
      const response = await fetch('/api/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signature: signatureData,
          uuid: `${poll.id}-${session.user.id}`, // Unique identifier for the signature
        }),
      });

      if (!response.ok) throw new Error("Failed to upload signature.");

      const { signatureUrl } = await response.json();
      return signatureUrl;
    } catch (error) {
      console.error("Error saving signature:", error);
      return null;
    }
  };

  // Handle submitting the vote
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
        signaturePath = await saveSignature(signature);
        if (!signaturePath) {
            setShowToast(true);
            return;
        }
    }

    const voteData = {
        voteId: `${Date.now()}-${Math.random()}`,
        pollId: poll.id,  // Ensure the correct poll.id is passed
        userId: session.user.id,
        selectedOption,
        signaturePath,
    };

    // Log the pollId for debugging
    console.log('Poll ID:', poll.id);

    try {
        const response = await fetch(`/api/polls/${poll.id}/vote`, {
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
    } catch (error) {
        console.error('Error saving vote:', error);
    }
  };

  // Effect to check for an existing vote from the user
  useEffect(() => {
    if (poll && Array.isArray(poll.votes)) {
      const userVote = poll.votes.find((vote) => vote.userId === session?.user.id);
      if (userVote) {
        setSelectedOption(userVote.selectedOption);
        setSignature(userVote.signaturePath || '');
        
        // If a signature already exists, we display it on the canvas
        if (userVote.signaturePath) {
          const canvas = signatureCanvasRef.current;
          const context = canvas?.getContext('2d');
          if (context) {
            const img = new Image();
            img.onload = () => {
              context.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas before drawing
              context.drawImage(img, 0, 0);  // Draw the signature PNG
            };
            img.src = userVote.signaturePath;  // Load the signature PNG URL from the vote
          }
        }
      }
    }
  }, [poll, session]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialogContainer} onClick={(e) => e.stopPropagation()}>
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
