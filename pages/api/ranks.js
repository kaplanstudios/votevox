import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ranksFile = join(process.cwd(), 'data', 'ranks.json');
const usersFile = join(process.cwd(), 'data', 'users.json');
const pollsFile = join(process.cwd(), 'data', 'polls.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'You must be logged in to vote' });
  }

  const { pollId, rank } = req.body;

  if (!pollId || !rank) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  const ranks = JSON.parse(readFileSync(ranksFile, 'utf8'));
  const users = JSON.parse(readFileSync(usersFile, 'utf8'));
  const polls = JSON.parse(readFileSync(pollsFile, 'utf8'));

  const user = users.find((user) => user.id === session.user.id);
  const poll = polls.find((poll) => poll.id === pollId);

  if (!user || !poll) {
    return res.status(404).json({ message: 'User or poll not found' });
  }

  const existingRank = ranks.find((rank) => rank.userId === user.id && rank.pollId === pollId);

  if (existingRank) {
    existingRank.rank = rank;
  } else {
    ranks.push({ userId: user.id, pollId, rank });
  }

  writeFileSync(ranksFile, JSON.stringify(ranks));

  return res.status(201).json({ message: 'Rank updated successfully' });
}