import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PollCard from "../components/ui/PollCard";
import Button from "../components/ui/Button";
import Toast from "../components/ui/Toast";
import pollsData from "../data/polls.json";
import EmbedDialog from "../components/ui/EmbedDialog";
import Dialog from "../components/ui/Dialog"; // Import Dialog component
import styles from "../styles/PollingApp.module.css";

const PollingApp = () => {
  const { data: session, status } = useSession();
  const [polls] = useState(pollsData);
  const [fadingPollId, setFadingPollId] = useState(null);
  const [activePoll, setActivePoll] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info");
  const [selectedPollId, setSelectedPollId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Prevent dialog from blinking by adding a delay before switching poll views
    if (activePoll && selectedPollId !== activePoll.id) {
      setTimeout(() => {
        setActivePoll(null); // reset activePoll to prevent flickering
      }, 300); // delay for smoother transition
    }
  }, [selectedPollId, activePoll]);

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Please sign in to vote.</div>;

  const handleDialogOpen = (poll) => {
    setFadingPollId(poll.id);
    setTimeout(() => {
      setActivePoll(poll);
      setFadingPollId(null);
    }, 300);
  };

  const handleCancel = () => {
    setActivePoll(null);
  };

  const handleSaveVote = () => {
    setActivePoll(null);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
      });
      setToastMessage('Successfully logged out!');
      setToastType('success');
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    } catch (error) {
      setToastMessage('Failed to log out');
      setToastType('error');
    }
  };

  const handleShare = (pollId) => {
    setSelectedPollId(pollId);
  };

  const closeEmbedDialog = () => {
    setSelectedPollId(null);
  };

  return (
    <div className={styles.pollingAppContainer}>
      <div className={styles.header}>
        <Button onClick={handleLogout} className="bg-red-600 text-white rounded-[2px] p-2">
          Log Out
        </Button>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage("")} />
      )}

      <div className={`${styles.pollList} ${activePoll ? styles.blurBackground : ""}`}>
        {polls.map((poll, index) => (
          <PollCard
            key={poll.id}
            poll={poll}
            userId={session.user.id}
            onOpenDialog={handleDialogOpen} // Ensure this is passed
            onShare={handleShare}
            index={index}
            fadeOut={fadingPollId === poll.id}
          />
        ))}
      </div>

      {/* Fullscreen Dialog is separate from PollCard */}
      {selectedPollId && (
        <Dialog onClose={closeEmbedDialog}>
          <EmbedDialog pollId={selectedPollId} onClose={closeEmbedDialog} />
        </Dialog>
      )}
    </div>
  );
};

export default PollingApp;
