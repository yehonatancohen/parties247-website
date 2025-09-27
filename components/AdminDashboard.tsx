
// FIX: Corrected a typo in the React import statement (removed an extra 'a,') which was causing compilation errors.
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useParties } from '../hooks/useParties';
import { Party, Carousel } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { scrapePartyUrlsFromSection } from '../services/scrapeService';
import { SearchIcon, EditIcon, ChevronDownIcon } from './Icons';

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

const EditPartyModal: React.FC<{ party: Party; onClose: () => void; onSave: (updatedParty: Party) => Promise<void>; }> = ({ party, onClose, onSave }) => {
  const [formData, setFormData] = useState<Party>(party);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(party);
  }, [party]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'location.name') {
      setFormData(prev => ({ ...prev, location: { ...prev.location, name: value } }));
    } else if (name === 'date') {
      // Convert local datetime-local string to ISO string
      const localDate = new Date(value);
      const isoString = localDate.toISOString();
      setFormData(prev => ({ ...prev, [name]: isoString }));
    } 
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const getLocalDateTimeString = (isoDate: string) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
    onClose();
  };

  const inputClass = "w-full bg-jungle-deep text-white p-2 rounded-md border border-wood-brown focus:ring-2 focus:ring-jungle-lime focus:outline-none";
  const readOnlyInputClass = `${inputClass} bg-jungle-surface/50 cursor-not-allowed`;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-jungle-surface rounded-lg shadow-2xl w-full max-w-lg h-auto flex flex-col border border-wood-brown">
            <div className="p-4 border-b border-wood-brown flex justify-between items-center">
                <h3 className="text-xl font-display text-white">Edit Party</h3>
                <button onClick={onClose} className="text-2xl text-jungle-text/70 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm text-jungle-text/80 mb-1">Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm text-jungle-text/80 mb-1">Date (Read-only)</label>
                    <input type="datetime-local" id="date" name="date" value={getLocalDateTimeString(formData.date)} className={readOnlyInputClass} required readOnly />
                </div>
                 <div>
                    <label htmlFor="location.name" className="block text-sm text-jungle-text/80 mb-1">Location Name (Read-only)</label>
                    <input type="text" id="location.name" name="location.name" value={formData.location.name} className={readOnlyInputClass} required readOnly />
                    <p className="text-xs text-jungle-text/60 mt-1">Date and Location are set during the initial scraping and cannot be edited.</p>
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm text-jungle-text/80 mb-1">Description</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} className={`${inputClass} h-24`} />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="bg-gray-600 text-white font-bold py-2 px-6 rounded-md hover:bg-opacity-80">Cancel</button>
                    <button type="submit" disabled={isSaving} className="bg-jungle-accent text-jungle-deep font-bold py-2 px-6 rounded-md hover:bg-opacity-80 disabled:bg-gray-500 flex items-center">
                        {isSaving ? <LoadingSpinner /> : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { parties, addParty, deleteParty, updateParty, carousels, addCarousel, deleteCarousel, updateCarouselTitle, addPartyToCarousel, removePartyFromCarousel, defaultReferral, setDefaultReferral } = useParties();
  
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [addMode, setAddMode] = useState<'single' | 'section'>('single');
  const [sectionUrl, setSectionUrl] = useState('');
  const [selectedCarouselId, setSelectedCarouselId] = useState<string>('');
  const [sectionIsLoading, setSectionIsLoading] = useState(false);
  const [sectionError, setSectionError] = useState<string | null>(null);
  const [sectionProgress, setSectionProgress] = useState('');
  
  const [localDefaultReferral, setLocalDefaultReferral] = useState('');
  const [newCarouselTitle, setNewCarouselTitle] = useState('');
  
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [partySearchTerm, setPartySearchTerm] = useState('');
  const [partySort, setPartySort] = useState<{key: 'date' | 'name', direction: 'asc' | 'desc'}>({ key: 'date', direction: 'asc' });

  const [editingCarouselId, setEditingCarouselId] = useState<string | null>(null);
  const [editingCarouselTitle, setEditingCarouselTitle] = useState('');

  useEffect(() => {
    setLocalDefaultReferral(defaultReferral);
  }, [defaultReferral]);
  
  useEffect(() => {
    if (carousels.length > 0 && !selectedCarouselId) {
      setSelectedCarouselId(carousels[0].id);
    }
  }, [carousels, selectedCarouselId]);

  const { activeParties, archivedParties } = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today
    const active: Party[] = [];
    const archived: Party[] = [];
    parties.forEach(p => {
      if (new Date(p.date) < now) {
        archived.push(p);
      } else {
        active.push(p);
      }
    });
    return { activeParties: active, archivedParties: archived };
  }, [parties]);
  
  const filteredAndSortedParties = useMemo(() => {
    let result = activeParties.filter(p =>
      p.name.toLowerCase().includes(partySearchTerm.toLowerCase()) ||
      p.location.name.toLowerCase().includes(partySearchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      if (partySort.key === 'date') {
        const valA = new Date(a.date).getTime();
        const valB = new Date(b.date).getTime();
        return partySort.direction === 'asc' ? valA - valB : valB - valA;
      } else { // 'name'
        const valA = a.name.toLowerCase();
        const valB = b.name.toLowerCase();
        if (valA < valB) return partySort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return partySort.direction === 'asc' ? 1 : -1;
        return 0;
      }
    });

    return result;
  }, [activeParties, partySearchTerm, partySort]);
  
  const sortedArchivedParties = useMemo(() => 
    [...archivedParties].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [archivedParties]
  );
  
  const handleCreateCarousel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCarouselTitle.trim()) {
      await addCarousel(newCarouselTitle.trim());
      setNewCarouselTitle('');
    }
  };

  const handleSaveDefaultReferral = async () => {
    try {
      await setDefaultReferral(localDefaultReferral);
      alert('Default referral code saved!');
    } catch {
      // Error is handled in the context provider
    }
  };
  
  const handleSaveParty = async (updatedParty: Party) => {
    await updateParty(updatedParty);
    setEditingParty(null);
  };

  const handleEditCarousel = (carousel: Carousel) => {
    setEditingCarouselId(carousel.id);
    setEditingCarouselTitle(carousel.title);
  };

  const handleCancelEditCarousel = () => {
    setEditingCarouselId(null);
    setEditingCarouselTitle('');
  };

  const handleSaveCarousel = async (carouselId: string) => {
    if (!editingCarouselTitle.trim()) return;
    await updateCarouselTitle(carouselId, editingCarouselTitle.trim());
    handleCancelEditCarousel();
  };

  const handleAddParty = useCallback(async () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl || !trimmedUrl.includes('go-out.co')) {
      setError('Please enter a valid go-out.co URL.');
      return;
    }
    
    const slugMatch = trimmedUrl.match(/\/event\/([^/?#]+)/);
    const slug = slugMatch ? slugMatch[1] : null;

    if (slug && parties.some(party => party.slug === slug)) {
      setError('This party has already been added.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const newParty = await addParty(trimmedUrl);
      if (defaultReferral) {
        await updateParty({ ...newParty, referralCode: defaultReferral });
      }
      setUrl('');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to add party.');
    } finally {
      setIsLoading(false);
    }
  }, [url, addParty, parties, updateParty, defaultReferral]);

  const handleScrapeSection = async () => {
    if (!sectionUrl.trim() || !selectedCarouselId) {
        setSectionError('Please provide a section URL and select a category.');
        return;
    }
    setSectionIsLoading(true);
    setSectionError(null);
    setSectionProgress('Fetching section page...');

    try {
        const encodedUrl = encodeURIComponent(sectionUrl);
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodedUrl}`;
        
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`Failed to fetch from proxy: ${response.statusText}`);
        const htmlText = await response.text();

        setSectionProgress('Extracting party URLs...');
        const partyUrls = scrapePartyUrlsFromSection(htmlText);

        if (partyUrls.length === 0) {
            setSectionError('No party URLs found on the page.');
            setSectionIsLoading(false);
            return;
        }

        let newPartiesCount = 0;
        for (let i = 0; i < partyUrls.length; i++) {
            const pUrl = partyUrls[i];
            setSectionProgress(`Adding party ${i + 1} of ${partyUrls.length}...`);

            const slugMatch = pUrl.match(/\/event\/([^/?#]+)/);
            const slug = slugMatch ? slugMatch[1] : null;

            if (slug && parties.some(p => p.slug === slug)) {
                console.log(`Skipping already existing party: ${pUrl}`);
                const existingParty = parties.find(p => p.slug === slug);
                if (existingParty) {
                  await addPartyToCarousel(selectedCarouselId, existingParty.id);
                }
                continue;
            }

            try {
                const newParty = await addParty(pUrl);
                newPartiesCount++;
                let partyToUpdate = { ...newParty };

                if (defaultReferral && !partyToUpdate.referralCode) {
                    partyToUpdate.referralCode = defaultReferral;
                    await updateParty(partyToUpdate);
                }
                
                await addPartyToCarousel(selectedCarouselId, newParty.id);

            } catch (addError) {
                console.error(`Failed to add party ${pUrl}:`, addError);
            }
        }
        const carouselTitle = carousels.find(c => c.id === selectedCarouselId)?.title;
        if (newPartiesCount > 0) {
            setSectionProgress(`Done! Added ${newPartiesCount} new parties to "${carouselTitle}".`);
        } else {
            setSectionProgress(`All parties found were already in the system. They have been added to "${carouselTitle}".`);
        }

        setSectionUrl('');

    } catch (err) {
        console.error(err);
        setSectionError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
        setSectionIsLoading(false);
    }
  };
  
  const PartyListItem = ({ party }: { party: Party }) => (
    <div className="bg-jungle-deep p-3 rounded-md">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-grow min-w-0">
          <p className="font-semibold text-white truncate">{party.name}</p>
          <p className="text-sm text-jungle-text/60">{party.location.name} - {new Date(party.date).toLocaleDateString('he-IL')}</p>
          <div className="flex items-center gap-1 mt-1">
            <label htmlFor={`ref-${party.id}`} className="text-xs text-jungle-text/60">Ref:</label>
            <input 
              id={`ref-${party.id}`}
              type="text"
              value={party.referralCode || ''}
              onChange={(e) => updateParty({ ...party, referralCode: e.target.value })}
              placeholder="Default"
              className="w-full bg-jungle-surface text-white p-0.5 rounded-sm border border-wood-brown text-xs"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-1.5 flex-shrink-0">
            <button onClick={() => setEditingParty(party)} className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center gap-1.5">
              <EditIcon className="w-4 h-4"/> Edit
            </button>
            <button onClick={() => deleteParty(party.id)} className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm">
              Delete
            </button>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-wood-brown">
        <TagInput tags={party.tags} onTagsChange={(newTags) => updateParty({ ...party, tags: newTags })} />
      </div>
    </div>
  );

  return (
    <div className="bg-jungle-surface p-6 rounded-lg shadow-lg max-w-7xl mx-auto space-y-8">
      {editingParty && (
          <EditPartyModal 
              party={editingParty}
              onClose={() => setEditingParty(null)}
              onSave={handleSaveParty}
          />
      )}
      <h2 className="text-3xl font-display mb-6 text-white">Admin Dashboard</h2>
      
      {/* Settings Section */}
      <div className="bg-jungle-deep p-4 rounded-md border border-wood-brown/50">
        <h3 className="text-lg font-semibold mb-3 text-jungle-accent">Settings</h3>
        <div className="flex flex-col sm:flex-row gap-2 items-center">
            <label htmlFor="defaultReferral" className="text-sm text-jungle-text/80 flex-shrink-0">Default Referral Code:</label>
            <input 
              id="defaultReferral"
              type="text" 
              value={localDefaultReferral} 
              onChange={(e) => setLocalDefaultReferral(e.target.value)} 
              placeholder="e.g., a312e1e1g1" 
              className="flex-grow bg-jungle-surface text-white p-2 rounded-md border border-wood-brown focus:ring-2 focus:ring-jungle-lime focus:outline-none"
            />
            <button onClick={handleSaveDefaultReferral} className="bg-jungle-accent text-jungle-deep font-bold py-2 px-4 rounded-md hover:bg-opacity-80">Save</button>
        </div>
      </div>

      {/* Add Party Section */}
      <div>
        <div className="flex border-b border-wood-brown mb-4">
          <button onClick={() => setAddMode('single')} className={`py-2 px-4 ${addMode === 'single' ? 'text-jungle-lime border-b-2 border-jungle-lime' : 'text-jungle-text/70'}`}>Add Single Party</button>
          <button onClick={() => setAddMode('section')} className={`py-2 px-4 ${addMode === 'section' ? 'text-jungle-lime border-b-2 border-jungle-lime' : 'text-jungle-text/70'}`}>Add from Section</button>
        </div>

        {addMode === 'single' && (
          <div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste go-out.co party URL" className="flex-grow bg-jungle-deep text-white p-2 rounded-md border border-wood-brown focus:ring-2 focus:ring-jungle-lime focus:outline-none" disabled={isLoading} />
              <button onClick={handleAddParty} disabled={isLoading} className="bg-jungle-lime text-jungle-deep font-bold py-2 px-6 rounded-md hover:bg-opacity-80 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex justify-center items-center">
                {isLoading ? <LoadingSpinner /> : 'Add Party'}
              </button>
            </div>
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          </div>
        )}

        {addMode === 'section' && (
          <div className="space-y-3">
            <input type="url" value={sectionUrl} onChange={(e) => setSectionUrl(e.target.value)} placeholder="Paste go-out.co section URL" className="w-full bg-jungle-deep text-white p-2 rounded-md border border-wood-brown" disabled={sectionIsLoading} />
             <select value={selectedCarouselId} onChange={e => setSelectedCarouselId(e.target.value)} className="w-full bg-jungle-deep text-white p-2 rounded-md border border-wood-brown" disabled={sectionIsLoading || carousels.length === 0}>
                {carousels.length === 0 && <option>Create a category first</option>}
                {carousels.map(c => <option key={c.id} value={c.id}>Add to: {c.title}</option>)}
            </select>
            <button onClick={handleScrapeSection} disabled={sectionIsLoading || !selectedCarouselId} className="w-full bg-jungle-lime text-jungle-deep font-bold py-2 px-6 rounded-md disabled:bg-gray-600 flex justify-center items-center">
              {sectionIsLoading ? <LoadingSpinner /> : 'Scrape & Add Parties'}
            </button>
            {sectionProgress && <p className="text-jungle-accent mt-2 text-sm text-center">{sectionProgress}</p>}
            {sectionError && <p className="text-red-500 mt-2 text-sm text-center">{sectionError}</p>}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-jungle-accent">Manage Active Parties ({activeParties.length})</h3>
          <div className="bg-jungle-deep p-3 rounded-md mb-3 space-y-2 sm:space-y-0 sm:flex sm:justify-between sm:items-center">
            <div className="relative flex-grow">
               <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <SearchIcon className="w-4 h-4 text-gray-400" />
              </div>
              <input type="text" value={partySearchTerm} onChange={e => setPartySearchTerm(e.target.value)} placeholder="Search parties..." className="w-full bg-jungle-surface text-white p-2 pr-9 rounded-md border border-wood-brown text-sm"/>
            </div>
            <div className="flex items-center gap-2 sm:mr-3">
              <span className="text-sm text-jungle-text/70">Sort by:</span>
              <button onClick={() => setPartySort({ key: 'date', direction: partySort.key === 'date' && partySort.direction === 'asc' ? 'desc' : 'asc'})} className={`px-2 py-1 text-sm rounded ${partySort.key === 'date' ? 'bg-jungle-accent text-jungle-deep' : 'bg-jungle-surface'}`}>Date</button>
              <button onClick={() => setPartySort({ key: 'name', direction: partySort.key === 'name' && partySort.direction === 'asc' ? 'desc' : 'asc'})} className={`px-2 py-1 text-sm rounded ${partySort.key === 'name' ? 'bg-jungle-accent text-jungle-deep' : 'bg-jungle-surface'}`}>Name</button>
            </div>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {filteredAndSortedParties.map(party => <PartyListItem key={party.id} party={party} />)}
          </div>
          
          <div className="mt-4">
            <button onClick={() => setShowArchived(!showArchived)} className="w-full text-left text-jungle-accent font-semibold p-2 rounded-md hover:bg-jungle-deep flex items-center justify-between">
              <span>Archived Parties ({archivedParties.length})</span>
              <ChevronDownIcon className={`w-5 h-5 transition-transform ${showArchived ? 'rotate-180' : ''}`} />
            </button>
            {showArchived && (
              <div className="mt-2 space-y-3 max-h-[400px] overflow-y-auto pr-2 border-t-2 border-wood-brown/50 pt-3">
                {sortedArchivedParties.map(party => <PartyListItem key={party.id} party={party} />)}
              </div>
            )}
          </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold mb-2 text-jungle-accent">Manage Homepage Carousels</h3>
             <form onSubmit={handleCreateCarousel} className="flex gap-2 mb-4">
                <input 
                    type="text" 
                    value={newCarouselTitle} 
                    onChange={e => setNewCarouselTitle(e.target.value)} 
                    placeholder="New carousel title" 
                    className="flex-grow bg-jungle-deep text-white p-2 rounded-md border border-wood-brown text-sm"
                />
                <button type="submit" className="bg-jungle-accent text-jungle-deep font-bold px-4 rounded-md text-sm">Create</button>
            </form>
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
            {carousels.map(carousel => {
              const carouselParties = parties.filter(p => carousel.partyIds.includes(p.id));
              return (
              <div 
                key={carousel.id} 
                className="bg-jungle-deep p-3 rounded-md"
              >
                {editingCarouselId === carousel.id ? (
                  <div className="flex justify-between items-center mb-2 gap-2">
                    <input
                      type="text"
                      value={editingCarouselTitle}
                      onChange={e => setEditingCarouselTitle(e.target.value)}
                      className="flex-grow bg-jungle-surface text-white p-1 rounded-md border border-wood-brown text-sm"
                    />
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => handleSaveCarousel(carousel.id)} className="text-green-500 hover:text-green-400 text-xs font-bold">SAVE</button>
                      <button onClick={handleCancelEditCarousel} className="text-gray-500 hover:text-gray-400 text-xs font-bold">CANCEL</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-white">{carousel.title}</p>
                      <div className="flex gap-4">
                        <button onClick={() => handleEditCarousel(carousel)} className="text-blue-500 hover:text-blue-400 text-xs font-bold">EDIT</button>
                        <button onClick={() => deleteCarousel(carousel.id)} className="text-red-500 hover:text-red-400 text-xs font-bold">DELETE</button>
                      </div>
                  </div>
                )}
                 <div className="mt-2 pt-2 border-t border-wood-brown">
                  <select 
                    className="w-full bg-jungle-surface text-white p-1 rounded-md border border-wood-brown text-xs mb-2"
                    value={''}
                    onChange={(e) => addPartyToCarousel(carousel.id, e.target.value)}
                  >
                    <option value="" disabled>Add party...</option>
                    {activeParties.filter(p => !carousel.partyIds.includes(p.id)).map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                    {carouselParties.map(p => (
                      <div key={p.id} className="flex justify-between items-center bg-jungle-surface p-1 rounded text-xs">
                        <span className="truncate text-jungle-text/80">{p.name}</span>
                        <button onClick={() => removePartyFromCarousel(carousel.id, p.id)} className="text-red-600 hover:text-red-400 flex-shrink-0 ml-1">✖</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              )
            })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
