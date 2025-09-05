
import React, { useState, FormEvent } from 'react';
import { ADMIN_PASSWORD } from '../constants';

interface AuthProps {
  onAuthSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onAuthSuccess();
    } else {
      setError('Incorrect password.');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16">
      <form onSubmit={handleSubmit} className="bg-brand-surface p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-bold mb-6 text-white">Admin Access</h2>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-800 text-white p-2 rounded-md border border-gray-700 focus:ring-2 focus:ring-brand-primary focus:outline-none"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button type="submit" className="w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-80 transition-colors">
          Login
        </button>
      </form>
    </div>
  );
};

export default Auth;
