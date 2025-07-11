import React from 'react';
import Header from './components/Header';
import Calendar from './components/Calendar';
import Legend from './components/Legend';
import DatabaseInfo from './components/DatabaseInfo';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { useEvents } from './hooks/useEvents';

function App() {
  const { 
    events, 
    loading, 
    error, 
    addEvent, 
    updateEvent, 
    deleteEvent, 
    resetToDefaultEvents 
  } = useEvents();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Connecting to database..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage 
          message="Failed to connect to database" 
          details={error}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onResetEvents={resetToDefaultEvents} />
      <main className="container mx-auto px-4 py-8">
        <DatabaseInfo />
        <Legend />
        <Calendar 
          events={events}
          onAddEvent={addEvent}
          onUpdateEvent={updateEvent}
          onDeleteEvent={deleteEvent}
        />
      </main>
    </div>
  );
}

export default App;