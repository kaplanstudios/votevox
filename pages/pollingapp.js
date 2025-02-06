// pages/pollingapp.js

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PollCard from "../components/ui/PollCard";
import Button from "../components/ui/Button";
import Toast from "../components/ui/Toast";
import CreatePoll from "./createpoll";
import Dialog from "../components/ui/Dialog";
import pollsData from "../data/polls.json";
import styles from "../styles/PollingApp.module.css";

const PollingApp = () => {
  const { data: session, status } = useSession();
  const [polls, setPolls] = useState(pollsData);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const router = useRouter();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Please sign in to vote.</div>;

  const handleCreatePoll = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const handlePollCreated = (newPoll) => {
    setPolls((prevPolls) => [...prevPolls, newPoll]);
    setIsCreateDialogOpen(false);
  };

  return (
    <div className={styles.pollingAppContainer}>
      <div className={styles.header}>
        <Button onClick={handleCreatePoll}>Create Poll</Button>
        <Button onClick={() => router.push('/signin')}>Log Out</Button>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage("")} />
      )}

      <div className={styles.pollList}>
        {polls.map((poll) => (
          <PollCard key={poll.id} poll={poll} userId={session.user.id} />
        ))}
      </div>

      {isCreateDialogOpen && (
        <Dialog onClose={handleCloseDialog}>
          <CreatePoll onPollCreated={handlePollCreated} />
        </Dialog>
      )}
    </div>
  );
};

export default PollingApp;
