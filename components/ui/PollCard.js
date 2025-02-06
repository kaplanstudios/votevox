import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import CardContent from "./CardContent";
import styles from "../../styles/components/ui/PollCard.module.css";

const PollCard = ({ poll, onViewVote, userId, index, fadeOut, isActive, onCancel, onSave }) => {
  const [userVote, setUserVote] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [isPollClosed, setIsPollClosed] = useState(false);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const res = await fetch(`/api/polls/${poll.id}`);
        const data = await res.json();
        if (data.votes) {
          const upvoteCount = data.votes.filter((vote) => vote.vote === 1).length;
          const downvoteCount = data.votes.filter((vote) => vote.vote === -1).length;
          setUpvotes(upvoteCount);
          setDownvotes(downvoteCount);
          const found = data.votes.find((vote) => vote.userId === userId);
          setUserVote(found ? found.vote : null);
        }
      } catch (error) {
        console.error("Error fetching votes:", error);
      }
    };
    fetchVotes();
  }, [poll.id, userId]);

  useEffect(() => {
    const currentDate = new Date();
    const closeDate = new Date(poll.closingDate);
    setIsPollClosed(currentDate >= closeDate);
  }, [poll.closingDate]);

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
      <CardContent className={styles.cardContent} isModal={!!isActive} onCancel={onCancel} onSave={onSave}>
        <h3 className={styles.pollTitle}>{poll.title}</h3>
        <p className={styles.pollDescription}>{poll.description}</p>

        <div className={styles.pollOptions}>
          {!isActive && (
            <button
              type="button"
              className={styles.viewVoteButton}
              onClick={() => onViewVote(poll)}
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
            onClick={() => {}}
            disabled={isPollClosed}
          >
            <FontAwesomeIcon icon={faThumbsUp} size="lg" />
            <span className={styles.voteCount}>{upvotes}</span>
          </button>
          <button
            type="button"
            className={`${styles.voteButton} ${userVote === -1 ? styles.activeDownvote : ""}`}
            onClick={() => {}}
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
