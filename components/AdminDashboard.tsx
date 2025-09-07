import React, { useState, useCallback } from 'react';
import { useParties } from '../hooks/useParties';
import { Party, Carousel } from '../types';
import LoadingSpinner from './LoadingSpinner';

const TagInput: React.FC<{ tags: string[]; onTagsChange: (tags: string[]) => void }> = ({ tags, onTagsChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        onTagsChange([...tags, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-2">
        {tags.map(tag => (
          <span key={tag} className="bg-jungle-accent text-jungle-deep text-xs font-semibold px-2 py-1 rounded-full flex items-center">
            {tag}
            <button onClick={() => removeTag(tag)} className="mr-1.5 text-jungle-deep hover:text-black text-xs">✖</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a tag and press Enter"
        className="w-full bg-jungle-deep text-white p-1 rounded-md border border-wood-brown text-sm"
      />
    </div>
  );
};


const AdminDashboard: React.FC = () => {
  const { parties, addParty, deleteParty, updateParty, carousels, addCarousel, updateCarousel, deleteCarousel } = useParties();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [newCarouselTitle, setNewCarouselTitle] = useState('');
  const [editingCarousel, setEditingCarousel] = useState<Carousel | null>(null);

  const handleAddParty = useCallback(async () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl || !trimmedUrl.includes('go-out.co')) {
      setError('Please enter a valid go-out.co URL.');
      return;
    }

    // Client-side check for duplicates
    if (parties.some(party => party.originalUrl === trimmedUrl)) {
      setError('This party has already been added.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await addParty(trimmedUrl);
      setUrl('');
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add party.';
      setError(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [url, addParty, parties]);
  
  const handleCreateCarousel = () => {
    if (newCarouselTitle.trim()) {
      addCarousel(newCarouselTitle.trim());
      setNewCarouselTitle('');
    }
  };
  
  const handleUpdateCarouselParties = (partyId: string, isInCarousel: boolean) => {
    if (!editingCarousel) return;
    const newPartyIds = isInCarousel
      ? editingCarousel.partyIds.filter(id => id !== partyId)
      : [...editingCarousel.partyIds, partyId];
    
    const updated = { ...editingCarousel, partyIds: newPartyIds };
    updateCarousel(updated);
    setEditingCarousel(updated);
  };

  const sortedParties = [...parties].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (editingCarousel) {
    const partiesInCarousel = parties.filter(p => editingCarousel.partyIds.includes(p.id));
    const partiesNotInCarousel = parties.filter(p => !editingCarousel.partyIds.includes(p.id));
    
    return (
      <div className="bg-jungle-surface p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
        <button onClick={() => setEditingCarousel(null)} className="text-jungle-accent mb-4">&larr; Back to Dashboard</button>
        <h3 className="text-xl font-bold mb-4 text-white">Editing Carousel: {editingCarousel.title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-jungle-accent mb-2">Parties in this Carousel ({partiesInCarousel.length})</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2 bg-jungle-deep p-2 rounded">
              {partiesInCarousel.map(p => (
                <div key={p.id} className="bg-jungle-surface p-2 rounded flex items-center justify-between">
                  <span className="text-sm truncate text-white">{p.name}</span>
                  <button onClick={() => handleUpdateCarouselParties(p.id, true)} className="text-red-500 text-xs px-2 py-1 rounded hover:bg-red-500/20">Remove</button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-jungle-accent mb-2">Available Parties ({partiesNotInCarousel.length})</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2 bg-jungle-deep p-2 rounded">
              {partiesNotInCarousel.map(p => (
                <div key={p.id} className="bg-jungle-surface p-2 rounded flex items-center justify-between">
                  <span className="text-sm truncate text-white">{p.name}</span>
                  <button onClick={() => handleUpdateCarouselParties(p.id, false)} className="text-green-500 text-xs px-2 py-1 rounded hover:bg-green-500/20">Add</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-jungle-surface p-6 rounded-lg shadow-lg max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-display mb-6 text-white">Admin Dashboard</h2>
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2 text-jungle-accent">Add New Party</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste go-out.co party URL" className="flex-grow bg-jungle-deep text-white p-2 rounded-md border border-wood-brown focus:ring-2 focus:ring-jungle-lime focus:outline-none" disabled={isLoading} />
            <button onClick={handleAddParty} disabled={isLoading} className="bg-jungle-lime text-jungle-deep font-bold py-2 px-6 rounded-md hover:bg-opacity-80 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex justify-center items-center">
              {isLoading ? <LoadingSpinner /> : 'Add Party'}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-jungle-accent">Manage Parties ({parties.length})</h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {sortedParties.map(party => (
              <div key={party.id} className="bg-jungle-deep p-3 rounded-md">
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <p className="font-semibold text-white truncate">{party.name}</p>
                    <p className="text-sm text-jungle-text/60">{party.location} - {new Date(party.date).toLocaleDateString('he-IL')}</p>
                  </div>
                  <button onClick={() => deleteParty(party.id)} className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm ml-2 flex-shrink-0">
                    Delete
                  </button>
                </div>
                <div className="mt-2 pt-2 border-t border-wood-brown">
                  <TagInput tags={party.tags} onTagsChange={(newTags) => updateParty({ ...party, tags: newTags })} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 text-jungle-accent">Manage Homepage Carousels</h3>
          <div className="mb-4">
            <div className="flex gap-2">
              <input type="text" value={newCarouselTitle} onChange={(e) => setNewCarouselTitle(e.target.value)} placeholder="New carousel title" className="flex-grow bg-jungle-deep text-white p-2 rounded-md border border-wood-brown" />
              <button onClick={handleCreateCarousel} className="bg-jungle-accent text-jungle-deep font-bold py-2 px-4 rounded-md hover:bg-opacity-80">Create</button>
            </div>
          </div>
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
            {carousels.map(carousel => (
              <div key={carousel.id} className="bg-jungle-deep p-3 rounded-md flex justify-between items-center">
                <div>
                  <p className="font-semibold text-white">{carousel.title}</p>
                  <p className="text-sm text-jungle-text/60">{carousel.partyIds.length} parties</p>
                </div>
                <div className="flex items-center gap-2">
                   <button onClick={() => setEditingCarousel(carousel)} className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm">Edit</button>
                  <button onClick={() => deleteCarousel(carousel.id)} className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;