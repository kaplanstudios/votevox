import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import CardContent from "./CardContent";
import styles from "../../styles/components/ui/PollCard.module.css";
import ViewAndVoteDialog from "./ViewAndVoteDialog";

const PollCard = ({
  poll,
  onViewVote, 
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
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch vote data when poll or userId changes.
  useEffect(() => {
    const fetchVotes = async () => {
      try {
        console.log("Fetching votes for poll id:", poll.id); 
        setLoading(true);
        const res = await fetch(`/api/polls/${poll.id}`);
        
        if (!res.ok) {
          throw new Error(`Error fetching poll data: ${res.statusText}`);
        }

        const data = await res.json();
        console.log("Poll data received:", data); 

        if (data.votes) {
          calculateVotes(data.votes);
          const found = data.votes.find((vote) => vote.userId === userId);
          setUserVote(found ? found.vote : null);
        }
      } catch (err) {
        console.error("Failed to fetch poll data:", err);
        setError("Failed to fetch poll data.");
      } finally {
        setLoading(false);
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
      setError("Error checking poll closing date.");
    }
  }, [poll.closingDate]);

  const calculateVotes = (votes) => {
    const upvoteCount = votes.filter((vote) => vote.vote === 1).length;
    const downvoteCount = votes.filter((vote) => vote.vote === -1).length;
    setUpvotes(upvoteCount);
    setDownvotes(downvoteCount);
  };

  const handleVote = async (voteType) => {
    try {
      setLoading(true);
      console.log("Handling vote, voteType:", voteType);
  
      // Fetch current rank data
      const res = await fetch(`/api/polls/${poll.id}`);
      if (!res.ok) {
        throw new Error("Poll data not found");
      }

      const rankData = await res.json();
  
      if (!rankData.votes) {
        rankData.votes = [];
      }
  
      const existingVote = rankData.votes.find((vote) => vote.userId === userId);
  
      if (existingVote) {
        if (voteType === null) {
          rankData.votes = rankData.votes.filter((vote) => vote.userId !== userId);
        } else {
          existingVote.vote = voteType;
        }
      } else if (voteType !== null) {
        rankData.votes.push({ userId, vote: voteType });
      }
  
      const response = await fetch(`/api/polls/${poll.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rankData),
      });
  
      if (response.ok) {
        calculateVotes(rankData.votes);
        setUserVote(voteType);
      } else {
        throw new Error("Failed to update vote.");
      }
    } catch (err) {
      console.error("Error during voting process:", err);
      setError("An error occurred while updating your vote.");
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysLeft = (closingDate) => {
    try {
      const currentDate = new Date();
      const closeDate = new Date(closingDate);
      const daysLeft = Math.floor((closeDate - currentDate) / (1000 * 3600 * 24));
      return daysLeft > 0 ? `${daysLeft} days left` : "Closed";
    } catch (err) {
      console.error("Error calculating days left:", err);
      setError("Error calculating days left.");
      return "Unknown";
    }
  };

  const handleViewAndVote = () => {
    console.log("Opening ViewAndVoteDialog for poll id:", poll.id); 
    setShowDialog(true); 
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

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.pollOptions}>
          {!isActive && (
            <button
              type="button"
              className={styles.viewVoteButton}
              onClick={handleViewAndVote}
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
            disabled={isPollClosed || loading}
          >
            <FontAwesomeIcon icon={faThumbsUp} size="lg" />
            <span className={styles.voteCount}>{upvotes}</span>
          </button>
          <button
            type="button"
            className={`${styles.voteButton} ${userVote === -1 ? styles.activeDownvote : ""}`}
            onClick={() => handleVote(userVote === -1 ? null : -1)}
            style={userVote === -1 ? { color: "#0000FF" } : {}}
            disabled={isPollClosed || loading}
          >
            <FontAwesomeIcon icon={faThumbsDown} size="lg" />
            <span className={styles.voteCount}>{downvotes}</span>
          </button>
        </div>

        <div className={styles.closingDate}>{calculateDaysLeft(poll.closingDate)}</div>
      </CardContent>

      {showDialog && (
        <>
          <div className={styles.overlay} onClick={() => setShowDialog(false)} /> 
          <ViewAndVoteDialog
            poll={poll}
            userId={userId}
            onClose={() => {
              console.log("Closing ViewAndVoteDialog");
              setShowDialog(false); 
            }}
          />
        </>
      )}

      {loading && <div className={styles.loading}>Loading...</div>}
    </div>
  );
};

export default PollCard;
