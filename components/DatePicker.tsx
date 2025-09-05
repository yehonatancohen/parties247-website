import React, { useState } from 'react';

interface DatePickerProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateSelect }) => {
  // viewDate is the month/year currently being displayed in the calendar
  const [viewDate, setViewDate] = useState(selectedDate || new Date());

  const daysOfWeek = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
  
  // Work with UTC dates to avoid timezone issues
  const year = viewDate.getUTCFullYear();
  const month = viewDate.getUTCMonth(); // 0-indexed

  // day of the week (0=Sunday) for the first day of the month
  const firstDayOfMonth = new Date(Date.UTC(year, month, 1)).getUTCDay();
  // Total number of days in the current month
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const handlePrevMonth = () => {
    setViewDate(new Date(Date.UTC(year, month - 1, 1)));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(Date.UTC(year, month + 1, 1)));
  };
  
  const handleDateClick = (day: number) => {
    // Create a new date in UTC to pass back
    onDateSelect(new Date(Date.UTC(year, month, day)));
  };

  const renderDays = () => {
    const days = [];
    // Blank days for the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`blank-${i}`} className="w-8 h-8"></div>);
    }
    
    // Month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate && 
        selectedDate.getUTCDate() === day &&
        selectedDate.getUTCMonth() === month &&
        selectedDate.getUTCFullYear() === year;

      const isToday = today.getUTCDate() === day && 
        today.getUTCMonth() === month &&
        today.getUTCFullYear() === year;

      const dayClasses = `w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-colors text-sm
        ${isSelected ? 'bg-brand-primary text-white font-bold' : ''}
        ${!isSelected && isToday ? 'border border-brand-secondary text-brand-secondary' : ''}
        ${!isSelected && !isToday ? 'hover:bg-brand-surface' : ''}
      `;
      days.push(
        <button key={day} onClick={() => handleDateClick(day)} className={dayClasses}>
          {day}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="absolute top-full right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-2xl z-50 w-64">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-brand-surface text-lg">‹</button>
        <div className="font-bold text-white">
          {new Intl.DateTimeFormat('he-IL', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(viewDate)}
        </div>
        <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-brand-surface text-lg">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-gray-400 text-xs mb-2">
        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-gray-200">
        {renderDays()}
      </div>
    </div>
  );
};

export default DatePicker;