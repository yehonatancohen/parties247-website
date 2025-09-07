

import React, { useState, FormEvent } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface AuthProps {
  onAuthSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a network request for authentication
    setTimeout(() => {
        // In a real deployed app, process.env.ADMIN_PASSWORD would be checked on the server.
        // The build tool replaces `process.env.ADMIN_PASSWORD` with its value during the build process.
        if (password === process.env.ADMIN_PASSWORD) {
            onAuthSuccess();
        } else {
            setError('Incorrect password.');
            setIsLoading(false);
        }
    }, 500);
  };

  return (
    <div className="max-w-sm mx-auto mt-16">
      <form onSubmit={handleSubmit} className="bg-jungle-surface p-8 rounded-lg shadow-lg border border-wood-brown/50">
        <h2 className="text-center text-3xl font-display mb-6 text-white">Admin Access</h2>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-jungle-text/80 mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-jungle-deep text-white p-2 rounded-md border border-wood-brown focus:ring-2 focus:ring-jungle-lime focus:outline-none"
            disabled={isLoading}
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button 
          type="submit" 
          className="w-full bg-jungle-lime text-jungle-deep font-bold py-2 px-4 rounded-md hover:bg-opacity-80 transition-colors flex justify-center items-center h-10"
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner /> : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Auth;