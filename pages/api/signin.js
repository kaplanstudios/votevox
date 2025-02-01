import { getUserByEmail } from '../../utils/db'; // Ensure the correct path is used
import { compare } from 'bcryptjs'; // Ensure bcryptjs is being used for password comparison
import { signIn } from 'next-auth/react'; // For handling NextAuth

export default async function handler(req, res) {
  // Check that the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Destructure email and password from the request body
  const { email, password } = req.body;

  try {
    // Get user by email from the mock database
    const user = getUserByEmail(email);
    
    // If the user does not exist, return an error
    if (!user) {
      return res.status(404).json({ message: 'User not found', type: 'error' });
    }

    // Compare the provided password with the stored hashed password using bcrypt
    const isValid = await compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid password', type: 'error' });
    }

    // If everything is correct, return a success response
    return res.status(200).json({ message: 'Successfully signed in!', type: 'success' });
  } catch (error) {
    // Handle any unexpected errors
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', type: 'error' });
  }
}
