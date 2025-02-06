import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { pollData } = req.body;

    // Read the existing polls from the JSON file
    const filePath = path.join(process.cwd(), 'data/polls.json');
    const polls = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Append the new poll data
    polls.push(pollData);

    // Write the updated polls back to the JSON file
    fs.writeFileSync(filePath, JSON.stringify(polls, null, 2));

    res.status(201).json({ message: 'Poll created successfully' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
