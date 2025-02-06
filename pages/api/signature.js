import fs from 'fs/promises';
import path from 'path';

const SIGNATURES_DIR = path.join(process.cwd(), 'data', 'signatures');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Received POST request to /api/signature');

    try {
      const { signature, uuid } = req.body;

      if (!signature || !uuid) {
        console.error('Error: Missing signature or uuid in request body', { signature, uuid });
        return res.status(400).json({ error: 'Missing signature or uuid' });
      }

      // Define the file path using the provided UUID
      const filePath = path.join(SIGNATURES_DIR, `${uuid}.png`);
      const base64Data = signature.replace(/^data:image\/png;base64,/, '');

      // Ensure the directory exists
      await fs.mkdir(SIGNATURES_DIR, { recursive: true });
      await fs.writeFile(filePath, base64Data, 'base64');

      console.log(`Signature saved successfully at ${filePath}`);
      return res.status(201).json({ message: 'Signature saved successfully', signatureUrl: `/data/signatures/${uuid}.png` });

    } catch (error) {
      console.error('Error processing signature upload:', error);
      return res.status(500).json({ error: 'Failed to save signature' });
    }
  } else {
    console.error('Error: Method not allowed');
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
