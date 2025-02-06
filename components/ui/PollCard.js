import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import CardContent from "./CardContent";
import styles from "../../styles/components/ui/PollCard.module.css";

const PollCard = ({ poll, userId, onViewVote, onCancel, onSave, index, fadeOut, isActive }) => {
  const [userVote, setUserVote] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [isPollClosed, setIsPollClosed] = useState(false);

  // Fetch vote data when poll or userId changes.
  useEffect(() => {
    const fetchVotes = async () => {
      const res = await fetch(`/api/polls/${poll.id}`);
      const data = await res.json();
      if (data.votes) {
        calculateVotes(data.votes);
        const found = data.votes.find((vote) => vote.userId === userId);
        setUserVote(found ? found.vote : null);
      }
    };

    if (poll.id) {
      fetchVotes();
    } else {
      console.error("Poll ID is not available.");
    }
  }, [poll.id, userId]);

  // Check if poll is closed.
  useEffect(() => {
    try {
      const currentDate = new Date();
      const closeDate = new Date(poll.closingDate);
      setIsPollClosed(currentDate >= closeDate);
    } catch (err) {
      console.error("Error checking poll closing date:", err);
    }
  }, [poll.closingDate]);

  const calculateVotes = (votes) => {
    const upvoteCount = votes.filter((vote) => vote.vote === 1).length;
    const downvoteCount = votes.filter((vote) => vote.vote === -1).length;
    setUpvotes(upvoteCount);
    setDownvotes(downvoteCount);
  };

  const calculateDaysLeft = (closingDate) => {
    const currentDate = new Date();
    const closeDate = new Date(closingDate); 
    const daysLeft = Math.floor((closeDate - currentDate) / (1000 * 3600 * 24));
    return daysLeft > 0 ? `${daysLeft} days left` : "Closed";
  };

  return (
    <div
      className={`${styles.pollCard} 
        ${index !== undefined && index % 4 === 0 ? styles.firstInRow : ""} 
        ${fadeOut ? styles.fadeOut : styles.fadeIn}
        ${isActive ? styles.activeCard : ""}`}
    >
      <CardContent
        className={styles.cardContent}
        isModal={!!isActive}
        onCancel={onCancel}
        onSave={onSave}
      >
        <h3 className={styles.pollTitle}>{poll.title}</h3>
        <p className={styles.pollDescription}>{poll.description}</p>

        <div className={styles.pollOptions}>
          {!isActive && (
            <button
              type="button"
              className={styles.viewVoteButton}
              onClick={() => onViewVote(poll)} // Trigger the view and vote dialog from parent component
              disabled={isPollClosed}
            >
              {isPollClosed ? "View Results" : "View and Vote"}
            </button>
          )}
        </div>

        <div className={styles.voteContainer}>
          <button
            type="button"
            className={`${styles.voteButton} ${userVote === 1 ? styles.activeUpvote : ""}`}
            onClick={() => handleVote(userVote === 1 ? null : 1)}
            disabled={isPollClosed}
          >
            <FontAwesomeIcon icon={faThumbsUp} size="lg" />
            <span className={styles.voteCount}>{upvotes}</span>
          </button>
          <button
            type="button"
            className={`${styles.voteButton} ${userVote === -1 ? styles.activeDownvote : ""}`}
            onClick={() => handleVote(userVote === -1 ? null : -1)}
            disabled={isPollClosed}
          >
            <FontAwesomeIcon icon={faThumbsDown} size="lg" />
            <span className={styles.voteCount}>{downvotes}</span>
          </button>
        </div>

        <div className={styles.closingDate}>{calculateDaysLeft(poll.closingDate)}</div>
      </CardContent>
    </div>
  );
};

export default PollCard;
