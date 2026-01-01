"use client";

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Next.js Navigation
import { FilterState } from '@/data/types'; // Adjust path
import DatePicker from './DatePicker';
import { CalendarIcon } from './Icons';

interface AdvancedFilterProps {
  // We no longer need an onFilterChange callback. 
  // The component updates the URL directly.
  defaultFilters: FilterState; 
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({ defaultFilters }) => {
  const router = useRouter();
  const searchParams = useSearchParams(); // To preserve other params if needed
  
  // UI State only (not data state)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close DatePicker on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [datePickerRef]);

  /**
   * CENTRAL URL UPDATE LOGIC
   * This is the engine of the component.
   */
  const updateFilter = (key: keyof FilterState, value: string | string[] | null) => {
    // 1. Get current params
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    // 2. Update the specific key
    if (!value || value.length === 0) {
      current.delete(key);
    } else {
      if (Array.isArray(value)) {
        // Join tags with comma: ?tags=alcohol,outside
        current.set(key, value.join(','));
      } else {
        current.set(key, value);
      }
    }

    // 3. Reset Page (Crucial: if on page 5 and we filter, we might have 0 results)
    // We assume the base path is /all-parties
    // We construct the new URL: /all-parties?region=North...
    const search = current.toString();
    const query = search ? `?${search}` : "";
    
    // 4. Push to router (Trigger Server Re-render)
    router.push(`/all-parties${query}`, { scroll: false });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateFilter(name as keyof FilterState, value);
  };

  const handleDateSelect = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    updateFilter('date', dateString);
    setIsDatePickerOpen(false);
  };
  
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const currentTags = defaultFilters.tags || [];
    
    let newTags: string[];
    if (checked) {
      newTags = [...currentTags, value];
    } else {
      newTags = currentTags.filter(tag => tag !== value);
    }
    
    updateFilter('tags', newTags);
  };

  const clearFilters = () => {
    router.push('/all-parties');
  };

  // Styles
  const inputBaseClasses = "bg-jungle-surface border border-wood-brown text-white text-sm rounded-lg focus:ring-jungle-lime focus:border-jungle-lime block w-full p-2.5";
  const labelBaseClasses = "block mb-1 text-sm font-medium text-jungle-text/70";
  const tags = ['אלכוהול חופשי', 'בחוץ', 'אילת', 'תל אביב'];

  return (
    <div className="bg-jungle-surface/50 p-4 rounded-lg mb-8 backdrop-blur-sm relative z-10 border border-wood-brown/50">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        
        {/* Region Filter */}
        <div>
          <label htmlFor="region" className={labelBaseClasses}>אזור</label>
          <select 
            id="region" 
            name="region" 
            value={defaultFilters.region} 
            onChange={handleSelectChange} 
            className={inputBaseClasses}
          >
            <option value="">הכל</option>
            <option value="צפון">צפון</option>
            <option value="מרכז">מרכז</option>
            <option value="דרום">דרום</option>
          </select>
        </div>

        {/* Music Type Filter */}
        <div>
          <label htmlFor="musicType" className={labelBaseClasses}>סוג מוזיקה</label>
          <select 
            id="musicType" 
            name="musicType" 
            value={defaultFilters.musicType} 
            onChange={handleSelectChange} 
            className={inputBaseClasses}
          >
            <option value="">הכל</option>
            <option value="מיינסטרים">מיינסטרים</option>
            <option value="טכנו">טכנו</option>
            <option value="טראנס">טראנס</option>
            <option value="אחר">אחר</option>
          </select>
        </div>

        {/* Event Type Filter */}
        <div>
          <label htmlFor="eventType" className={labelBaseClasses}>סוג אירוע</label>
          <select 
            id="eventType" 
            name="eventType" 
            value={defaultFilters.eventType} 
            onChange={handleSelectChange} 
            className={inputBaseClasses}
          >
            <option value="">הכל</option>
            <option value="מסיבת מועדון">מסיבת מועדון</option>
            <option value="מסיבת טבע">מסיבת טבע</option>
            <option value="פסטיבל">פסטיבל</option>
            <option value="מסיבת בית">מסיבת בית</option>
            <option value="אחר">אחר</option>
          </select>
        </div>

        {/* Age Filter */}
        <div>
          <label htmlFor="age" className={labelBaseClasses}>גיל</label>
          <select 
            id="age" 
            name="age" 
            value={defaultFilters.age} 
            onChange={handleSelectChange} 
            className={inputBaseClasses}
          >
            <option value="">הכל</option>
            <option value="נוער">נוער</option>
            <option value="18+">18+</option>
            <option value="21+">21+</option>
            <option value="כל הגילאים">כל הגילאים</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="relative col-span-2 md:col-span-1" ref={datePickerRef}>
          <label htmlFor="date" className={labelBaseClasses}>תאריך</label>
          <button 
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)} 
            className={`${inputBaseClasses} text-right flex justify-between items-center`}
          >
            <span>
              {defaultFilters.date 
                ? new Date(defaultFilters.date).toLocaleDateString('he-IL', {timeZone: 'UTC'}) 
                : 'בחר תאריך'}
            </span>
            <CalendarIcon className="h-4 w-4 text-gray-400" />
          </button>
          
          {isDatePickerOpen && (
            <DatePicker 
              selectedDate={defaultFilters.date ? new Date(defaultFilters.date) : null}
              onDateSelect={handleDateSelect}
            />
          )}
        </div>
      </div>

      {/* Tags (More Options) */}
      <div className="mt-4">
        <label className={labelBaseClasses}>אפשרויות נוספות</label>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
            {tags.map(tag => (
              <div key={tag} className="flex items-center">
                <input 
                  id={`tag-${tag}`} 
                  type="checkbox" 
                  value={tag} 
                  // Check if tag exists in the array passed from props
                  checked={defaultFilters.tags.includes(tag)} 
                  onChange={handleTagChange} 
                  className="w-4 h-4 text-jungle-lime bg-jungle-deep border-wood-brown rounded focus:ring-jungle-lime" 
                />
                <label htmlFor={`tag-${tag}`} className="mr-2 text-sm font-medium text-jungle-text">{tag}</label>
              </div>
            ))}
        </div>
      </div>

      {/* Clear Button */}
      <div className="mt-4 flex justify-between items-center">
        <button 
          onClick={clearFilters} 
          className="text-jungle-accent hover:text-white text-sm font-semibold transition-colors"
        >
            נקה סינון
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilter;