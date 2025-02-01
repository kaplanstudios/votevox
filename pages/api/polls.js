// pages/api/polls.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const pollsFilePath = path.join(process.cwd(), 'data', 'polls.json');
  try {
    const fileData = fs.readFileSync(pollsFilePath, 'utf-8');
    const polls = JSON.parse(fileData);
    res.status(200).json(polls);
  } catch (error) {
    console.error('Error reading polls:', error);
    res.status(500).json({ error: 'Failed to read polls data' });
  }
}
