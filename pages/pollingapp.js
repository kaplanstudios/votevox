// pages/PollingApp.js

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

  // Check session status and redirect if not logged in
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      setToastMessage("You must be signed in to access the app.");
      setToastType("error");
      router.push("/signin");
    }
  }, [status, session, router]);

  // Fetch polls from API
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

  // Handle vote submission
  const handleVote = async (pollId, selectedOption) => {
    if (!pollId || !selectedOption) {
      console.error("Error: pollId or selected option is missing!");
      return;
    }

    const voteData = { pollId, selectedOption };

    try {
      const response = await fetch(`/api/polls/${pollId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(voteData),
      });
      if (!response.ok) throw new Error("Failed to submit vote");
      console.log("Vote successfully submitted");
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
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

  // Open the "View and Vote" dialog for a selected poll
  const handleViewVote = useCallback((poll) => {
    console.log(`Opening ViewAndVoteDialog for poll id: ${poll.id}`); // Debugging
    setSelectedPoll(poll);
    setIsDialogOpen(true);
  }, []);

  // Close the dialog and clear the selected poll
  const closeDialog = useCallback(() => {
    setSelectedPoll(null);
    setIsDialogOpen(false);
  }, []);

  // Open the Create Poll dialog
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
        <Button
          onClick={handleLogout}
          className="bg-red-600 text-white rounded-[2px] p-2"
        >
          Log Out
        </Button>
        <Button
          onClick={openCreatePollDialog}
          className="bg-blue-600 text-white rounded-[2px] p-2"
        >
          Create Poll
        </Button>
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage("")}
        />
      )}

      <div className={styles.pollList}>
        {polls.map((poll) => (
          <div key={poll.id} className={styles.pollCardWrapper}>
            <PollCard
              poll={poll}
              userId={session?.user?.id}
              onVote={(selectedOption) => handleVote(poll.id, selectedOption)}
              onViewVote={() => handleViewVote(poll)}
            />
          </div>
        ))}
      </div>

      {/* View and Vote Dialog rendered outside of PollCard.js */}
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

      {/* Create Poll Dialog rendered outside of PollCard.js */}
      {isCreatePollDialogOpen && (
        <Dialog isOpen={isCreatePollDialogOpen} onClose={closeCreatePollDialog}>
          <CreatePollDialog onClose={closeCreatePollDialog} />
        </Dialog>
      )}
    </div>
  );
};

export default PollingApp;
