import React, { useEffect } from "react";
import styles from "../../styles/components/ui/CardDialog.module.css";

const CardDialog = ({ poll, onClose, onVote }) => {

  useEffect(() => {
    // Optionally handle any cleanup after the dialog is displayed
    return () => {
      // Cleanup
    };
  }, []);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.dialogContent}>
        <h4>{poll.title}</h4>
        <p>{poll.description}</p>
        <div className={styles.voteButtonsDialog}>
          <button onClick={() => onVote(poll.id, 1)}>Upvote</button>
          <button onClick={() => onVote(poll.id, -1)}>Downvote</button>
        </div>
        <button onClick={onClose} className={styles.closeDialog}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CardDialog;
