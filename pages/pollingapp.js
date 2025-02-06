import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PollCard from "../components/ui/PollCard";
import Button from "../components/ui/Button";
import Toast from "../components/ui/Toast";
import CardDialog from "../components/ui/CardDialog";
import Dialog from "../components/ui/Dialog";
import CreatePollDialog from "../components/ui/CreatePollDialog"; // Import the new component for creating a poll
import pollsData from "../data/polls.json";
import styles from "../styles/PollingApp.module.css"; // Corrected import path
import cardDialogStyles from "../styles/components/ui/CardDialog.module.css"; // Corrected import path

const PollingApp = () => {
  const { data: session, status } = useSession();
  const [polls, setPolls] = useState(pollsData);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreatePollDialogOpen, setIsCreatePollDialogOpen] = useState(false); // State for Create Poll Dialog
  const [selectedPoll, setSelectedPoll] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/signin");
  }, [status, session, router]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        console.log("Fetching polls from API...");
        const response = await fetch("/api/polls");
        if (!response.ok) throw new Error("Failed to fetch polls");
        const data = await response.json();
        setPolls(data);
        console.log("Polls loaded:", data);
      } catch (error) {
        console.error("Error fetching polls:", error);
        setToastMessage("Error loading polls.");
        setToastType("error");
      }
    };
    fetchPolls();
  }, []);

  useEffect(() => {
    console.log("Re-rendering due to state update:", { isDialogOpen, selectedPoll });
  }, [isDialogOpen, selectedPoll]);

  const handleVote = async (pollId, optionId) => {
    try {
      console.log(`Submitting vote for poll ${pollId}, option ${optionId}`);
      const response = await fetch(`/api/polls/${pollId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user?.id, optionId }),
      });

      if (!response.ok) throw new Error("Failed to vote");

      setToastMessage("Your vote has been cast successfully!");
      setToastType("success");
    } catch (error) {
      console.error("Error submitting vote:", error);
      setToastMessage("Error submitting vote.");
      setToastType("error");
    }
  };

  const handleLogout = async () => {
    try {
      console.log("Logging out user...");
      await fetch("/api/logout", { method: "POST" });
      setToastMessage("Successfully logged out!");
      setToastType("success");
      setTimeout(() => router.push("/signin"), 2000);
    } catch (error) {
      console.error("Logout failed:", error);
      setToastMessage("Failed to log out");
      setToastType("error");
    }
  };

  const handleViewVote = (poll) => {
    console.log("Opening dialog for poll:", poll);
    setSelectedPoll(poll);
    setIsDialogOpen((prev) => {
      console.log("Previous state:", prev);
      return true;
    });
  };

  const closeDialog = () => {
    console.log("Closing dialog");
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
      <div className={styles.header}>
        <Button onClick={handleLogout} className="bg-red-600 text-white rounded-[2px] p-2">
          Log Out
        </Button>
        {/* Add Create Poll button */}
        <Button onClick={openCreatePollDialog} className="bg-blue-600 text-white rounded-[2px] p-2">
          Create Poll
        </Button>
      </div>

      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage("")} />}

      <div className={styles.pollList}>
        {polls.map((poll) => (
          <div key={poll.id} className={styles.pollCardWrapper}>
            <PollCard
              poll={poll}
              userId={session?.user?.id}
              onVote={handleVote}
              onViewVote={() => handleViewVote(poll)}
            />
          </div>
        ))}
      </div>

      {isDialogOpen && selectedPoll && (
        <Dialog isOpen={isDialogOpen} onClose={closeDialog}>
          <CardDialog poll={selectedPoll} onClose={closeDialog} onVote={handleVote} className={cardDialogStyles.dialogContent} />
        </Dialog>
      )}

      {/* Create Poll Dialog */}
      {isCreatePollDialogOpen && (
        <Dialog isOpen={isCreatePollDialogOpen} onClose={closeCreatePollDialog}>
          <CreatePollDialog onClose={closeCreatePollDialog} />
        </Dialog>
      )}
    </div>
  );
};

export default PollingApp;
