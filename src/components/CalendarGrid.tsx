import React from 'react';
import { Event } from '../types/Event';
import { CalendarDay } from '../types/Event';
import { isSameDay } from '../utils/dateUtils';

interface CalendarGridProps {
  days: CalendarDay[];
  events: Event[];
  onDateClick: (date: Date) => void;
  selectedDate?: Date;
}

const categoryColors = {
  wellness: 'bg-green-500',
  technical: 'bg-blue-500',
  'team-building': 'bg-purple-500',
  sports: 'bg-orange-500',
  celebration: 'bg-pink-500',
  training: 'bg-yellow-500',
  meeting: 'bg-gray-500'
};

const CalendarGrid: React.FC<CalendarGridProps> = ({ days, events, onDateClick, selectedDate }) => {
  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map((day, index) => {
        const dayEvents = getEventsForDate(day.date);
        const isSelected = selectedDate && isSameDay(day.date, selectedDate);
        
        return (
          <div
            key={index}
            className={`
              min-h-[80px] p-2 border border-gray-200 cursor-pointer transition-colors
              ${day.isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'}
              ${day.isToday ? 'bg-blue-50 border-blue-300' : ''}
              ${isSelected ? 'bg-blue-100 border-blue-400' : ''}
            `}
            onClick={() => onDateClick(day.date)}
          >
            <div className="text-sm font-medium mb-1">
              {day.date.getDate()}
            </div>
            <div className="space-y-1">
              {dayEvents.slice(0, 2).map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  className={`text-xs px-2 py-1 rounded text-white truncate ${categoryColors[event.category]}`}
                  title={event.title}
                >
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className="text-xs text-gray-500 px-2">
                  +{dayEvents.length - 2} more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CalendarGrid;