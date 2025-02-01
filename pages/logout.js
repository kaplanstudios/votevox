import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Card } from '../components/ui'; // Import default components
import { Toast } from '../components/Toast'; // Import default Toast component

const Logout = () => {
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Simulate logging out
      await fetch('/api/logout');
      setToastMessage('Successfully logged out!');
      setToastType('success');
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    } catch (error) {
      setToastMessage('Failed to log out');
      setToastType('error');
    }
  };

  return (
    <div className="relative">
      <Card className="bg-white p-6 rounded-[2px] shadow-lg">
        <h2 className="text-2xl text-center mb-6">Log Out</h2>
        {toastMessage && (
          <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
        )}
        <Button onClick={handleLogout} className="w-full py-2 mt-4 bg-red-600 text-white rounded-[2px]">
          Log Out
        </Button>
      </Card>
    </div>
  );
};

export default Logout;
