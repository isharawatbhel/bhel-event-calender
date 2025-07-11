import React from 'react';
import { Event } from '../types/Event';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

interface EventsListProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

const categoryColors = {
  wellness: 'bg-green-100 text-green-800 border-green-200',
  technical: 'bg-blue-100 text-blue-800 border-blue-200',
  'team-building': 'bg-purple-100 text-purple-800 border-purple-200',
  sports: 'bg-orange-100 text-orange-800 border-orange-200',
  celebration: 'bg-pink-100 text-pink-800 border-pink-200',
  training: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  meeting: 'bg-gray-100 text-gray-800 border-gray-200'
};

const EventsList: React.FC<EventsListProps> = ({ events, onEventClick }) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No events scheduled for this date.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${categoryColors[event.category]}`}
          onClick={() => onEventClick(event)}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <span className="text-xs font-medium px-2 py-1 bg-white bg-opacity-70 rounded">
              {event.category.replace('-', ' ').toUpperCase()}
            </span>
          </div>
          
          <p className="text-sm mb-3 opacity-90">{event.description}</p>
          
          <div className="space-y-1 text-xs opacity-80">
            {event.time && (
              <div className="flex items-center">
                <Clock size={12} className="mr-2" />
                <span>{event.time}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center">
                <MapPin size={12} className="mr-2" />
                <span>{event.location}</span>
              </div>
            )}
            {event.organizer && (
              <div className="flex items-center">
                <User size={12} className="mr-2" />
                <span>{event.organizer}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsList;