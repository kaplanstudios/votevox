import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Toast from "../components/ui/Toast";
import { useSession } from "next-auth/react"; // Assuming you're using NextAuth for session management

export default function PollingApp() {
  const { data: session, status } = useSession(); // Using NextAuth's useSession hook
  const [polls, setPolls] = useState([]);
  const [ranks, setRanks] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If session is loading, don't do anything
    if (status === "loading") return;

    // If no session (user not logged in), redirect to signin page
    if (!session) {
      router.push("/signin");
    } else {
      // Fetch polls and ranks when session is available
      fetchPollsAndRanks();
    }
  }, [session, status, router]); // Dependency on session, status, and router for reactivity

  const fetchPollsAndRanks = async () => {
    try {
      setIsLoading(true);
      // Fetch polls
      const pollResponse = await fetch("/api/polls");
      const pollsData = await pollResponse.json();
      setPolls(pollsData);

      // Fetch user-specific ranks
      const rankResponse = await fetch(`/api/ranks?userId=${session.user.id}`);
      const ranksData = await rankResponse.json();
      setRanks(ranksData);
    } catch (error) {
      setToastMessage("Failed to load polls or ranks.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = (pollId, type) => {
    if (!session) {
      setToastMessage("You must be logged in to vote.");
      return;
    }

    if (ranks?.votes?.[pollId] === type) {
      setToastMessage(`You already ${type === 1 ? "upvoted" : "downvoted"} this poll.`);
      return;
    }

    // Send the vote to the backend
    fetch(`/api/polls/${pollId}/vote`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: session.user.id,
        voteType: type,
      }),
    })
      .then((res) => res.json())
      .then((updatedPoll) => {
        setRanks((prev) => ({
          ...prev,
          votes: { ...prev.votes, [pollId]: type },
        }));
        setPolls((prev) =>
          prev.map((poll) => (poll.id === pollId ? updatedPoll : poll))
        );
        setToastMessage("Vote recorded!");
      })
      .catch(() => setToastMessage("Error submitting vote."));
  };

  return (
    <div className="flex flex-col min-h-screen bg-navy text-white">
      <nav className="w-full py-4 text-center text-xl font-semibold bg-darkGray shadow-lg">
        Polling App
      </nav>

      <div className="flex-grow flex justify-center items-center p-6">
        <div className="w-full max-w-4xl">
          <h1 className="text-4xl font-bold text-center mb-8">Current Polls</h1>

          {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}

          {isLoading ? (
            <p className="text-center">Loading...</p>
          ) : !session ? (
            <p className="text-center text-lg text-gray-400">
              You are not logged in.{" "}
              <button
                onClick={() => router.push("/signin")}
                className="text-lightBlue underline"
              >
                Log in
              </button>{" "}
              to view and vote on polls.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {polls.map((poll) => (
                <Card key={poll.id} className="p-6 bg-darkGray rounded-lg shadow-md transition hover:shadow-lg">
                  <h2 className="text-xl font-bold text-lightBlue">{poll.title}</h2>
                  <p className="text-gray-400 mb-4">{poll.description}</p>
                  <p className="text-xs text-gray-500">Poll closes: {new Date(poll.closingDate).toLocaleString()}</p>

                  <div className="mt-4 flex justify-between">
                    <div className="flex items-center space-x-2">
                      <FaThumbsUp
                        className={`cursor-pointer text-lg ${
                          ranks?.votes?.[poll.id] === 1 ? "text-lightBlue" : "text-gray-500"
                        }`}
                        onClick={() => handleVote(poll.id, 1)}
                      />
                      <span>{poll.upvotes}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaThumbsDown
                        className={`cursor-pointer text-lg ${
                          ranks?.votes?.[poll.id] === -1 ? "text-lightBlue" : "text-gray-500"
                        }`}
                        onClick={() => handleVote(poll.id, -1)}
                      />
                      <span>{poll.downvotes}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
