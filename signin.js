import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Auth.module.css';
import Input from '../components/ui/Input';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push('/pollingapp');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to sign in.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className={styles.container}>
      {/* Center the header and input fields */}
      <header className="flex flex-col justify-center items-center h-screen">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Ballotbox</h1>
          <p className="text-lg">Intelligent democracy for the world</p>
        </div>

        {/* Input Form */}
        <div className="flex flex-col items-center w-full max-w-xs">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="flex space-x-2 justify-center">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-40 py-2" // Adjust size as needed
                placeholder="Email"
              />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-40 py-2" // Adjust size as needed
                placeholder="Password"
              />
            </div>
            <button type="submit" className="w-40 py-2 text-white bg-black border-2 border-black rounded-none mt-4">
              Sign In
            </button>
          </form>
        </div>
      </header>
    </div>
  );
}
