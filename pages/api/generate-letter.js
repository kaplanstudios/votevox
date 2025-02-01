// pages/api/generate-letter.js
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handler(req, res) {
  if (req.method === 'POST') {
    const { pollData, voteData, tone } = req.body;

    try {
      const prompt = `Generate a letter to an official based on the following poll and vote details:
        Poll Title: ${pollData.title}
        Poll Description: ${pollData.description}
        Vote Option: ${voteData.optionText}
        Tone: ${tone}

        Letter:`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
      });

      const letter = response.choices[0].message.content.trim();

      res.status(200).json({ letter });
    } catch (error) {
      console.error('Error generating letter:', error);
      res.status(500).json({ error: 'Failed to generate letter' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

export { handler };
