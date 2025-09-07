import React, { useState, FormEvent } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface AuthProps {
  onAuthSuccess: (key: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoading(true);

    // Simulate a small delay for better UX, then treat the password as the secret key.
    // The key's validity will be checked by the first protected API call.
    setTimeout(() => {
        onAuthSuccess(password);
    }, 500);
  };

  return (
    <div className="max-w-sm mx-auto mt-16">
      <form onSubmit={handleSubmit} className="bg-jungle-surface p-8 rounded-lg shadow-lg border border-wood-brown/50">
        <h2 className="text-center text-3xl font-display mb-6 text-white">Admin Access</h2>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-jungle-text/80 mb-2">Secret Key</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-jungle-deep text-white p-2 rounded-md border border-wood-brown focus:ring-2 focus:ring-jungle-lime focus:outline-none"
            disabled={isLoading}
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-jungle-lime text-jungle-deep font-bold py-2 px-4 rounded-md hover:bg-opacity-80 transition-colors flex justify-center items-center h-10"
          disabled={isLoading || !password.trim()}
        >
          {isLoading ? <LoadingSpinner /> : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Auth;
