// server.js

const express = require('express');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();  // Next.js handler

app.prepare().then(() => {
  const server = express();

  // Serve signature images from "data/signatures" directory
  server.use('/signatures', express.static(path.join(__dirname, 'data', 'signatures')));

  // API route to generate letter with signature
  server.get('/api/generate-letter', (req, res) => {
    const letterContent = 'Dear [Recipient],\n\nThis is your personalized letter.\n\nBest Regards,\n[Your Name]';
    const signatureUrl = '/signatures/signature1.png'; // Provide the correct signature path

    // Send the generated letter and the signature image URL
    res.json({
      letter: letterContent,
      signatureUrl: signatureUrl
    });
  });

  // All other requests are handled by Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start the server on port 3000
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
