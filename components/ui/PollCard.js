import React from "react";
import styles from "../../styles/components/ui/PollCard.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const PollCard = ({ poll, onVote, onOpenDialog }) => {
  return (
    <div className={styles.pollCard}>
      <div className={styles.cardContent}>
        <h3 className={styles.pollTitle}>{poll.title}</h3>
        <p className={styles.pollDescription}>{poll.description}</p>

        <button className={styles.viewVoteButton} onClick={() => onOpenDialog(poll)}>
          View and Vote
        </button>

        <div className={styles.voteContainer}>
          <div className={styles.voteButton} onClick={() => onVote(poll.id, 1)}>
            <FontAwesomeIcon icon={faThumbsUp} size="sm" />
            <span className={styles.voteCount}>{poll.upvotes}</span>
          </div>
          <div className={styles.voteButton} onClick={() => onVote(poll.id, -1)}>
            <FontAwesomeIcon icon={faThumbsDown} size="sm" />
            <span className={styles.voteCount}>{poll.downvotes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollCard;
