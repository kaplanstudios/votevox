import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await fs.access(USERS_FILE).catch(() => fs.writeFile(USERS_FILE, '[]'));
    const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf8'));

    if (users.find(user => user.email === email)) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await hash(password, 10);
    const newUser = { id: uuidv4(), email, password: hashedPassword };

    users.push(newUser);
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}