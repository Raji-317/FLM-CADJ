import { useState } from "react";
import { isSameCalendarDate } from "@/utils/scheduleUtils";

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  substituteLeaves?: any[];
}

export const Calendar = ({ selectedDate, onDateSelect, substituteLeaves = [] }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDate = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-10"></div>);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const isSelected = isSameDate(date, selectedDate);
    const isTodayDate = isToday(date);

    // Check if this date has any accepted substitute coverages
    const hasSubstituteClass = Array.isArray(substituteLeaves) && substituteLeaves.some(l => 
      l.affectedClasses && l.affectedClasses.some((c: any) => 
        c.substituteStatus === 'accepted' && 
        isSameCalendarDate(c.date || l.startDate, date)
      )
    );

    days.push(
      <button
        key={day}
        onClick={() => onDateSelect(date)}
        title={hasSubstituteClass ? "Has accepted substitute period" : undefined}
        className={`relative h-10 w-10 rounded-lg text-sm font-medium transition-colors flex flex-col items-center justify-center ${
          isSelected
            ? 'bg-blue-600 text-white shadow-sm'
            : isTodayDate
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        <span className="leading-tight">{day}</span>
        {hasSubstituteClass && (
          <span 
            className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-amber-300' : 'bg-purple-600'}`} 
            title="Substitute coverage scheduled"
          />
        )}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold text-gray-900">
          {formatMonth(currentMonth)}
        </h3>
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  );
};
