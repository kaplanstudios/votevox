import React, { useState, useEffect, useRef } from "react";
import styles from "../../styles/components/ui/ViewAndVoteDialog.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import SignatureCanvas from "react-signature-canvas";

const ViewAndVoteDialog = ({ poll, userId, onClose, onVote }) => {
  const [userVote, setUserVote] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [signatureData, setSignatureData] = useState(null);
  const sigCanvasRef = useRef(null);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const res = await fetch(`/api/polls/${poll.id}`);
        const data = await res.json();
        if (data.votes) {
          const upvoteCount = data.votes.filter(vote => vote.vote === 1).length;
          const downvoteCount = data.votes.filter(vote => vote.vote === -1).length;
          setUpvotes(upvoteCount);
          setDownvotes(downvoteCount);
          const found = data.votes.find(vote => vote.userId === userId);
          setUserVote(found ? found.vote : null);
        }
      } catch (error) {
        console.error("Error fetching votes:", error);
      }
    };
    fetchVotes();
  }, [poll.id, userId]);

  const handleVoteChange = (optionIndex) => {
    setUserVote(optionIndex);
  };

  const saveVote = async () => {
    let signature = null;

    // Check if notarized signature is required and capture it
    if (poll.notarizedSignatureRequired && sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      signature = sigCanvasRef.current.toDataURL();
    }

    // If signature is required, save it
    let signaturePath = null;
    if (poll.notarizedSignatureRequired && signature) {
      const uuid = `${poll.id}-${userId}`;
      signaturePath = await saveSignature(signature, uuid);
      if (!signaturePath) {
        alert("Failed to save signature.");
        return;
      }
    }

    // Vote data to be sent to the backend
    const voteData = {
      voteId: `${Date.now()}-${Math.random()}`,
      pollId: poll.id,
      userId,
      vote: userVote,
      signature,
    };

    try {
      const response = await fetch("/api/saveVote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(voteData),
      });
      if (response.ok) {
        alert("Vote saved successfully!");
        onClose();  // Close dialog after successful vote submission
      } else {
        alert("Failed to save vote.");
      }
    } catch (error) {
      console.error("Error saving vote:", error);
      alert("Error saving vote.");
    }
  };

  const saveSignature = async (signature, uuid) => {
    // Implement your logic to save the signature, or return the signature path
    return "/path/to/signature";  // Placeholder for the actual path
  };

  return (
    <div className={styles.dialogContent}>
      <h3 className={styles.title}>{poll.title}</h3>
      <p>{poll.description}</p>

      <div className={styles.options}>
        {poll.options.map((option, index) => (
          <div key={index} className={styles.option}>
            <input
              type="radio"
              id={`option-${index}`}
              name="voteOption"
              value={index}
              onChange={() => handleVoteChange(index)}
              checked={userVote === index}
            />
            <label htmlFor={`option-${index}`}>{option}</label>
          </div>
        ))}
      </div>

      {poll.notarizedSignatureRequired && (
        <div className={styles.signatureContainer}>
          <p>Please provide your signature:</p>
          <SignatureCanvas
            penColor="black"
            canvasProps={{ width: 300, height: 100, className: "signatureCanvas" }}
            ref={sigCanvasRef}
          />
        </div>
      )}

      <div className={styles.buttonGroup}>
        <button onClick={saveVote} className={`${styles.dialogButton} ${styles.bgGreen}`}>
          Save Vote
        </button>
        <button onClick={onClose} className={`${styles.dialogButton} ${styles.bgGray}`}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewAndVoteDialog;
