import { getUserByEmail } from "../../../utils/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Extracting email and password from request body
  const { email, password } = req.body;

  console.log("Received request with:", req.body);

  // Check if email or password is missing
  if (!email || !password) {
    console.log("Error: Missing email or password.");
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Attempt to retrieve user from the database
    const user = await getUserByEmail(email);

    // If no user found, respond with an error
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("User found:", user.email);

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Invalid password for:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // If successful, return the user data or session token (modify as needed)
    return res.status(200).json({ message: "Login successful", user });
    
  } catch (error) {
    // If there is a server error, log it
    console.error("Error during authentication:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
