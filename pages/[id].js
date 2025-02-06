import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import ranksData from '../data/ranks.json'; // Mock data for ranks
import PollCard from '../components/ui/PollCard'; // Assuming PollCard is the component to render each poll

export async function getStaticPaths() {
  // Assuming ranksData contains a list of polls with their IDs
  const paths = ranksData.map((rank) => ({
    params: { id: rank.pollId }, // pollId is the dynamic segment in the URL
  }));

  return {
    paths,
    fallback: 'blocking', // This will generate the page on-demand if it doesn't exist
  };
}

export async function getStaticProps({ params }) {
  // Find the poll with the ID from the ranks data
  const poll = ranksData.find((rank) => rank.pollId === params.id);

  if (!poll) {
    return { notFound: true }; // Return a 404 page if no poll is found
  }

  return {
    props: {
      poll,
    },
    revalidate: 60, // Optional revalidation to refresh the data at intervals
  };
}

const PollPage = ({ poll }) => {
  const [pollData, setPollData] = useState(poll);
  const router = useRouter();

  useEffect(() => {
    if (!poll) {
      router.push('/404'); // Redirect to 404 if poll data is not found
    }
  }, [poll, router]);

  return (
    <div>
      <h1>Poll Details</h1>
      <PollCard poll={pollData} userId="someUserId" onOpenDialog={() => {}} /> {/* Add userId accordingly */}
    </div>
  );
};

export default PollPage;
