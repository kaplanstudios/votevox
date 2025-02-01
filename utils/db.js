import fs from "fs";
import path from "path";

const usersFilePath = path.join(process.cwd(), "data", "users.json");

export const getUserByEmail = async (email) => {
  try {
    const usersData = fs.readFileSync(usersFilePath, "utf8");
    const users = JSON.parse(usersData);
    return users.find((user) => user.email === email) || null;
  } catch (error) {
    console.error("Error reading users.json:", error);
    return null;
  }
};
