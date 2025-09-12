import React, { useState, useCallback, useEffect, DragEvent } from 'react';
import { useParties } from '../hooks/useParties';
import { Party, Carousel } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { scrapePartyUrlsFromSection } from '../services/scrapeService';
import * as api from '../services/api';

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
  const { parties, addParty, deleteParty, updateParty, carousels, addCarousel, updateCarousel, deleteCarousel, refetchCarousels, defaultReferral, setDefaultReferral } = useParties();
  
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [addMode, setAddMode] = useState<'single' | 'section'>('single');
  const [sectionUrl, setSectionUrl] = useState('');
  const [sectionTag, setSectionTag] = useState('');
  const [sectionIsLoading, setSectionIsLoading] = useState(false);
  const [sectionError, setSectionError] = useState<string | null>(null);
  const [sectionProgress, setSectionProgress] = useState('');

  const [newCarouselTitle, setNewCarouselTitle] = useState('');
  const [editingCarousel, setEditingCarousel] = useState<Carousel | null>(null);
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [draggedCarouselId, setDraggedCarouselId] = useState<string | null>(null);
  
  const [localDefaultReferral, setLocalDefaultReferral] = useState('');

  useEffect(() => {
    setLocalDefaultReferral(defaultReferral);
  }, [defaultReferral]);


  const handleSaveDefaultReferral = async () => {
    try {
      await setDefaultReferral(localDefaultReferral);
      alert('Default referral code saved!');
    } catch {
      // Error is handled in the context provider
    }
  };

  const handleAddParty = useCallback(async () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl || !trimmedUrl.includes('go-out.co')) {
      setError('Please enter a valid go-out.co URL.');
      return;
    }
    if (parties.some(party => party.originalUrl === trimmedUrl)) {
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
    if (!sectionUrl.trim() || !sectionTag.trim()) {
      setSectionError('Please provide both a section URL and a tag name.');
      return;
    }
    setSectionIsLoading(true);
    setSectionError(null);
    setSectionProgress('Fetching section page...');

    try {
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(sectionUrl)}`;
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
      
      for (let i = 0; i < partyUrls.length; i++) {
        const pUrl = partyUrls[i];
        setSectionProgress(`Adding party ${i + 1} of ${partyUrls.length}...`);

        if (parties.some(p => p.originalUrl === pUrl)) {
          console.log(`Skipping already existing party: ${pUrl}`);
          continue;
        }

        try {
          const newParty = await addParty(pUrl);
          const partyWithUpdates = {
            ...newParty,
            tags: [...newParty.tags, sectionTag.trim()],
            referralCode: defaultReferral || ''
          };
          await updateParty(partyWithUpdates);
        } catch (addError) {
          console.error(`Failed to add party ${pUrl}:`, addError);
        }
      }

      setSectionProgress(`Done! Added parties with tag "${sectionTag}".`);
      setSectionUrl('');
      setSectionTag('');

    } catch (err) {
      console.error(err);
      setSectionError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setSectionIsLoading(false);
    }
  };
  
  const handleCreateCarousel = async () => {
    if (newCarouselTitle.trim()) {
      await addCarousel(newCarouselTitle.trim());
      setNewCarouselTitle('');
    }
  };

  const handleUpdateCarouselParties = async (partyId: string, isInCarousel: boolean) => {
    if (!editingCarousel) return;
    const newPartyIds = isInCarousel ? editingCarousel.partyIds.filter(id => id !== partyId) : [...editingCarousel.partyIds, partyId];
    const updated = { ...editingCarousel, partyIds: newPartyIds };
    setEditingCarousel(updated);
    await updateCarousel(updated);
  };
  
  const handleDeleteCarousel = async (carouselId: string) => {
    if (window.confirm('Are you sure you want to delete this carousel?')) {
      await deleteCarousel(carouselId);
    }
  };

  const handleTitleEditStart = (carousel: Carousel) => {
    setEditingTitleId(carousel.id);
    setTempTitle(carousel.title);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempTitle(e.target.value);
  };

  const handleTitleSave = async (carouselId: string) => {
    const carousel = carousels.find(c => c.id === carouselId);
    if (carousel && tempTitle.trim() && carousel.title !== tempTitle.trim()) {
      await updateCarousel({ ...carousel, title: tempTitle.trim() });
    }
    setEditingTitleId(null);
  };
  
  const handleDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
    setDraggedCarouselId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    if (!draggedCarouselId || draggedCarouselId === targetId) return;

    const currentCarousels = [...carousels].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
    const draggedIndex = currentCarousels.findIndex(c => c.id === draggedCarouselId);
    const targetIndex = currentCarousels.findIndex(c => c.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    const reordered = [...currentCarousels];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, draggedItem);
    
    const orderedIds = reordered.map(c => c.id);
    
    try {
      await api.reorderCarousels(orderedIds);
      await refetchCarousels();
    } catch (err) {
      console.error("Failed to save carousel order", err);
      alert(`Error saving new order: ${err instanceof Error ? err.message : 'Unknown error'}. Please refresh.`);
    }

    setDraggedCarouselId(null);
  };

  const sortedParties = [...parties].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const sortedCarousels = [...carousels].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));

  if (editingCarousel) {
    const filteredPartiesForModal = sortedParties.filter(p => 
        p.name.toLowerCase().includes(modalSearchTerm.toLowerCase()) || 
        p.location.toLowerCase().includes(modalSearchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-jungle-surface rounded-lg shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col border border-wood-brown">
                <div className="p-4 border-b border-wood-brown flex justify-between items-center flex-shrink-0">
                    <h3 className="text-xl font-display text-white">Editing: {editingCarousel.title}</h3>
                    <button onClick={() => setEditingCarousel(null)} className="text-2xl text-jungle-text/70 hover:text-white">&times;</button>
                </div>
                <div className="p-4 flex-shrink-0">
                     <input
                        type="text"
                        placeholder="Search parties..."
                        value={modalSearchTerm}
                        onChange={(e) => setModalSearchTerm(e.target.value)}
                        className="w-full bg-jungle-deep text-white p-2 rounded-md border border-wood-brown"
                    />
                </div>
                <div className="flex-grow overflow-y-auto px-4 pb-4 space-y-2">
                    {filteredPartiesForModal.map(party => {
                        const isInCarousel = editingCarousel.partyIds.includes(party.id);
                        return (
                            <div key={party.id} className="flex items-center bg-jungle-deep p-2 rounded-md">
                                <input
                                    type="checkbox"
                                    id={`party-check-${party.id}`}
                                    checked={isInCarousel}
                                    onChange={() => handleUpdateCarouselParties(party.id, isInCarousel)}
                                    className="w-5 h-5 text-jungle-lime bg-gray-700 border-gray-600 rounded focus:ring-jungle-lime"
                                />
                                <label htmlFor={`party-check-${party.id}`} className="mr-3 text-white truncate flex-grow cursor-pointer">
                                    <span className="font-semibold">{party.name}</span>
                                    <span className="text-xs text-jungle-text/60 block">{party.location}</span>
                                </label>
                            </div>
                        )
                    })}
                </div>
                <div className="p-4 border-t border-wood-brown text-right flex-shrink-0">
                    <button onClick={() => setEditingCarousel(null)} className="bg-jungle-accent text-jungle-deep font-bold py-2 px-6 rounded-md hover:bg-opacity-80">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-jungle-surface p-6 rounded-lg shadow-lg max-w-7xl mx-auto space-y-8">
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
            <input type="text" value={sectionTag} onChange={(e) => setSectionTag(e.target.value)} placeholder="Tag name for these parties (e.g., Rosh Hashana)" className="w-full bg-jungle-deep text-white p-2 rounded-md border border-wood-brown" disabled={sectionIsLoading} />
            <button onClick={handleScrapeSection} disabled={sectionIsLoading} className="w-full bg-jungle-lime text-jungle-deep font-bold py-2 px-6 rounded-md disabled:bg-gray-600 flex justify-center items-center">
              {sectionIsLoading ? <LoadingSpinner /> : 'Scrape & Add Parties'}
            </button>
            {sectionProgress && <p className="text-jungle-accent mt-2 text-sm text-center">{sectionProgress}</p>}
            {sectionError && <p className="text-red-500 mt-2 text-sm text-center">{sectionError}</p>}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-jungle-accent">Manage Parties ({parties.length})</h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {sortedParties.map(party => (
              <div key={party.id} className="bg-jungle-deep p-3 rounded-md">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-white truncate">{party.name}</p>
                    <p className="text-sm text-jungle-text/60">{party.location} - {new Date(party.date).toLocaleDateString('he-IL')}</p>
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
                  <button onClick={() => deleteParty(party.id)} className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm flex-shrink-0">
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
          <h3 className="text-lg font-semibold mb-2 text-jungle-accent">Manage Homepage Categories</h3>
          <div className="mb-4">
            <div className="flex gap-2">
              <input type="text" value={newCarouselTitle} onChange={(e) => setNewCarouselTitle(e.target.value)} placeholder="New category title" className="flex-grow bg-jungle-deep text-white p-2 rounded-md border border-wood-brown" />
              <button onClick={handleCreateCarousel} className="bg-jungle-accent text-jungle-deep font-bold py-2 px-4 rounded-md hover:bg-opacity-80">Create</button>
            </div>
          </div>
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
            {sortedCarousels.map(carousel => (
              <div 
                key={carousel.id} 
                className={`bg-jungle-deep p-3 rounded-md flex justify-between items-center cursor-move ${draggedCarouselId === carousel.id ? 'opacity-50' : ''}`}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, carousel.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, carousel.id)}
                onDragEnd={() => setDraggedCarouselId(null)}
              >
                <div>
                  {editingTitleId === carousel.id ? (
                    <input
                      type="text"
                      value={tempTitle}
                      onChange={handleTitleChange}
                      onBlur={() => handleTitleSave(carousel.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleTitleSave(carousel.id)}
                      className="bg-jungle-surface p-1 rounded"
                      autoFocus
                    />
                  ) : (
                    <p className="font-semibold text-white" onClick={() => handleTitleEditStart(carousel)}>{carousel.title}</p>
                  )}
                  <p className="text-sm text-jungle-text/60">{carousel.partyIds.length} parties</p>
                </div>
                <div className="flex items-center gap-2">
                   <button onClick={() => { setEditingCarousel(carousel); setModalSearchTerm(''); }} className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm">Edit Parties</button>
                  <button onClick={() => handleDeleteCarousel(carousel.id)} className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm">Delete</button>
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