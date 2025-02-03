import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PollCard from "../components/ui/PollCard";
import pollsData from "../data/polls.json";
import styles from "../styles/PollingApp.module.css";

const PollingApp = () => {
  const { data: session, status } = useSession();
  const [polls, setPolls] = useState(pollsData);

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Please sign in to vote.</div>;

  const handleDialogOpen = (poll) => {
    console.log("Opening poll:", poll.title);
  };

  return (
    <div className={styles.pollingAppContainer}>
      <div className={styles.pollList}>
        {polls.map((poll, index) => (
          <PollCard
            key={poll.id}
            poll={poll}
            userId={session.user.id}
            onOpenDialog={handleDialogOpen}
            index={index}  // Pass the index to identify the first card in each row
          />
        ))}
      </div>
    </div>
  );
};

export default PollingApp;
