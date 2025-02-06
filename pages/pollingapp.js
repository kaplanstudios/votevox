import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router"; 
import PollCard from "../components/ui/PollCard";
import Button from "../components/ui/Button";
import Toast from "../components/ui/Toast";
import Dialog from "../components/ui/Dialog";
import CreatePollDialog from "../components/ui/CreatePollDialog"; 
import ViewAndVoteDialog from "../components/ui/ViewAndVoteDialog"; 
import pollsData from "../data/polls.json";
import styles from "../styles/PollingApp.module.css"; 

const PollingApp = () => {
  const { data: session, status } = useSession();
  const [polls, setPolls] = useState(pollsData);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreatePollDialogOpen, setIsCreatePollDialogOpen] = useState(false); 
  const [selectedPoll, setSelectedPoll] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/signin"); 
  }, [status, session, router]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch("/api/polls");
        if (!response.ok) throw new Error("Failed to fetch polls");
        const data = await response.json();
        setPolls(data);
      } catch (error) {
        console.error("Error fetching polls:", error);
        setToastMessage("Error loading polls.");
        setToastType("error");
      }
    };
    fetchPolls();
  }, []);

  const handleVote = async (pollId, selectedOption) => {
    if (!pollId || !selectedOption) return;

    const voteData = { pollId, selectedOption };
    try {
      const response = await fetch(`/api/polls/${pollId}/vote`, {
        method: "POST",
        body: JSON.stringify(voteData),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setToastMessage("Your vote has been counted!");
        setToastType("success");
      } else {
        setToastMessage("Failed to vote.");
        setToastType("error");
      }
    } catch (error) {
      setToastMessage("Error during voting.");
      setToastType("error");
    }
  };

  const handleViewVote = useCallback((poll) => {
    setSelectedPoll(poll);
    setIsDialogOpen(true);
  }, []);

  const closeDialog = () => {
    setSelectedPoll(null);
    setIsDialogOpen(false);
  };

  const openCreatePollDialog = () => {
    setIsCreatePollDialogOpen(true);
  };

  const closeCreatePollDialog = () => {
    setIsCreatePollDialogOpen(false);
  };

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Please sign in to vote.</div>;

  return (
    <div className={styles.pollingAppContainer}>
      {/* Toast Notifications */}
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage("")} />
      )}

      {/* Poll List */}
      <div className={styles.pollsContainer}>
        {polls.map((poll, index) => (
          <div key={poll.id} className={styles.pollCardWrapper}>
            <PollCard
              poll={poll}
              userId={session?.user.id || ""}
              onVote={(selectedOption) => handleVote(poll.id, selectedOption)}
              onViewVote={handleViewVote}
              index={index}
            />
          </div>
        ))}
      </div>

      {/* Dialog for View and Vote */}
      {isDialogOpen && selectedPoll && (
        <Dialog isOpen={isDialogOpen} onClose={closeDialog}>
          <ViewAndVoteDialog
            poll={selectedPoll}
            userId={session?.user?.id}
            onClose={closeDialog}
            onVote={handleVote}
          />
        </Dialog>
      )}

      {/* Create Poll Dialog */}
      {isCreatePollDialogOpen && (
        <Dialog isOpen={isCreatePollDialogOpen} onClose={closeCreatePollDialog}>
          <CreatePollDialog onClose={closeCreatePollDialog} />
        </Dialog>
      )}

      {/* Create Poll Button */}
      <Button
        onClick={openCreatePollDialog}
        className={styles.createPollButton}
      >
        Create Poll
      </Button>
    </div>
  );
};

export default PollingApp;
