import users from '../data/users.json'; // Import users.json

export const getPreviousVoteSignature = async (userId) => {
  // Simulate fetching the signature UUID from the user's previous vote
  const user = users[userId];
  if (!user || !user.previousVoteSignatureUUID) {
    return null;
  }
  return user.previousVoteSignatureUUID;
};