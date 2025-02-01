import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();

  console.log('Navbar Session:', session, 'Status:', status); // Debugging

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <h1 className="text-xl font-bold">Geek Street</h1>
      {status === 'authenticated' ? (
        <div>
          <p>Welcome, {session.user.email}</p>
          <button onClick={() => signOut()} className="ml-4 bg-red-500 px-3 py-1 rounded">
            Logout
          </button>
        </div>
      ) : (
        <p>Please log in</p>
      )}
    </nav>
  );
}
