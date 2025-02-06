import React, { useState } from "react";
import { useSession } from "next-auth/react";
import PollCard from "../components/ui/PollCard";
import pollsData from "../data/polls.json";
import styles from "../styles/PollingApp.module.css";

const PollingApp = () => {
  const { data: session, status } = useSession();
  const [polls] = useState(pollsData);
  const [fadingPollId, setFadingPollId] = useState(null);
  const [activePoll, setActivePoll] = useState(null);

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Please sign in to vote.</div>;

  const handleDialogOpen = (poll) => {
    setFadingPollId(poll.id);
    // Wait 3 seconds for the card content to fade out before opening modal
    setTimeout(() => {
      setActivePoll(poll);
      setFadingPollId(null);
    }, 3000);
  };

  const handleCancel = () => {
    setActivePoll(null);
  };

  const handleSaveVote = () => {
    // Insert save logic if needed; then close the modal.
    setActivePoll(null);
  };

  return (
    <div className={styles.pollingAppContainer}>
      <div className={`${styles.pollList} ${activePoll ? styles.blurBackground : ""}`}>
        {polls.map((poll, index) => (
          <PollCard
            key={poll.id}
            poll={poll}
            userId={session.user.id}
            onOpenDialog={handleDialogOpen}
            index={index}
            fadeOut={fadingPollId === poll.id}
          />
        ))}
      </div>

      {activePoll && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalInner}>
              {/* Render the active poll card in modal mode */}
              <PollCard
                poll={activePoll}
                userId={session.user.id}
                isActive={true}
                onCancel={handleCancel}
                onSave={handleSaveVote}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PollingApp;
