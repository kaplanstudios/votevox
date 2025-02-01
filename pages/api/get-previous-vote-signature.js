import { getPreviousVoteSignature } from '../../utils/signature';

export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const signatureUUID = await getPreviousVoteSignature(userId);
    if (!signatureUUID) {
      return res.status(404).json({ error: 'Signature not found' });
    }
    res.status(200).json({ signatureUUID });
  } catch (error) {
    console.error('Error fetching previous vote signature:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}