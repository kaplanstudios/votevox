import React, { useState } from "react";
import PollCard from "../components/ui/PollCard";
import CardDialog from "../components/ui/CardDialog"; // Import CardDialog instead of Dialog
import styles from "../styles/PollingApp.module.css";

const PollingApp = () => {
  const [polls, setPolls] = useState([
    { id: 1, title: "Poll 1", description: "Poll 1 description", upvotes: 10, downvotes: 5 },
    { id: 2, title: "Poll 2", description: "Poll 2 description", upvotes: 8, downvotes: 2 },
    { id: 3, title: "Poll 3", description: "Poll 3 description", upvotes: 15, downvotes: 3 },
    { id: 4, title: "Poll 4", description: "Poll 4 description", upvotes: 6, downvotes: 4 },
    { id: 5, title: "Poll 5", description: "Poll 5 description", upvotes: 9, downvotes: 5 },
    { id: 6, title: "Poll 6", description: "Poll 6 description", upvotes: 7, downvotes: 6 },
    { id: 7, title: "Poll 7", description: "Poll 7 description", upvotes: 13, downvotes: 1 },
    { id: 8, title: "Poll 8", description: "Poll 8 description", upvotes: 12, downvotes: 7 },
  ]);

  const [selectedPoll, setSelectedPoll] = useState(null);

  const handleVote = (pollId, rank) => {
    // Handle voting logic
    console.log(`Voted on poll ${pollId} with rank ${rank}`);
  };

  const openDialog = (poll) => {
    setSelectedPoll(poll);
  };

  const closeDialog = () => {
    setSelectedPoll(null);
  };

  return (
    <div className={styles.pollingAppContainer}>
      <div className={styles.pollCardsGrid}>
        {polls.map((poll) => (
          <PollCard key={poll.id} poll={poll} onVote={handleVote} onOpenDialog={openDialog} />
        ))}
      </div>

      {selectedPoll && (
        <CardDialog poll={selectedPoll} onClose={closeDialog} onVote={handleVote} />
      )}
    </div>
  );
};

export default PollingApp;
