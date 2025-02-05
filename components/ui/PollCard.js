import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown, faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import CardContent from "./CardContent";
import Dialog from "./Dialog"; // Dialog component supports fullscreen
import styles from "../../styles/components/ui/PollCard.module.css";

const PollCard = ({
  poll,
  onOpenDialog,
  userId,
  index,
  fadeOut,
  isActive,
  onCancel,
  onSave,
  isEmbedded, // New prop to handle embedded view
}) => {
  const [userVote, setUserVote] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [isPollClosed, setIsPollClosed] = useState(false);
  const [isEmbedDialogOpen, setIsEmbedDialogOpen] = useState(false);
  const [isViewVoteDialogOpen, setIsViewVoteDialogOpen] = useState(false);

  // Fetch votes and calculate upvotes/downvotes
  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await fetch(`/api/ranks/${poll.id}`);
        if (response.ok) {
          const data = await response.json();
          calculateVotes(data.votes || []);
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
    setIsPollClosed(new Date() >= new Date(poll.closingDate));
  }, [poll.closingDate]);

  const calculateVotes = (votes) => {
    setUpvotes(votes.filter((vote) => vote.vote === 1).length);
    setDownvotes(votes.filter((vote) => vote.vote === -1).length);
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
        const found = updatedData.votes.find((v) => v.userId === userId);
        setUserVote(found ? found.vote : null);
      }
    } catch (error) {
      console.error("Error updating vote:", error);
    }
  };

  const embedLink = `${window.location.origin}/embed/${poll.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedLink);
    alert("Embed link copied to clipboard!");
  };

  const handleEmbedDialogOpen = () => {
    setIsEmbedDialogOpen(true);
  };

  const handleViewVoteDialogOpen = () => {
    setIsViewVoteDialogOpen(true);
    if (onOpenDialog) {
      onOpenDialog(poll);
    }
  };

  return (
    <>
      <div className={`${styles.pollCard} ${fadeOut ? styles.fadeOut : ""}`}>
        <CardContent className={styles.cardContent} isModal={!!isActive} onCancel={onCancel} onSave={onSave}>
          <div className={styles.header}>
            <h3 className={styles.pollTitle}>{poll.title}</h3>
            <button className={styles.shareButton} onClick={handleEmbedDialogOpen}>
              <FontAwesomeIcon icon={faArrowUpFromBracket} />
            </button>
          </div>
          <p className={styles.pollDescription}>{poll.description}</p>

          <div className={styles.pollOptions}>
            {!isActive && (
              <button
                type="button"
                className={styles.viewVoteButton}
                onClick={handleViewVoteDialogOpen}
                disabled={isPollClosed}
              >
                {isPollClosed ? "View Results" : "View and Vote"}
              </button>
            )}
          </div>

          <div className={styles.footer}>
            <div className={styles.closingDate}>
              {new Date(poll.closingDate) > new Date()
                ? `${Math.floor((new Date(poll.closingDate) - new Date()) / (1000 * 3600 * 24))} days left`
                : "Closed"}
            </div>
            <div className={styles.voteContainer}>
              <button
                className={`${styles.voteButton} ${userVote === 1 ? styles.activeUpvote : ""}`}
                onClick={() => handleVote(userVote === 1 ? null : 1)}
                disabled={isPollClosed}
              >
                <FontAwesomeIcon icon={faThumbsUp} />
                <span>{upvotes}</span>
              </button>
              <button
                className={`${styles.voteButton} ${userVote === -1 ? styles.activeDownvote : ""}`}
                onClick={() => handleVote(userVote === -1 ? null : -1)}
                disabled={isPollClosed}
              >
                <FontAwesomeIcon icon={faThumbsDown} />
                <span>{downvotes}</span>
              </button>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Embed Dialog - Fullscreen */}
      {isEmbedDialogOpen && (
        <Dialog onClose={() => setIsEmbedDialogOpen(false)} isFullScreen>
          <h3>Embed Poll</h3>
          <input type="text" value={embedLink} readOnly className={styles.embedInput} />
          <div className={styles.dialogButtons}>
            <button onClick={handleCopy} className={styles.copyButton}>
              Copy
            </button>
            <button onClick={() => setIsEmbedDialogOpen(false)} className={styles.doneButton}>
              Done
            </button>
          </div>
        </Dialog>
      )}

      {/* View and Vote Dialog */}
      {isViewVoteDialogOpen && (
        <Dialog onClose={() => setIsViewVoteDialogOpen(false)} isFullScreen>
          <h3>Poll Details</h3>
          <p>{poll.description}</p>
          <div className={styles.dialogButtons}>
            <button onClick={() => setIsViewVoteDialogOpen(false)} className={styles.doneButton}>
              Close
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default PollCard;
