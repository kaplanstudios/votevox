// /pages/polls/index.js
import { useState, useEffect } from 'react';
import { useAuth } from '../../utils/auth'; // Import useAuth hook
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa'; // Up/Downvote icons
import Button from '../../components/ui/Button'; // Default Import
import Toast from '../../components/ui/Toast'; // Default Import
import Card from '../../components/ui/Card'; // Default Import

export default function PollingApp() {
  const { user } = useAuth(); // Get the logged-in user from auth hook
  const [polls, setPolls] = useState([]); // State for polls
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const [ranks, setRanks] = useState({}); // State for user's upvote/downvote data

  // Fetch polls from API on mount
  useEffect(() => {
    if (user) {
      // Fetch all polls
      fetch('/api/polls')
        .then((response) => response.json())
        .then((data) => {
          // Sort polls based on upvotes - downvotes
          const sortedPolls = data.sort((a, b) => {
            const aVotes = (a.upvotes || 0) - (a.downvotes || 0);
            const bVotes = (b.upvotes || 0) - (b.downvotes || 0);
            return bVotes - aVotes;
          });
          setPolls(sortedPolls);
        })
        .catch((error) => {
          console.error('Error fetching polls:', error);
        });

      // Fetch user's rank data based on user ID
      fetch(`/api/ranks/${user.id}`)
        .then((response) => response.json())
        .then((data) => setRanks(data))  // Set the ranks for the user
        .catch((error) => console.error('Error fetching ranks:', error));
    }
  }, [user]);

  const handleVote = (pollId, type) => {
    if (!user) {
      setToastMessage('Please log in to vote');
      setToastType('error');
      return;
    }

    // Check if the user has already voted
    if (ranks[pollId]?.userVotes?.includes(user.id)) {
      setToastMessage('You have already voted on this poll');
      setToastType('warning');
      return;
    }

    // Proceed with vote (upvote or downvote)
    fetch(`/api/polls/${pollId}/vote`, {
      method: 'PUT',
      body: JSON.stringify({
        pollId,
        userId: user.id,
        voteType: type,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        // Update ranks and polls
        setRanks((prevRanks) => ({
          ...prevRanks,
          [pollId]: { userVotes: [...(prevRanks[pollId]?.userVotes || []), user.id] },
        }));
        setPolls((prevPolls) =>
          prevPolls.map((poll) =>
            poll.id === pollId
              ? {
                  ...poll,
                  [type === 'up' ? 'upvotes' : 'downvotes']: poll[type === 'up' ? 'upvotes' : 'downvotes'] + 1,
                }
              : poll
          )
        );
        setToastMessage('Your vote has been recorded!');
        setToastType('success');
      })
      .catch((error) => {
        console.error('Error updating vote:', error);
        setToastMessage('An error occurred while voting');
        setToastType('error');
      });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold text-white text-center mb-6">Polling App</h1>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {polls.map((poll) => (
          <Card key={poll.id} className="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-between h-full">
            <h2 className="text-xl font-bold text-white">{poll.title}</h2>
            <p className="text-gray-400 mb-4">{poll.description}</p>

            <div className="flex flex-col justify-between mt-4 flex-grow">
              <Button
                onClick={() => {}}
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                View and Vote
              </Button>

              <div className="flex justify-end space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <FaThumbsUp
                    className={`cursor-pointer ${ranks[poll.id]?.userVotes?.includes(user.id) ? 'text-green-500' : 'text-gray-400'}`}
                    onClick={() => handleVote(poll.id, 'up')}
                  />
                  <span className="text-sm">{poll.upvotes || 0}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <FaThumbsDown
                    className={`cursor-pointer ${ranks[poll.id]?.userVotes?.includes(user.id) ? 'text-red-500' : 'text-gray-400'}`}
                    onClick={() => handleVote(poll.id, 'down')}
                  />
                  <span className="text-sm">{poll.downvotes || 0}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-gray-500 text-xs text-left">
              Poll closes: {new Date(poll.closingDate).toLocaleString()}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
