// pages/signin.js
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Base URL for constructing callback URLs
  const baseUrl = process.env.NEXT_PUBLIC_NEXTAUTH_URL || "http://localhost:3000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: `${baseUrl}/pollingapp`,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    // Redirect using the returned callback URL, if provided
    router.push(result?.url || `${baseUrl}/pollingapp`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-3 py-2 border rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-3 py-2 border rounded-md"
        />
        <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded-md">
          Sign In
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}

// If already authenticated, redirect on the server side.
export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/pollingapp",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
