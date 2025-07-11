import { useState, useEffect } from 'react';
import { Event } from '../types/Event';
import { supabase } from '../lib/supabase';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load events from Supabase on component mount
  useEffect(() => {
    loadEvents();
    
    // Set up real-time subscription for events
    const subscription = supabase
      .channel('events-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'events' },
        (payload) => {
          console.log('Real-time event received:', payload);
          loadEvents(); // Reload events when changes occur
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      // Convert date strings back to Date objects
      const eventsWithDates = (data || []).map(event => ({
        ...event,
        date: new Date(event.date)
      }));

      setEvents(eventsWithDates);
      console.log('Events loaded from database:', eventsWithDates.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load events';
      setError(errorMessage);
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (eventData: Omit<Event, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: insertError } = await supabase
        .from('events')
        .insert([{
          title: eventData.title,
          description: eventData.description,
          date: eventData.date.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
          category: eventData.category,
          time: eventData.time || null,
          location: eventData.location || null,
          organizer: eventData.organizer || null
        }])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      console.log('Event added successfully to database:', data);
      // Events will be updated via real-time subscription
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add event';
      setError(errorMessage);
      console.error('Error adding event:', err);
      throw err; // Re-throw to handle in UI
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (eventId: string, eventData: Omit<Event, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: updateError } = await supabase
        .from('events')
        .update({
          title: eventData.title,
          description: eventData.description,
          date: eventData.date.toISOString().split('T')[0],
          category: eventData.category,
          time: eventData.time || null,
          location: eventData.location || null,
          organizer: eventData.organizer || null
        })
        .eq('id', eventId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      console.log('Event updated successfully in database:', data);
      // Events will be updated via real-time subscription
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update event';
      setError(errorMessage);
      console.error('Error updating event:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (deleteError) {
        throw deleteError;
      }

      console.log('Event deleted successfully from database');
      // Events will be updated via real-time subscription
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete event';
      setError(errorMessage);
      console.error('Error deleting event:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaultEvents = async () => {
    if (!window.confirm('Are you sure you want to reset all events to default? This will delete all custom events from the database.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First, delete all existing events
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all events

      if (deleteError) {
        throw deleteError;
      }

      // Then insert default events
      const { events: defaultEvents } = await import('../data/events');
      const eventsToInsert = defaultEvents.map(event => ({
        title: event.title,
        description: event.description,
        date: event.date.toISOString().split('T')[0],
        category: event.category,
        time: event.time || null,
        location: event.location || null,
        organizer: event.organizer || null
      }));

      const { error: insertError } = await supabase
        .from('events')
        .insert(eventsToInsert);

      if (insertError) {
        throw insertError;
      }

      console.log('Events reset to default successfully');
      // Events will be updated via real-time subscription
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset events';
      setError(errorMessage);
      console.error('Error resetting events:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    resetToDefaultEvents
  };
}