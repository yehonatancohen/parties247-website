"use client"
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useParties } from '../hooks/useParties';
import { Party, Carousel } from '../data/types';
import LoadingSpinner from './LoadingSpinner';
import { BASE_URL, LAST_TICKETS_TAG } from '../data/constants';
import { SearchIcon, EditIcon, ChevronDownIcon, ArrowUpIcon, ArrowDownIcon, MegaphoneIcon, ShareIcon, RefreshIcon } from './Icons';
import { pageLinkOptions } from '../data/pageLinks';
import { scrapePartyDetails } from '../services/scrapeService';

const sanitizeGoOutUrl = (input: string): string => {
  if (!input) {
    throw new Error('Please enter a go-out.co party URL.');
  }

  const trimmedInput = input.trim();
  const urlMatches: string[] = trimmedInput.match(/https?:\/\/[^\s"'<>]+/gi) || [];
  const goOutMatch = urlMatches.find(match => match.toLowerCase().includes('go-out.co'));
  const candidate = goOutMatch || '';

  if (!candidate) {
    throw new Error('Unable to find a go-out.co URL in the provided input.');
  }

  try {
    const parsed = new URL(candidate);
    return parsed.href;
  } catch (error) {
    throw new Error('The provided input does not contain a valid go-out.co URL.');
  }
};

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

const pageTagOptions = pageLinkOptions
  .filter((option): option is typeof option & { tag: string } => Boolean(option.tag))
  .map((option) => ({ label: option.label, tag: option.tag }));

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

  const togglePromotion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setFormData(prev => {
      const currentTags = prev.tags || [];
      const newTags = isChecked
        ? (currentTags.includes('promotion') ? currentTags : [...currentTags, 'promotion'])
        : currentTags.filter(t => t !== 'promotion');
      return { ...prev, tags: newTags };
    });
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
            <label htmlFor="slug" className="block text-sm text-jungle-text/80 mb-1">Slug</label>
            <input type="text" id="slug" name="slug" value={formData.slug} onChange={handleChange} className={inputClass} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="imageUrl" className="block text-sm text-jungle-text/80 mb-1">Image URL</label>
              <input type="url" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label htmlFor="originalUrl" className="block text-sm text-jungle-text/80 mb-1">Ticket URL</label>
              <input type="url" id="originalUrl" name="originalUrl" value={formData.originalUrl} onChange={handleChange} className={inputClass} required />
            </div>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm text-jungle-text/80 mb-1">Start Time</label>
            <input type="datetime-local" id="date" name="date" value={getLocalDateTimeString(formData.date)} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label htmlFor="location.name" className="block text-sm text-jungle-text/80 mb-1">Location</label>
            <input type="text" id="location.name" name="location.name" value={formData.location.name} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm text-jungle-text/80 mb-1">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} className={`${inputClass} h-24`} />
          </div>
          <div>
            <label htmlFor="pixelId" className="block text-sm text-jungle-text/80 mb-1">Meta Pixel ID (Optional)</label>
            <input
              type="text"
              id="pixelId"
              name="pixelId"
              value={formData.pixelId || ''}
              onChange={handleChange}
              placeholder="e.g., 123456789012345"
              className={inputClass}
            />
            <p className="text-xs text-jungle-text/50 mt-1">Facebook/Meta Pixel ID for tracking conversions when users click the purchase button</p>
          </div>
          <div className="flex items-center gap-2 bg-jungle-deep p-2 rounded border border-wood-brown">
            <input
              type="checkbox"
              id="isPromotion"
              checked={formData.tags?.includes('promotion') || false}
              onChange={togglePromotion}
              className="w-4 h-4"
            />
            <label htmlFor="isPromotion" className="text-sm text-white font-semibold">
              Is Promotion Party (Hidden from site search)
            </label>
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

type PromotionMessage = {
  type: 'success' | 'error' | 'info';
  message: React.ReactNode;
};

const AdminDashboard: React.FC = () => {
  const { allParties: parties, addParty, deleteParty, updateParty, carousels, addCarousel, deleteCarousel, updateCarousel, reorderCarousels, addPartyToCarousel, removePartyFromCarousel, defaultReferral, setDefaultReferral } = useParties();

  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [singleAddCarouselIds, setSingleAddCarouselIds] = useState<string[]>([]);
  const [selectedPageTags, setSelectedPageTags] = useState<string[]>([]);

  const [localDefaultReferral, setLocalDefaultReferral] = useState('');
  const [newCarouselTitle, setNewCarouselTitle] = useState('');

  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [partySearchTerm, setPartySearchTerm] = useState('');
  const [partySort, setPartySort] = useState<{ key: 'date' | 'name', direction: 'asc' | 'desc' }>({ key: 'date', direction: 'asc' });

  const [promotionMessages, setPromotionMessages] = useState<Record<string, PromotionMessage>>({});
  const [isRefreshingCovers, setIsRefreshingCovers] = useState(false);
  const [coverRefreshStatus, setCoverRefreshStatus] = useState<string | null>(null);

  const [refreshingPartyIds, setRefreshingPartyIds] = useState<string[]>([]);

  const [isRefreshingAllParses, setIsRefreshingAllParses] = useState(false);
  const [refreshAllParsesStatus, setRefreshAllParsesStatus] = useState<string | null>(null);

  const [editingCarouselId, setEditingCarouselId] = useState<string | null>(null);
  const [editingCarouselTitle, setEditingCarouselTitle] = useState('');

  useEffect(() => {
    setLocalDefaultReferral(defaultReferral);
  }, [defaultReferral]);

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

  const sortedCarousels = useMemo(() => [...carousels].sort((a, b) => a.order - b.order), [carousels]);

  const handleRefreshParty = async (party: Party) => {
    if (!party.originalUrl || !party.originalUrl.includes('go-out.co')) {
      alert('Cannot refresh: Invalid or missing go-out.co URL');
      return;
    }

    setRefreshingPartyIds(prev => [...prev, party.id]);
    try {
      const scraped = await scrapePartyDetails(party.originalUrl);

      // Exclude slug from the update to prevent overwriting it
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { slug, ...scrapedWithoutSlug } = scraped;

      await updateParty({
        ...party,
        ...scrapedWithoutSlug,
        tags: Array.from(new Set([...party.tags, ...scraped.tags]))
      });
      setPromotionMessages(prev => ({
        ...prev,
        [party.id]: { type: 'success', message: 'Party data refreshed! 🔄' }
      }));
    } catch (error) {
      console.error('Failed to refresh party', error);
      setPromotionMessages(prev => ({
        ...prev,
        [party.id]: { type: 'error', message: 'Failed to refresh data.' }
      }));
    } finally {
      setRefreshingPartyIds(prev => prev.filter(id => id !== party.id));
    }
  };

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

  const handleRefreshAllCoverImages = useCallback(async () => {
    setCoverRefreshStatus(null);
    setIsRefreshingCovers(true);

    const targets = activeParties.filter((party) => party.originalUrl?.includes('go-out.co'));
    if (targets.length === 0) {
      setCoverRefreshStatus('No active go-out.co parties found.');
      setIsRefreshingCovers(false);
      return;
    }

    let updatedCount = 0;
    let failedCount = 0;

    for (const party of targets) {
      try {
        const scraped = await scrapePartyDetails(party.originalUrl);
        if (scraped.imageUrl && scraped.imageUrl !== party.imageUrl) {
          await updateParty({ ...party, imageUrl: scraped.imageUrl });
          updatedCount += 1;
        }
      } catch (error) {
        failedCount += 1;
        console.error('Failed to refresh cover image for party', party.id, error);
      }
    }

    setCoverRefreshStatus(
      `Updated ${updatedCount} cover image${updatedCount === 1 ? '' : 's'}.` +
      (failedCount ? ` ${failedCount} failed.` : '')
    );
    setCoverRefreshStatus(
      `Updated ${updatedCount} cover image${updatedCount === 1 ? '' : 's'}.` +
      (failedCount ? ` ${failedCount} failed.` : '')
    );
    setIsRefreshingCovers(false);
  }, [activeParties, updateParty]);

  const handleRefreshAllPartyData = useCallback(async () => {
    setRefreshAllParsesStatus(null);
    setIsRefreshingAllParses(true);

    const targets = activeParties.filter((party) => party.originalUrl?.includes('go-out.co'));
    if (targets.length === 0) {
      setRefreshAllParsesStatus('No active go-out.co parties found.');
      setIsRefreshingAllParses(false);
      return;
    }

    let updatedCount = 0;
    let failedCount = 0;

    for (const party of targets) {
      try {
        const scraped = await scrapePartyDetails(party.originalUrl);
        // Exclude slug to prevent overwriting
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { slug, ...scrapedWithoutSlug } = scraped;

        await updateParty({
          ...party,
          ...scrapedWithoutSlug,
          tags: Array.from(new Set([...party.tags, ...scraped.tags]))
        });
        updatedCount += 1;
      } catch (error) {
        failedCount += 1;
        console.error('Failed to refresh data for party', party.name, error);
      }
    }

    setRefreshAllParsesStatus(
      `Refreshed data for ${updatedCount} parties.` +
      (failedCount ? ` ${failedCount} failed.` : '')
    );
    setIsRefreshingAllParses(false);
  }, [activeParties, updateParty]);

  const handleSaveParty = async (updatedParty: Party) => {
    await updateParty(updatedParty);

    // Revalidate the page cache so changes (like pixel ID) are immediately visible
    try {
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: updatedParty.slug }),
      });
    } catch (e) {
      console.warn('Failed to revalidate page cache:', e);
    }

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
    await updateCarousel(carouselId, { title: editingCarouselTitle.trim() });
    handleCancelEditCarousel();
  };

  const handleMoveCarousel = async (carouselId: string, direction: 'up' | 'down') => {
    const currentIndex = sortedCarousels.findIndex(c => c.id === carouselId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sortedCarousels.length) return;

    const newOrder = [...sortedCarousels];
    const [movedCarousel] = newOrder.splice(currentIndex, 1);
    newOrder.splice(targetIndex, 0, movedCarousel);

    try {
      await reorderCarousels(newOrder.map(c => c.id));
    } catch (e) {
      console.error('An error occurred during the reorder operation:', e);
    }
  };

  const handleAddParty = useCallback(async () => {
    setError(null);

    let sanitizedUrl: string;
    try {
      sanitizedUrl = sanitizeGoOutUrl(url);
    } catch (validationError) {
      setError(validationError instanceof Error ? validationError.message : 'Please enter a valid go-out.co URL.');
      return;
    }

    const slugMatch = sanitizedUrl.match(/\/event\/([^/?#]+)/);
    const slug = slugMatch ? slugMatch[1] : null;

    if (slug && parties.some(party => party.slug === slug)) {
      setError('This party has already been added.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const newParty = await addParty(sanitizedUrl);
      const mergedTags = Array.from(new Set([...(newParty.tags || []), ...selectedPageTags]));
      const shouldUpdateParty =
        mergedTags.length !== (newParty.tags || []).length ||
        (defaultReferral && defaultReferral !== newParty.referralCode);

      if (shouldUpdateParty) {
        await updateParty({
          ...newParty,
          referralCode: defaultReferral || newParty.referralCode,
          tags: mergedTags,
        });
      }
      if (singleAddCarouselIds.length > 0) {
        await Promise.all(singleAddCarouselIds.map(carouselId => addPartyToCarousel(carouselId, newParty.id)));
      }
      setUrl('');
      setSingleAddCarouselIds([]);
      setSelectedPageTags([]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to add party.');
    } finally {
      setIsLoading(false);
    }
  }, [url, addParty, parties, updateParty, defaultReferral, singleAddCarouselIds, addPartyToCarousel, selectedPageTags]);

  const handleSingleAddCarouselChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(event.target.selectedOptions).map(option => option.value);
    setSingleAddCarouselIds(selected);
  };

  const toggleSelectedPageTag = (tag: string) => {
    setSelectedPageTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const getHighQualityImageUrl = useCallback((imageUrl: string) => {
    try {
      const url = new URL(imageUrl);

      if (url.searchParams.has('w')) {
        url.searchParams.set('w', '1600');
      }
      if (url.searchParams.has('width')) {
        url.searchParams.set('width', '1600');
      }
      if (url.searchParams.has('h')) {
        url.searchParams.delete('h');
      }
      if (url.searchParams.has('height')) {
        url.searchParams.delete('height');
      }
      if (url.searchParams.has('q')) {
        url.searchParams.set('q', '95');
      } else if (url.searchParams.has('quality')) {
        url.searchParams.set('quality', '95');
      } else {
        url.searchParams.append('q', '95');
      }

      return url.toString();
    } catch (error) {
      console.warn('Could not build high quality image URL, returning original.', error);
      return imageUrl;
    }
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      if (typeof document === 'undefined') {
        return false;
      }

      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (error) {
      console.error('Failed to copy text to clipboard', error);
      return false;
    }
  }, []);

  const handlePromoteParty = useCallback((party: Party) => {
    try {
      const highQualityUrl = getHighQualityImageUrl(party.imageUrl);

      setPromotionMessages(prev => ({
        ...prev,
        [party.id]: {
          type: 'success',
          message: (
            <span>
              התמונה מוכנה:&nbsp;
              <a
                href={highQualityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-jungle-accent hover:text-jungle-accent/80"
              >
                לפתיחת התמונה בלשונית חדשה
              </a>
            </span>
          ),
        },
      }));
    } catch (error) {
      console.error('Error preparing promo image link', error);
      setPromotionMessages(prev => ({
        ...prev,
        [party.id]: {
          type: 'error',
          message: 'לא הצלחנו להכין את קישור התמונה.',
        },
      }));
    }
  }, [getHighQualityImageUrl]);

  const handleCopyPartyLink = useCallback(async (party: Party) => {
    const partyUrl = `${BASE_URL}/event/${party.slug}`;

    const copied = await copyToClipboard(partyUrl);

    if (copied) {
      setPromotionMessages(prev => ({
        ...prev,
        [party.id]: {
          type: 'success',
          message: 'קישור האירוע הועתק ללוח! 📋',
        },
      }));
    } else {
      setPromotionMessages(prev => ({
        ...prev,
        [party.id]: {
          type: 'error',
          message: 'לא הצלחנו להעתיק את קישור האירוע.',
        },
      }));
    }
  }, [copyToClipboard]);

  const handleTogglePartyPageTag = useCallback((party: Party, tag: string) => {
    const hasTag = party.tags.includes(tag);
    const updatedTags = hasTag ? party.tags.filter((existingTag) => existingTag !== tag) : [...party.tags, tag];
    updateParty({ ...party, tags: updatedTags });
  }, [updateParty]);

  const toggleLastTicketsTag = useCallback((party: Party) => {
    const hasTag = party.tags.includes(LAST_TICKETS_TAG);
    const updatedTags = hasTag
      ? party.tags.filter((tag) => tag !== LAST_TICKETS_TAG)
      : [...party.tags, LAST_TICKETS_TAG];

    updateParty({ ...party, tags: updatedTags });
  }, [updateParty]);

  const handleCloneParty = useCallback(async (party: Party) => {
    if (!party.originalUrl) {
      alert('Cannot clone: Missing original URL');
      return;
    }

    // eslint-disable-next-line
    const confirm = window.confirm(`Clone "${party.name}" as a PROMOTION party?\n\nThis will create a hidden copy for campaign tracking.`);
    if (!confirm) return;

    try {
      // Create unique URL to force new entry in backend/DB
      const separator = party.originalUrl.includes('?') ? '&' : '?';
      const uniqueUrl = `${party.originalUrl}${separator}clone_ref=${Date.now()}`;

      const newParty = await addParty(uniqueUrl);

      // Update immediately to promotion status
      const baseSlug = party.slug.replace(/-promotion$/, '');
      const promotionSlug = `${baseSlug}-promotion`;

      // Ensure unique slug if multiple clones exist (though usually only 1 promotion copy per event)
      // Check if slug taken:
      let finalSlug = promotionSlug;
      let counter = 1;
      while (parties.some(p => p.slug === finalSlug && p.id !== newParty.id)) {
        finalSlug = `${promotionSlug}-${counter}`;
        counter++;
      }

      await updateParty({
        ...newParty,
        name: `${party.name} (Promo)`,
        slug: finalSlug,
        tags: Array.from(new Set([...(newParty.tags || []), 'promotion'])),
        referralCode: '', // Clear ref as requested
      });

      setPromotionMessages(prev => ({
        ...prev,
        [newParty.id]: { type: 'success', message: 'Cloned successfully as Promotion Party! 🚀' }
      }));

    } catch (e: any) {
      console.error(e);
      alert('Failed to clone party: ' + (e.message || 'Unknown error'));
    }
  }, [addParty, updateParty, parties]);

  // FIX: Explicitly type PartyListItem as React.FC to correctly handle props like 'key' and resolve assignment errors.
  const PartyListItem: React.FC<{ party: Party }> = ({ party }) => (
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
          <button
            onClick={() => handleRefreshParty(party)}
            disabled={refreshingPartyIds.includes(party.id)}
            className="bg-jungle-lime text-jungle-deep px-3 py-1 rounded-md hover:bg-opacity-80 transition-colors text-sm flex items-center gap-1.5 disabled:bg-gray-600 disabled:cursor-not-allowed"
            title="Re-parse data from URL"
          >
            {refreshingPartyIds.includes(party.id) ? <LoadingSpinner size="sm" /> : <RefreshIcon className="w-4 h-4" />}
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => handlePromoteParty(party)}
            className="bg-jungle-accent text-jungle-deep px-3 py-1 rounded-md hover:bg-opacity-80 transition-colors text-sm flex items-center gap-1.5"
          >
            <MegaphoneIcon className="w-4 h-4" /> <span className="hidden sm:inline">תמונה</span>
          </button>
          <button
            onClick={() => handleCopyPartyLink(party)}
            className="bg-jungle-surface text-jungle-accent border border-jungle-accent px-3 py-1 rounded-md hover:bg-jungle-accent/10 transition-colors text-sm flex items-center gap-1.5"
          >
            <ShareIcon className="w-4 h-4" /> <span className="hidden sm:inline">העתק</span>
          </button>
          <button onClick={() => setEditingParty(party)} className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center gap-1.5">
            <EditIcon className="w-4 h-4" /> <span className="hidden sm:inline">Edit</span>
          </button>
          <button onClick={() => deleteParty(party.id)} className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm">
            Delete
          </button>
          <button onClick={() => handleCloneParty(party)} className="bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 transition-colors text-sm" title="Clone as Promotion Party">
            Clone Promo
          </button>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-wood-brown">
        <TagInput tags={party.tags} onTagsChange={(newTags) => updateParty({ ...party, tags: newTags })} />
        <div className="flex flex-wrap gap-2 mt-2">
          <button
            onClick={() => toggleLastTicketsTag(party)}
            className={`px-3 py-1 rounded-full text-xs border transition-colors ${party.tags.includes(LAST_TICKETS_TAG)
              ? 'bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/30'
              : 'bg-jungle-surface text-jungle-text/80 border-wood-brown hover:border-red-400 hover:text-white'
              }`}
          >
            כרטיסים אחרונים
          </button>
          {pageTagOptions.map((option) => {
            const isActive = party.tags.includes(option.tag);
            return (
              <button
                key={option.tag}
                onClick={() => handleTogglePartyPageTag(party, option.tag)}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${isActive
                  ? 'bg-jungle-accent text-jungle-deep border-jungle-accent'
                  : 'bg-jungle-surface text-jungle-text/80 border-wood-brown hover:border-jungle-accent hover:text-white'
                  }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      {promotionMessages[party.id] && (
        <p
          className={`mt-2 text-xs ${promotionMessages[party.id].type === 'success'
            ? 'text-green-400'
            : promotionMessages[party.id].type === 'error'
              ? 'text-red-400'
              : 'text-jungle-accent'
            }`}
        >
          {promotionMessages[party.id]?.message}
        </p>
      )}
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
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
          <button
            onClick={handleRefreshAllCoverImages}
            disabled={isRefreshingCovers || isRefreshingAllParses}
            className="bg-jungle-lime text-jungle-deep font-bold py-2 px-4 rounded-md hover:bg-opacity-80 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isRefreshingCovers ? <LoadingSpinner /> : 'Refresh all cover images'}
          </button>

          <button
            onClick={handleRefreshAllPartyData}
            disabled={isRefreshingCovers || isRefreshingAllParses}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-80 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isRefreshingAllParses ? <LoadingSpinner /> : 'Refresh ALL Data'}
          </button>

        </div>
        <div className="mt-2">
          {coverRefreshStatus && (
            <p className="text-sm text-jungle-text/80">{coverRefreshStatus}</p>
          )}
          {refreshAllParsesStatus && (
            <p className="text-sm text-jungle-text/80">{refreshAllParsesStatus}</p>
          )}
        </div>
      </div>

      {/* Add Party Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste go-out.co party URL" className="flex-grow bg-jungle-deep text-white p-2 rounded-md border border-wood-brown focus:ring-2 focus:ring-jungle-lime focus:outline-none" disabled={isLoading} />
          <button onClick={handleAddParty} disabled={isLoading} className="bg-jungle-lime text-jungle-deep font-bold py-2 px-6 rounded-md hover:bg-opacity-80 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex justify-center items-center">
            {isLoading ? <LoadingSpinner /> : 'Add Party'}
          </button>
        </div>
        <div>
          <label className="block text-xs text-jungle-text/70 mb-1">Add to Carousels (Optional)</label>
          <select
            multiple
            value={singleAddCarouselIds}
            onChange={handleSingleAddCarouselChange}
            className="w-full bg-jungle-deep text-white p-2 rounded-md border border-wood-brown text-sm"
            disabled={isLoading || sortedCarousels.length === 0}
            size={Math.min(5, Math.max(1, sortedCarousels.length))}
          >
            {sortedCarousels.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          {sortedCarousels.length === 0 ? (
            <p className="text-xs text-jungle-text/60 mt-1">Create a carousel first to add parties automatically.</p>
          ) : (
            <p className="text-xs text-jungle-text/60 mt-1">Hold Ctrl (Windows) or Command (Mac) to select multiple carousels.</p>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs text-jungle-text/70">Website page tags</label>
            <span className="text-[11px] text-jungle-text/50">נוסף לתגיות החכמות</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {pageTagOptions.map((option) => {
              const isSelected = selectedPageTags.includes(option.tag);
              return (
                <button
                  key={option.tag}
                  type="button"
                  onClick={() => toggleSelectedPageTag(option.tag)}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${isSelected
                    ? 'bg-jungle-accent text-jungle-deep border-jungle-accent'
                    : 'bg-jungle-deep text-jungle-text/80 border-wood-brown hover:border-jungle-accent hover:text-white'
                    }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {selectedPageTags.length > 0 && (
            <p className="text-[11px] text-jungle-text/60 mt-2">יוחלו גם על האירוע החדש בזמן הוספה.</p>
          )}
        </div>
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-jungle-accent">Manage Active Parties ({activeParties.length})</h3>
          <div className="bg-jungle-deep p-3 rounded-md mb-3 space-y-2 sm:space-y-0 sm:flex sm:justify-between sm:items-center">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <SearchIcon className="w-4 h-4 text-gray-400" />
              </div>
              <input type="text" value={partySearchTerm} onChange={e => setPartySearchTerm(e.target.value)} placeholder="Search parties..." className="w-full bg-jungle-surface text-white p-2 pr-9 rounded-md border border-wood-brown text-sm" />
            </div>
            <div className="flex items-center gap-2 sm:mr-3">
              <span className="text-sm text-jungle-text/70">Sort by:</span>
              <button onClick={() => setPartySort({ key: 'date', direction: partySort.key === 'date' && partySort.direction === 'asc' ? 'desc' : 'asc' })} className={`px-2 py-1 text-sm rounded ${partySort.key === 'date' ? 'bg-jungle-accent text-jungle-deep' : 'bg-jungle-surface'}`}>Date</button>
              <button onClick={() => setPartySort({ key: 'name', direction: partySort.key === 'name' && partySort.direction === 'asc' ? 'desc' : 'asc' })} className={`px-2 py-1 text-sm rounded ${partySort.key === 'name' ? 'bg-jungle-accent text-jungle-deep' : 'bg-jungle-surface'}`}>Name</button>
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
            {sortedCarousels.map((carousel, index) => {
              const carouselParties = activeParties.filter(p => carousel.partyIds.includes(p.id));
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
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <button onClick={() => handleMoveCarousel(carousel.id, 'up')} disabled={index === 0} className="text-gray-400 disabled:opacity-30 hover:text-white"><ArrowUpIcon className="w-4 h-4" /></button>
                          <button onClick={() => handleMoveCarousel(carousel.id, 'down')} disabled={index === sortedCarousels.length - 1} className="text-gray-400 disabled:opacity-30 hover:text-white"><ArrowDownIcon className="w-4 h-4" /></button>
                        </div>
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
