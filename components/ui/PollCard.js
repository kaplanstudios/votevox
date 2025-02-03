import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import styles from "../../styles/components/ui/PollCard.module.css";

const PollCard = ({ poll, onOpenDialog, userId, index }) => {
  const [userVote, setUserVote] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [isPollClosed, setIsPollClosed] = useState(false);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await fetch(`/api/ranks/${poll.id}`);
        if (response.ok) {
          const data = await response.json();
          const votes = data.votes || [];
          calculateVotes(votes);

          // Check for the user's current vote
          const userVote = votes.find(vote => vote.userId === userId);
          setUserVote(userVote ? userVote.vote : null);
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

  const calculateVotes = (votes) => {
    const upvoteCount = votes.filter(vote => vote.vote === 1).length;
    const downvoteCount = votes.filter(vote => vote.vote === -1).length;
    setUpvotes(upvoteCount);
    setDownvotes(downvoteCount);
  };

  const handleVote = async (voteType) => {
    try {
      const response = await fetch(`/api/ranks/${poll.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, vote: voteType }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        calculateVotes(updatedData.votes);
        setUserVote(voteType);
      } else {
        console.error("Error updating vote, status:", response.status);
      }
    } catch (error) {
      console.error("Error updating vote:", error);
    }
  };

  const calculateDaysLeft = (closingDate) => {
    const currentDate = new Date();
    const closeDate = new Date(closingDate);
    const daysLeft = Math.floor((closeDate - currentDate) / (1000 * 3600 * 24));
    return daysLeft > 0 ? `${daysLeft} days left` : "Closed";
  };

  return (
    <div className={`${styles.pollCard} ${index % 4 === 0 ? styles.firstInRow : ""}`}>
      <div className={styles.cardContent}>
        <h3 className={styles.pollTitle}>{poll.title}</h3>
        <p className={styles.pollDescription}>{poll.description}</p>

        <div className={styles.pollOptions}>
          <button
            className={styles.viewVoteButton}
            onClick={() => onOpenDialog(poll)}
            disabled={isPollClosed}
          >
            {isPollClosed ? "View Results" : "View and Vote"}
          </button>
        </div>

        <div className={styles.voteContainer}>
          <div
            className={`${styles.voteButton} ${userVote === 1 ? styles.active : ""}`}
            onClick={() => handleVote(userVote === 1 ? null : 1)}
            disabled={isPollClosed}
          >
            <FontAwesomeIcon icon={faThumbsUp} size="lg" />
            <span className={styles.voteCount}>{upvotes}</span>
          </div>
          <div
            className={`${styles.voteButton} ${userVote === -1 ? styles.active : ""}`}
            onClick={() => handleVote(userVote === -1 ? null : -1)}
            disabled={isPollClosed}
          >
            <FontAwesomeIcon icon={faThumbsDown} size="lg" />
            <span className={styles.voteCount}>{downvotes}</span>
          </div>
        </div>

        <div className={styles.closingDate}>{calculateDaysLeft(poll.closingDate)}</div>
      </div>
    </div>
  );
};

export default PollCard;
