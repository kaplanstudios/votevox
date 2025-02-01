import { createContext, useContext, useState } from 'react';

// Create a context to hold the loading state
const LoadingContext = createContext();

// Create a custom hook to use the loading context
export const useLoading = () => useContext(LoadingContext);

// Create a provider to wrap your app and manage global loading state
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
