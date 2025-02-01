import fs from 'fs/promises';
import path from 'path';

const SIGNATURES_DIR = path.join(process.cwd(), 'data', 'signatures');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { signature, uuid } = req.body;

    if (!signature || !uuid) {
      console.error('Missing signature or uuid in request body');
      return res.status(400).json({ error: 'Missing signature or uuid' });
    }

    const filePath = path.join(SIGNATURES_DIR, `${uuid}.png`);
    const base64Data = signature.replace(/^data:image\/png;base64,/, '');

    try {
      await fs.mkdir(SIGNATURES_DIR, { recursive: true }); // Ensure the directory exists
      await fs.writeFile(filePath, base64Data, 'base64');
      console.log(`Signature saved successfully at ${filePath}`);
      return res.status(201).json({ message: 'Signature saved successfully' });
    } catch (error) {
      console.error('Error saving signature:', error);
      return res.status(500).json({ error: 'Failed to save signature' });
    }
  } else if (req.method === 'GET') {
    const { uuid } = req.query;

    if (!uuid) {
      console.error('Missing uuid in request query');
      return res.status(400).json({ error: 'Missing uuid' });
    }

    const filePath = path.join(SIGNATURES_DIR, `${uuid}.png`);

    try {
      const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

      if (!fileExists) {
        console.error('Signature not found');
        return res.status(404).json({ error: 'Signature not found' });
      }

      const base64Data = await fs.readFile(filePath, 'base64');
      const imageUrl = `data:image/png;base64,${base64Data}`;
      console.log(`Signature fetched successfully from ${filePath}`);
      return res.status(200).json({ imageUrl });
    } catch (error) {
      console.error('Error fetching signature:', error);
      return res.status(500).json({ error: 'Failed to fetch signature' });
    }
  } else {
    console.error('Method not allowed');
    return res.status(405).json({ error: 'Method not allowed' });
  }
}