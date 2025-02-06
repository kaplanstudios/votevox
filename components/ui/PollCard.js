import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import CardContent from "./CardContent";
import styles from "../../styles/components/ui/PollCard.module.css";

const PollCard = ({
  poll,
  onViewVote, // Make sure this prop is passed from the parent
  userId,
  index,
  fadeOut,
  isActive,
  onCancel,
  onSave
}) => {
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
    fetchVotes();
  }, [poll.id, userId]);

  // Check if poll is closed.
  useEffect(() => {
    const currentDate = new Date();
    const closeDate = new Date(poll.closingDate);
    setIsPollClosed(currentDate >= closeDate);
  }, [poll.closingDate]);

  const calculateVotes = (votes) => {
    const upvoteCount = votes.filter((vote) => vote.vote === 1).length;
    const downvoteCount = votes.filter((vote) => vote.vote === -1).length;
    setUpvotes(upvoteCount);
    setDownvotes(downvoteCount);
  };

  const handleVote = async (voteType) => {
    let response;
  
    // Fetch current rank data
    const res = await fetch(`/api/polls/${poll.id}`);
    const rankData = await res.json();
  
    if (!rankData) {
      console.log("Poll not found");
      return;
    }
  
    // Ensure that rankData.votes is an array before trying to push
    if (!rankData.votes) {
      rankData.votes = [];
    }
  
    // Check if rankData.votes exists before trying to find the user's vote
    const existingVote = rankData.votes.find((vote) => vote.userId === userId);
  
    if (existingVote) {
      if (voteType === null) {
        // Remove user's vote if they unvote
        rankData.votes = rankData.votes.filter((vote) => vote.userId !== userId);
      } else {
        existingVote.vote = voteType;
      }
    } else if (voteType !== null) {
      rankData.votes.push({ userId, vote: voteType });
    }
  
    // Send the updated vote data to the backend
    response = await fetch(`/api/polls/${poll.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rankData),
    });
  
    if (response.ok) {
      calculateVotes(rankData.votes); // Recalculate votes after update
      setUserVote(voteType); // Update the user's vote in the state
    } else {
      console.log("Failed to update vote.");
    }
  };

  const calculateDaysLeft = (closingDate) => {
    const currentDate = new Date();
    const closeDate = new Date(closingDate); // Corrected variable name
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
            onClick={() => handleVote(userVote === 1 ? null : 1)}
            style={userVote === 1 ? { color: "#0000FF" } : {}}
            disabled={isPollClosed}
          >
            <FontAwesomeIcon icon={faThumbsUp} size="lg" />
            <span className={styles.voteCount}>{upvotes}</span>
          </button>
          <button
            type="button"
            className={`${styles.voteButton} ${userVote === -1 ? styles.activeDownvote : ""}`}
            onClick={() => handleVote(userVote === -1 ? null : -1)}
            style={userVote === -1 ? { color: "#0000FF" } : {}}
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
