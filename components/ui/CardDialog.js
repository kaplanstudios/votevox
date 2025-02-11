import React from "react";
import styles from "../../styles/components/ui/CardDialog.module.css"; // Your styling for the modal

const CardDialog = ({ poll, onClose, onVote }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.dialogContent}>
        <h3 className={styles.pollTitle}>{poll.title}</h3>
        <p className={styles.pollDescription}>{poll.description}</p>

        {/* Display poll options dynamically */}
        <div className={styles.pollOptions}>
          {poll.options && poll.options.map((option, index) => (
            <div key={index} className={styles.voteButton}>
              <button onClick={() => onVote(poll.id, option)} className={styles.voteButtonText}>
                {option}
              </button>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <button className={styles.closeDialog} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardDialog;
