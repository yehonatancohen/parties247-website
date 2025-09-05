import React, { useState, useCallback } from 'react';
import { useParties } from '../hooks/useParties';
import { scrapePartyDetails } from '../services/geminiService';
import { Party } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { FireIcon, PartyPopperIcon } from './Icons';

const AdminDashboard: React.FC = () => {
  const { parties, addParty, deleteParty, toggleHotParty, togglePartyDemand } = useParties();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddParty = useCallback(async () => {
    if (!url.trim() || !url.includes('go-out.co')) {
      setError('Please enter a valid go-out.co URL.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const partyDetails = await scrapePartyDetails(url);
      const newParty: Party = {
        ...partyDetails,
        id: new Date().toISOString() + Math.random(), // Add random number to ensure uniqueness
        originalUrl: url,
        isHot: false,
        demand: 'normal',
      };
      addParty(newParty);
      setUrl('');
    } catch (err) {
      console.error(err);
      setError('Failed to scrape party details. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [url, addParty]);
  
  const sortedParties = [...parties].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-brand-surface p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white">Admin Dashboard</h2>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2 text-brand-secondary">Add New Party</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste go-out.co party URL"
            className="flex-grow bg-gray-800 text-white p-2 rounded-md border border-gray-700 focus:ring-2 focus:ring-brand-primary focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleAddParty}
            disabled={isLoading}
            className="bg-brand-primary text-white font-bold py-2 px-6 rounded-md hover:bg-opacity-80 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? <LoadingSpinner /> : 'Add Party'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-brand-secondary">Manage Parties ({parties.length})</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {sortedParties.map(party => (
            <div key={party.id} className="bg-gray-800 p-3 rounded-md flex justify-between items-center">
              <div className="flex-grow">
                <p className="font-semibold text-white truncate">{party.name}</p>
                <p className="text-sm text-gray-400">{party.location} - {new Date(party.date).toLocaleDateString('he-IL')}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => togglePartyDemand(party.id)}
                  title={party.demand === 'high' ? "Remove from High Demand" : "Add to High Demand"}
                  className="p-1.5 rounded-full transition-colors"
                >
                  <PartyPopperIcon className={`h-5 w-5 ${party.demand === 'high' ? 'text-brand-primary' : 'text-gray-500 hover:text-brand-primary/80'}`} />
                </button>
                 <button
                  onClick={() => toggleHotParty(party.id)}
                  title={party.isHot ? "Remove from Hot Events" : "Add to Hot Events"}
                  className="p-1.5 rounded-full transition-colors"
                >
                  <FireIcon className={`h-5 w-5 ${party.isHot ? 'text-orange-500' : 'text-gray-500 hover:text-orange-400'}`} />
                </button>
                <button
                  onClick={() => deleteParty(party.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;