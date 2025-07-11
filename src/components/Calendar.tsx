import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Event } from '../types/Event';
import { getCalendarDays, months, daysOfWeek, getFinancialYearMonths, isSameDay } from '../utils/dateUtils';
import CalendarGrid from './CalendarGrid';
import EventsList from './EventsList';
import EventModal from './EventModal';
import EventForm from './EventForm';

interface CalendarProps {
  events: Event[];
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onUpdateEvent: (eventId: string, event: Omit<Event, 'id'>) => void;
  onDeleteEvent: (eventId: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ events, onAddEvent, onUpdateEvent, onDeleteEvent }) => {
  const financialYearMonths = getFinancialYearMonths();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const currentMonth = financialYearMonths[currentMonthIndex];
  const days = getCalendarDays(currentMonth.year, currentMonth.month);

  console.log('Calendar render - Events count:', events.length);

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    } else if (direction === 'next' && currentMonthIndex < financialYearMonths.length - 1) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const handleAddEvent = () => {
    console.log('Calendar.handleAddEvent - Opening form');
    setEditingEvent(null);
    setIsEventFormOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    console.log('Calendar.handleEditEvent - Editing:', event.id);
    setEditingEvent(event);
    setIsEventFormOpen(true);
    setSelectedEvent(null);
  };

  const handleSaveEvent = (eventData: Omit<Event, 'id'>) => {
    console.log('Calendar.handleSaveEvent called with:', eventData);
    
    if (editingEvent) {
      console.log('Updating existing event:', editingEvent.id);
      onUpdateEvent(editingEvent.id, eventData);
    } else {
      console.log('Adding new event');
      onAddEvent(eventData);
    }
    
    setIsEventFormOpen(false);
    setEditingEvent(null);
    console.log('Form closed');
  };

  const handleDeleteEvent = (eventId: string) => {
    console.log('Calendar.handleDeleteEvent called for:', eventId);
    onDeleteEvent(eventId);
    setSelectedEvent(null);
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Calendar Section */}
      <div className="flex-1">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {months[currentMonth.month]} {currentMonth.year}
            </h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleAddEvent}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} className="mr-2" />
                Add Event
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  disabled={currentMonthIndex === 0}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm text-gray-600 px-4">
                  FY 2025-26
                </span>
                <button
                  onClick={() => navigateMonth('next')}
                  disabled={currentMonthIndex === financialYearMonths.length - 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <CalendarGrid
            days={days}
            events={events}
            onDateClick={handleDateClick}
            selectedDate={selectedDate}
          />
        </div>
      </div>

      {/* Events Sidebar */}
      <div className="w-full lg:w-80">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedDate ? (
              <>Events for {selectedDate.toLocaleDateString()}</>
            ) : (
              'Select a date to view events'
            )}
          </h3>
          <EventsList
            events={selectedDateEvents}
            onEventClick={setSelectedEvent}
          />
        </div>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      )}

      {/* Event Form Modal */}
      <EventForm
        event={editingEvent}
        isOpen={isEventFormOpen}
        onClose={() => {
          console.log('EventForm onClose called');
          setIsEventFormOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
      />
    </div>
  );
};

export default Calendar;