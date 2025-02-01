import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';  // Import bcryptjs to hash passwords

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');  // Assuming you have a 'data' folder

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Extract user data from the request
      const { email, password } = req.body;

      // Generate a new UUID for the user
      const newUserId = uuidv4();

      // Hash the password before saving it (salt rounds = 10)
      const hashedPassword = await bcrypt.hash(password, 10);

      // Read the current users from the users.json file
      const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

      // Create the new user object with hashed password
      const newUser = {
        id: newUserId,
        email,
        password: hashedPassword,  // Save the hashed password
      };

      // Add the new user to the existing users array
      users.push(newUser);

      // Save the updated users array back to the file
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

      // Send a success response with user ID (for reference, for example)
      res.status(200).json({ message: 'User created successfully', userId: newUserId });
    } catch (error) {
      console.error('Error saving user data:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  } else {
    // Handle any non-POST requests
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
