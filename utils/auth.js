// utils/auth.js
import bcrypt from "bcryptjs";
import { getUsers } from "./db";

export const authenticateUser = async (email, password) => {
  const users = getUsers();
  if (!users.length) {
    console.warn("No users found in database.");
    return null;
  }

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    console.warn(`User with email ${email} not found.`);
    return null;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    console.warn(`Invalid password for user ${email}.`);
    return null;
  }

  return { id: user.id, email: user.email };
};
