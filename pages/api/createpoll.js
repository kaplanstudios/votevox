// pages/api/createpoll.js

import fs from 'fs';
import path from 'path';

const pollsFilePath = path.join(process.cwd(), 'data/polls.json');

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const newPoll = req.body;
      const pollsData = JSON.parse(fs.readFileSync(pollsFilePath, 'utf8'));
      pollsData.push(newPoll);
      fs.writeFileSync(pollsFilePath, JSON.stringify(pollsData, null, 2));

      res.status(200).json({ message: 'Poll created successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Error saving poll.' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
