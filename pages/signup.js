// pages/signup.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';

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

    if (password !== confirmPassword) {
      setToastMessage('Passwords do not match');
      setToastType('error');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      setTimeout(() => router.push('/signin'), 2000);
    } catch (error) {
      setToastMessage('An error occurred during sign-up');
      setToastType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="flex flex-col items-center bg-black p-6 rounded-lg w-full max-w-lg">
        {toastMessage && <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" />
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" />
          <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Confirm Password" />
          <Button type="submit" disabled={isLoading}>{isLoading ? '...' : 'Sign Up'}</Button>
        </form>
      </div>
    </div>
  );
};
export default SignUp;