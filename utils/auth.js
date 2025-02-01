import { useSession, signIn, signOut } from "next-auth/react";

export const useAuth = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return {
    user: session?.user || null,
    loading,
    isAuthenticated: !!session,
    signIn,
    signOut,
  };
};
