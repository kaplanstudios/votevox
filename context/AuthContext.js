// utils/auth.js

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Add a login function
  const login = async (token) => {
    setUser({ token }); // Or decode token and set user info
    localStorage.setItem('authToken', token);  // Store the token
    router.push('/dashboard');  // Redirect after login
  };

  // Optionally you can add logout functionality too
  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    router.push('/signin');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
