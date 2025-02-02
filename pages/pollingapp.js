// pages/pollingapp.js
import { useSession, signOut } from "next-auth/react";
import { getSession } from "next-auth/react";

export default function PollingApp() {
  const { data: session, status } = useSession();

  // Base URL for constructing callback URLs
  const baseUrl = process.env.NEXT_PUBLIC_NEXTAUTH_URL || "http://localhost:3000";

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">Welcome to the Polling App</h1>
      <p className="mt-2 text-lg">You are logged in as {session?.user?.email}</p>
      <button
        onClick={() => signOut({ callbackUrl: `${baseUrl}/signin` })}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
      >
        Logout
      </button>
    </div>
  );
}

// Protect this page with a server-side check
export async function getServerSideProps(context) {
  const session = await getSession(context);

  // If no session, redirect to sign in
  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
