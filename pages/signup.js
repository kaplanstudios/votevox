import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Input from '../components/ui/Input'; // Correct input import
import Button from '../components/ui/Button'; // Correct button import
import Toast from '../components/ui/Toast'; // Correct toast import

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate password match
    if (password !== confirmPassword) {
      setToastMessage('Passwords do not match');
      setToastType('error');
      setIsLoading(false);
      return;
    }

    try {
      // Call the API to create the user
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setToastMessage(data.message || 'Sign-up failed');
        setToastType('error');
        setIsLoading(false);
        return;
      }

      setToastMessage('Successfully signed up!');
      setToastType('success');
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    } catch (error) {
      setToastMessage('An error occurred during sign-up');
      setToastType('error');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="flex flex-col items-center bg-black p-6 rounded-lg w-full max-w-lg">
        {/* Error Message */}
        {toastMessage && (
          <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
        )}

        {/* Sign-up Form */}
        <form 
          onSubmit={handleSubmit} 
          className="flex flex-wrap justify-left items-left gap-2 sm:flex-nowrap w-full" 
        >
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full sm:w-30 py-2 px-3 text-xs bg-black text-white border-1 mt-4"
              placeholder="Email"
            />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full sm:w-30 py-2 px-3 text-xs bg-black text-white border-1 mt-4"
              placeholder="Password"
            />
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full sm:w-30 py-2 px-3 text-xs bg-black text-white border-1 mt-4"
              placeholder="Confirm Password"
            />
          </div>

          {/* Button in its own div */}
          <div className="w-full flex justify-center mt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full w-[36px] h-[36px] py-2 text-sm text-white bg-black border border-white ml-14 mt-2"
            >
              {isLoading ? '...' : '↩'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
