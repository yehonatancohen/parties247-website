import React, { useState, useEffect, useRef } from 'react';
import { FilterState } from '../../types';
import DatePicker from './DatePicker';
import { CalendarIcon } from './Icons';

interface AdvancedFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

const initialFilters: FilterState = {
  region: '',
  musicType: '',
  eventType: '',
  age: '',
  tags: [],
  date: '',
};

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Handle clicks outside of the datepicker to close it
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


  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date) => {
     // date is now a UTC date from the picker
     setFilters(prev => ({ ...prev, date: date.toISOString().split('T')[0] }));
     setIsDatePickerOpen(false);
  };
  
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFilters(prev => {
      const newTags = checked
        ? [...prev.tags, value]
        : prev.tags.filter(tag => tag !== value);
      return { ...prev, tags: newTags };
    });
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const inputBaseClasses = "bg-jungle-surface border border-wood-brown text-white text-sm rounded-lg focus:ring-jungle-lime focus:border-jungle-lime block w-full p-2.5";
  const labelBaseClasses = "block mb-1 text-sm font-medium text-jungle-text/70";
  
  const tags = ['אלכוהול חופשי', 'בחוץ', 'אילת', 'תל אביב'];
  
  // The selectedDate prop must now handle the UTC string by creating a Date object from it.
  // `new Date('YYYY-MM-DD')` correctly parses it as UTC midnight.
  const selectedDateForPicker = filters.date ? new Date(filters.date) : null;

  return (
    <div className="bg-jungle-surface/50 p-4 rounded-lg mb-8 backdrop-blur-sm relative z-10 border border-wood-brown/50">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Region Filter */}
        <div>
          <label htmlFor="region" className={labelBaseClasses}>אזור</label>
          <select id="region" name="region" value={filters.region} onChange={handleSelectChange} className={inputBaseClasses}>
            <option value="">הכל</option>
            <option value="צפון">צפון</option>
            <option value="מרכז">מרכז</option>
            <option value="דרום">דרום</option>
          </select>
        </div>
        {/* Music Type Filter */}
        <div>
          <label htmlFor="musicType" className={labelBaseClasses}>סוג מוזיקה</label>
          <select id="musicType" name="musicType" value={filters.musicType} onChange={handleSelectChange} className={inputBaseClasses}>
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
          <select id="eventType" name="eventType" value={filters.eventType} onChange={handleSelectChange} className={inputBaseClasses}>
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
          <select id="age" name="age" value={filters.age} onChange={handleSelectChange} className={inputBaseClasses}>
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
            <span>{filters.date ? new Date(filters.date).toLocaleDateString('he-IL', {timeZone: 'UTC'}) : 'בחר תאריך'}</span>
            <CalendarIcon className="h-4 w-4 text-gray-400" />
          </button>
          {isDatePickerOpen && (
              <DatePicker 
                  selectedDate={selectedDateForPicker}
                  onDateSelect={handleDateSelect}
              />
          )}
        </div>
      </div>
      {/* More Options (Tags) */}
      <div className="mt-4">
        <label className={labelBaseClasses}>אפשרויות נוספות</label>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
            {tags.map(tag => (
              <div key={tag} className="flex items-center">
                <input id={`tag-${tag}`} type="checkbox" value={tag} checked={filters.tags.includes(tag)} onChange={handleTagChange} className="w-4 h-4 text-jungle-lime bg-jungle-deep border-wood-brown rounded focus:ring-jungle-lime" />
                <label htmlFor={`tag-${tag}`} className="mr-2 text-sm font-medium text-jungle-text">{tag}</label>
              </div>
            ))}
        </div>
      </div>
       {/* Clear Button */}
      <div className="mt-4 flex justify-between items-center">
        <button onClick={clearFilters} className="text-jungle-accent hover:text-white text-sm font-semibold transition-colors">
            נקה סינון
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilter;