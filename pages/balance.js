import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/auth'; // Import useAuth hook
import tokensData from '../data/tokens.json'; // Import the mock tokens data
import Card from '../components/ui/Card'; // Default Import
import Toast from '../components/ui/Toast'; // Default Import

export default function Balance() {
  const { user } = useAuth(); // Get the logged-in user from auth hook
  const [balance, setBalance] = useState(null); // Store balance
  const [error, setError] = useState(''); // Store any error messages
  const [toastMessage, setToastMessage] = useState(''); // Toast message
  const [toastType, setToastType] = useState('info'); // Toast type (info, success, error)
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/signin'); // Redirect to signin if no user is logged in
    } else {
      // Find the logged-in user's balance from the tokens mock DB
      const userBalance = tokensData.find((token) => token.id === user.id);
      if (userBalance) {
        setBalance(userBalance.balance); // Set the user's balance
      } else {
        setError('Balance not found for this user');
      }
    }
  }, [user, router]); // Re-run the effect if user or router changes

  if (!user) return <p>Loading...</p>; // Show loading if no user is found

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-800 p-4">
      <Card className="bg-white p-6 rounded-[2px] shadow-lg w-full sm:w-96">
        <h2 className="text-2xl text-center mb-6 text-white">Your Balance</h2>

        {toastMessage && (
          <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
        )}

        {error && (
          <p className="text-red-500 text-center">{error}</p>
        )}

        {balance !== null ? (
          <p className="text-lg text-center text-blue-600">
            <span text-white>Balance: </span><span className="font-bold">{balance} VOTE tokens</span>
          </p>
        ) : (
          <p className="text-center text-gray-600">Fetching your balance...</p>
        )}
      </Card>
    </div>
  );
}
