// utils/db.js
import fs from "fs";
import path from "path";

const usersFilePath = path.join(process.cwd(), "data", "users.json");

export const getUsers = () => {
  try {
    if (!fs.existsSync(usersFilePath)) {
      console.warn("users.json file not found. Returning empty array.");
      return [];
    }
    const data = fs.readFileSync(usersFilePath, "utf-8");
    if (!data.trim()) {
      console.warn("users.json is empty. Returning empty array.");
      return [];
    }
    const users = JSON.parse(data);
    if (!Array.isArray(users)) {
      console.error("Invalid users.json format. Expected an array.");
      return [];
    }
    return users;
  } catch (error) {
    console.error("Error reading users.json:", error);
    return [];
  }
};

export const getUserByEmail = (email) => {
  const users = getUsers();
  if (!users.length) {
    console.warn("No users found in database.");
    return null;
  }
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
};

export const getUserById = (id) => {
  const users = getUsers();
  if (!users.length) {
    console.warn("No users found in database.");
    return null;
  }
  return users.find((user) => user.id === id) || null;
};

export const saveUsers = (users) => {
  try {
    if (!Array.isArray(users)) {
      throw new Error("Provided users data is not an array.");
    }
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing users.json:", error);
    return false;
  }
};
